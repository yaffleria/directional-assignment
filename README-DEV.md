# 🎯 면접 준비 가이드 (Developer Guide)

> **이 문서는 면접관의 기술 질문에 대비하기 위한 내부 가이드입니다.**

## 📑 목차

- [1. 프로젝트 전체 아키텍처](#1-프로젝트-전체-아키텍처)
- [2. React Query 설정 및 활용](#2-react-query-설정-및-활용)
- [3. React 컴포넌트 구조 및 설계](#3-react-컴포넌트-구조-및-설계)
- [4. Monorepo 아키텍처 선택 이유](#4-monorepo-아키텍처-선택-이유)
- [5. 상태 관리 전략](#5-상태-관리-전략)
- [6. 성능 최적화 기법](#6-성능-최적화-기법)
- [7. 타입 안정성 보장](#7-타입-안정성-보장)
- [8. 예상 질문 & 답변](#8-예상-질문--답변)

---

## 1. 프로젝트 전체 아키텍처

### 1.1 왜 Monorepo인가?

**선택 이유:**

```
✅ 코드 재사용성 극대화
   - API 클라이언트, UI 컴포넌트, 유틸리티를 여러 앱에서 공유
   - DRY 원칙 준수로 유지보수성 향상

✅ 일관된 개발 환경
   - ESLint, TypeScript, Prettier 설정을 한 곳에서 관리
   - 모든 앱이 동일한 코드 스타일과 품질 기준 유지

✅ 원자적 변경(Atomic Changes)
   - API 스키마 변경 시 모든 소비자를 한 번에 업데이트
   - 타입 불일치로 인한 런타임 에러 사전 방지

✅ 확장성 고려
   - 새로운 앱(Admin, Mobile) 추가 시 기존 패키지 재사용
   - 점진적 마이그레이션 가능 (React → Next.js)
```

**대안 비교:**

| 아키텍처     | 장점                   | 단점                        | 선택 여부 |
| ------------ | ---------------------- | --------------------------- | --------- |
| **Monorepo** | 코드 공유 용이, 일관성 | 초기 설정 복잡              | ✅ 선택   |
| Multi-repo   | 독립적 배포            | 중복 코드, 버전 관리 어려움 | ❌        |
| Single App   | 단순함                 | 확장성 낮음                 | ❌        |

### 1.2 pnpm Workspace 선택 이유

**npm/yarn 대신 pnpm:**

```typescript
// pnpm의 장점
1. **디스크 공간 효율성**
   - 전역 store에 패키지 1번만 저장
   - 하드 링크로 node_modules 구성
   - 예: 5개 프로젝트에서 react@19 사용 시
     npm: react 5번 설치 (각 300MB)
     pnpm: react 1번 설치 + 링크 (300MB)

2. **엄격한 의존성 관리**
   - Phantom dependencies 방지
   - package.json에 명시된 패키지만 접근 가능
   - 타입 안정성 향상

3. **빠른 설치 속도**
   - 병렬 설치 + 하드 링크
   - CI/CD 시간 단축

4. **Monorepo 네이티브 지원**
   - workspace 프로토콜 (workspace:*)
   - 필터링 지원 (pnpm --filter react-app build)
```

### 1.3 디렉토리 구조 설계 원칙

```
directional-assignment/
├── apps/              # 애플리케이션 레이어
│   ├── react-app/    # CSR 전용 앱
│   └── next-app/     # SSR/SSG 앱
│
└── packages/          # 공유 라이브러리 레이어
    ├── api/          # 도메인 로직 (API 호출)
    ├── components/   # 프레젠테이션 로직
    ├── hooks/        # 비즈니스 로직 (재사용)
    ├── schema/       # 데이터 검증 로직
    └── utils/        # 헬퍼 함수
```

**계층 분리 이유:**

- **Separation of Concerns**: 각 패키지는 단일 책임
- **의존성 방향**: apps → packages (단방향)
- **테스트 용이성**: 패키지별 독립적 유닛 테스트 가능

---

## 2. React Query 설정 및 활용

### 2.1 QueryClient 설정 상세

**위치:** `apps/react-app/src/main.tsx`

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 서버 상태 신선도 유지
      staleTime: 0, // 즉시 stale 처리
      gcTime: 5 * 60 * 1000, // 5분간 캐시 유지

      // 재시도 전략
      retry: 1, // 1회만 재시도
      retryDelay: 1000, // 1초 후 재시도

      // 백그라운드 리페칭
      refetchOnWindowFocus: true, // 탭 전환 시 자동 리페치
      refetchOnReconnect: true // 네트워크 재연결 시
    },
    mutations: {
      // mutation 재시도 비활성화 (중복 요청 방지)
      retry: 0
    }
  }
})
```

**설정 근거:**

| 옵션                   | 값         | 이유                        |
| ---------------------- | ---------- | --------------------------- |
| `staleTime: 0`         | 즉시 stale | 게시판 특성상 실시간성 중요 |
| `gcTime: 5분`          | 5분 캐시   | 페이지 재방문 시 UX 향상    |
| `retry: 1`             | 1회 재시도 | 네트워크 일시 장애 대비     |
| `refetchOnWindowFocus` | true       | 탭 전환 후 최신 데이터 표시 |

### 2.2 무한 스크롤 구현 (useInfiniteQuery)

**위치:** `apps/react-app/src/pages/PostsListPage.tsx`

```typescript
const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
  // 쿼리 키: 필터 조건이 변경되면 새로운 쿼리로 인식
  queryKey: ['posts', search, category, sort, order],

  // 데이터 페칭 함수
  queryFn: async ({ pageParam }) => {
    const response = await api.posts.postsList({
      limit: 20,
      nextCursor: pageParam, // 커서 기반 페이지네이션
      search,
      category,
      sort,
      order
    })
    return response.data
  },

  // 초기 페이지 파라미터
  initialPageParam: undefined as string | undefined,

  // 다음 페이지 커서 추출
  getNextPageParam: (lastPage) => lastPage.nextCursor,

  // 캐시 전략
  staleTime: 0 // 필터 변경 시 즉시 리페치
})

// 모든 페이지의 아이템을 하나의 배열로 병합
const posts = data?.pages.flatMap((page) => page.items ?? []) || []
```

**핵심 개념 설명:**

1. **Cursor-based Pagination vs Offset-based**

   ```
   Offset-based (페이지 번호):
   - 문제: 실시간 데이터 추가/삭제 시 중복/누락 발생
   - 예: 1페이지 조회 중 새 글 등록 → 2페이지에서 중복 표시

   Cursor-based (커서):
   - 장점: 불변 포인터로 정확한 위치 추적
   - 구현: nextCursor를 기준으로 다음 20개 조회
   ```

2. **queryKey의 역할**

   ```typescript
   // 필터 조건이 queryKey에 포함되는 이유:
   queryKey: ['posts', search, category, sort, order]

   // 시나리오:
   1. 사용자가 category를 'NOTICE'로 변경
   2. queryKey 변경: ['posts', '', ''] → ['posts', '', 'NOTICE']
   3. React Query가 새로운 쿼리로 인식 → 자동 리페치
   4. 이전 캐시는 유지되어 뒤로가기 시 즉시 표시
   ```

3. **Intersection Observer와 통합**
   ```typescript
   const { ref } = useInView({
     onChange: (inView) => {
       // 사용자가 스크롤해서 sentinel 요소가 화면에 보이면
       if (inView && hasNextPage && !isFetchingNextPage) {
         fetchNextPage() // 다음 페이지 자동 로드
       }
     }
   })
   ```

### 2.3 Optimistic Updates (낙관적 업데이트)

**위치:** `packages/hooks/src/useDeletePost.ts`

```typescript
export function useDeletePost({ api }: UseDeletePostProps) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (postId: string) => api.posts.postsDelete(postId),

    // 성공 시 캐시 무효화
    onSuccess: () => {
      // 모든 posts 관련 쿼리 무효화 (검색, 필터링 포함)
      queryClient.invalidateQueries({
        queryKey: ['posts'],
        exact: false // 'posts'로 시작하는 모든 쿼리
      })
    }
  })
}
```

**왜 Optimistic Update를 사용하지 않았나?**

```
삭제의 경우 Optimistic Update를 사용하지 않은 이유:

1. 무한 스크롤 특성
   - 여러 페이지에 걸친 데이터 구조 (pages array)
   - 특정 페이지에서 아이템 제거 시 복잡한 상태 관리 필요

2. 에러 처리 복잡도
   - 삭제 실패 시 롤백이 UX에 혼란 초래
   - 재시도 로직도 복잡해짐

3. 네트워크 속도
   - API 응답이 충분히 빠름 (200ms 이하)
   - Optimistic Update의 이점이 크지 않음

대신 선택한 방법:
- invalidateQueries로 서버 상태와 동기화
- 사용자에게 로딩 상태 명확히 표시 (isDeleting)
```

### 2.4 Query Invalidation 전략

```typescript
// ❌ 나쁜 예: 특정 쿼리만 무효화
queryClient.invalidateQueries({
  queryKey: ['posts', 'tech', 'NOTICE', 'createdAt', 'desc']
})
// 문제: 다른 필터 조건의 캐시는 오래된 데이터 표시

// ✅ 좋은 예: 접두사 매칭으로 관련 쿼리 모두 무효화
queryClient.invalidateQueries({
  queryKey: ['posts'],
  exact: false
})
// 결과: 모든 필터/검색 조건의 posts 쿼리 리페치
```

---

## 3. React 컴포넌트 구조 및 설계

### 3.1 컴포넌트 분류 기준

**1. Presentational Components (프레젠테이션 컴포넌트)**

```typescript
// 위치: packages/components/src/ui/
// 특징:
// - Props로만 동작
// - 비즈니스 로직 없음
// - 재사용성 높음
// - Storybook 문서화 대상

// 예시: Button
export function Button({ children, variant, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant }))} {...props}>
      {children}
    </button>
  );
}
```

**2. Container Components (컨테이너 컴포넌트)**

```typescript
// 위치: apps/react-app/src/pages/
// 특징:
// - 데이터 페칭 담당 (React Query)
// - 상태 관리 (useState, useReducer)
// - 비즈니스 로직 포함
// - Presentational 컴포넌트 조합

// 예시: PostsListPage
export default function PostsListPage() {
  // 데이터 페칭
  const { data, isLoading } = useInfiniteQuery({ ... });

  // 상태 관리
  const [search, setSearch] = useState('');

  // 비즈니스 로직
  const handleDelete = useDeletePost();

  // Presentational 컴포넌트 렌더링
  return <PostsTable posts={posts} onDelete={handleDelete} />;
}
```

**3. Compound Components (복합 컴포넌트)**

```typescript
// 위치: packages/components/src/PostsTable/
// 특징:
// - 관련 기능을 하나로 묶음
// - 내부 상태 캡슐화
// - API 단순화

// 예시: PostsTable + ResizableColumns
export function PostsTable({ posts }: PostsTableProps) {
  // 컬럼 너비 상태 내부 관리
  const [columnWidths, setColumnWidths] = useState(DEFAULT_WIDTHS);
  const [hiddenColumns, setHiddenColumns] = useState<Set<string>>(new Set());

  return (
    <table>
      <TableHeader
        columns={columns}
        widths={columnWidths}
        onResize={setColumnWidths}
        onToggle={toggleColumn}
      />
      <TableBody posts={posts} hiddenColumns={hiddenColumns} />
    </table>
  );
}
```

### 3.2 Custom Hooks 설계 철학

**위치:** `packages/hooks/`

**1. useModal - 모달 상태 관리**

```typescript
// 문제: 모달 열기/닫기 + 데이터 전달이 반복됨
// 해결: 제네릭 훅으로 추상화

export function useModal<T = void>() {
  const [isOpen, setIsOpen] = useState(false)
  const [data, setData] = useState<T | null>(null)

  return {
    isOpen,
    data,
    open: (newData?: T) => {
      setData(newData ?? null)
      setIsOpen(true)
    },
    close: () => {
      setIsOpen(false)
      setTimeout(() => setData(null), 300) // 애니메이션 후 정리
    }
  }
}

// 사용:
const deleteModal = useModal<string>() // 제네릭으로 postId 타입 지정
deleteModal.open(postId)
deleteModal.data // string | null (타입 안전)
```

**2. useDeletePost - 삭제 로직 캡슐화**

```typescript
// 문제: 삭제 후 로직이 여러 컴포넌트에서 중복
// 해결: mutation + invalidation을 하나의 훅으로

export function useDeletePost({ api }: UseDeletePostProps) {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationFn: (postId: string) => api.posts.postsDelete(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    }
  })

  return {
    handleDelete: mutate,
    isPending
  }
}

// 장점:
// 1. 재사용성: PostsListPage, PostDetailPage 모두 사용
// 2. 일관성: 삭제 후 항상 캐시 무효화
// 3. 테스트 용이: 훅 단위 테스트 가능
```

### 3.3 Props Drilling 방지 전략

**문제 상황:**

```typescript
// ❌ Props Drilling 예시
<DashboardPage>
  <BarDonutView
    customColors={customColors}
    hiddenSeries={hiddenSeries}
    toggleSeries={toggleSeries}
    handleColorChange={handleColorChange}
    COLORS={COLORS}
  >
    <BarChart>
      <CustomLegend
        customColors={customColors}  // 3단계 전달
        onToggle={toggleSeries}
        onChange={handleColorChange}
      />
    </BarChart>
  </BarDonutView>
</DashboardPage>
```

**해결 방법:**

1. **상태 끌어올리기 (현재 사용)**

   ```typescript
   // DashboardPage에서 모든 상태 관리
   const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set())
   const [customColors, setCustomColors] = useState<Record<string, string>>({})

   // 이유:
   // - 차트 간 상태 공유 필요 (한 차트에서 설정한 색상을 다른 차트에도 적용)
   // - 뷰 전환 시 상태 유지 (Stacked → Dual Axis 이동 시에도 설정 유지)
   ```

2. **Context API (고려했지만 사용하지 않음)**
   ```typescript
   // 사용하지 않은 이유:
   // - 차트 설정은 DashboardPage에만 국한됨 (전역 상태 불필요)
   // - Props 깊이가 2~3단계로 관리 가능
   // - Context 사용 시 리렌더링 최적화 복잡도 증가
   ```

### 3.4 컴포넌트 렌더링 최적화

**1. React.memo 사용 여부**

```typescript
// ✅ 사용하는 경우: 무거운 컴포넌트
const CustomLegend = React.memo(({ items, onToggle }: LegendProps) => {
  // 차트 범례는 props 변경이 적지만 렌더링 비용이 높음
  return <ComplexLegendUI />;
});

// ❌ 사용하지 않는 경우: 간단한 컴포넌트
function Button({ children }: ButtonProps) {
  // memo의 비교 비용 > 렌더링 비용
  return <button>{children}</button>;
}
```

**2. useMemo 활용**

```typescript
// 위치: DashboardPage.tsx

const coffeeChartData = useMemo(() => {
  if (!coffeeConsumption?.teams) return []

  // 복잡한 데이터 변환 로직
  const dataMap = new Map<number, any>()
  coffeeConsumption.teams.forEach((team) => {
    team.series.forEach((point) => {
      const existing = dataMap.get(point.cups) || { cups: point.cups }
      existing[`${team.team} Productivity`] = point.productivity
      existing[`${team.team} Bugs`] = point.bugs
      dataMap.set(point.cups, existing)
    })
  })

  return Array.from(dataMap.values()).sort((a, b) => a.cups - b.cups)
}, [coffeeConsumption])

// 이유:
// - 데이터 변환이 매 렌더링마다 실행되면 성능 저하
// - coffeeConsumption이 변경될 때만 재계산
```

### 3.5 커스텀 Hooks 상세 분석

이 프로젝트에서 구현한 커스텀 훅들은 비즈니스 로직을 재사용 가능한 단위로 추상화합니다.

#### **useModal\<T> - 제네릭 모달 상태 관리**

**위치:** `packages/hooks/src/useModal.ts`

**목적:** 모달 열기/닫기와 데이터 전달 로직을 추상화

**전체 구현:**

```typescript
import { useState, useCallback } from 'react'

export function useModal<T = void>() {
  const [isOpen, setIsOpen] = useState(false)
  const [data, setData] = useState<T | null>(null)

  const open = useCallback((modalData?: T) => {
    if (modalData !== undefined) {
      setData(modalData)
    }
    setIsOpen(true)
  }, [])

  const close = useCallback(() => {
    setIsOpen(false)
    setData(null)
  }, [])

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [])

  return {
    isOpen,
    open,
    close,
    toggle,
    data
  }
}
```

**핵심 설계 결정:**

1. **제네릭 타입 매개변수**

   ```typescript
   // 타입 안전성 보장
   const deleteModal = useModal<string>() // postId
   const userModal = useModal<User>() // 사용자 정보
   const confirmModal = useModal<void>() // 데이터 없음

   deleteModal.data // string | null (타입 체크 가능)
   ```

2. **useCallback을 사용한 이유**
   - `open`, `close`, `toggle` 함수가 매 렌더링마다 재생성되는 것을 방지
   - 자식 컴포넌트에 props로 전달 시 불필요한 리렌더링 방지
   - 의존성 배열이 빈 배열 `[]` → 함수는 컴포넌트 생명주기 동안 동일한 참조 유지

3. **close 시 data를 null로 초기화하는 이유**
   ```typescript
   close: () => {
     setIsOpen(false)
     setData(null) // 메모리 누수 방지 + 다음 open 시 깨끗한 상태
   }
   ```

**사용 예시:**

```typescript
// PostsListPage.tsx
const deleteModal = useModal<string>();

// 모달 열기
<Button onClick={() => deleteModal.open(post.id)}>Delete</Button>

// 모달 컴포넌트
<DeletePostModal
  isOpen={deleteModal.isOpen}
  onClose={deleteModal.close}
  onConfirm={() => {
    handleDelete(deleteModal.data!);  // data는 string 타입
    deleteModal.close();
  }}
/>
```

**장점:**

- ✅ 타입 안전성: 제네릭으로 data 타입 보장
- ✅ 재사용성: 모든 모달에 사용 가능
- ✅ 코드 중복 제거: open/close 로직 한 곳에서 관리

---

#### **useDeletePost - 게시글 삭제 로직 캡슐화**

**위치:** `packages/hooks/src/useDeletePost.ts`

**목적:** 삭제 mutation + 캐시 무효화 로직을 하나의 훅으로 통합

**전체 구현:**

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { API } from '@repo/api'

interface UseDeletePostOptions {
  api: API
  onSuccess?: () => void
}

export function useDeletePost(options: UseDeletePostOptions) {
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: (id: string) => options.api.posts.postsDelete2(id),
    onSuccess: () => {
      // 모든 'posts' 쿼리 무효화 (검색, 필터링 결과 포함)
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      options?.onSuccess?.()
    }
  })

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id)
  }

  return {
    handleDelete,
    isPending: deleteMutation.isPending,
    isError: deleteMutation.isError,
    error: deleteMutation.error
  }
}
```

**핵심 설계 결정:**

1. **왜 API를 옵션으로 받는가?**

   ```typescript
   // 이유: 훅은 순수 로직만 포함, API 인스턴스는 외부에서 주입
   // 장점: 테스트 시 Mock API 주입 가능
   const { handleDelete } = useDeletePost({ api: mockApi })
   ```

2. **invalidateQueries의 작동 원리**

   ```typescript
   queryClient.invalidateQueries({ queryKey: ['posts'] })

   // 무효화되는 쿼리들:
   // ['posts']
   // ['posts', search, category, sort, order]
   // ['posts', 'other', 'params']
   // → 'posts'로 시작하는 모든 쿼리 리페치
   ```

3. **onSuccess 콜백을 옵션으로 제공하는 이유**

   ```typescript
   // 컴포넌트별 추가 로직 실행 가능
   const { handleDelete } = useDeletePost({
     api,
     onSuccess: () => {
       navigate('/posts') // 삭제 후 목록으로 이동
       toast.success('Post deleted')
     }
   })
   ```

4. **handleDelete를 async 함수로 만든 이유**
   ```typescript
   // 호출 측에서 비동기 처리 가능
   await handleDelete(postId)
   console.log('삭제 완료')
   ```

**사용 예시:**

```typescript
// PostsListPage.tsx
const { handleDelete, isPending } = useDeletePost({ api });

<PostsTable
  posts={posts}
  onDelete={handleDelete}
  isDeleting={isPending}
/>
```

**테스트 가능성:**

```typescript
// useDeletePost.test.ts
const mockApi = {
  posts: {
    postsDelete2: jest.fn().mockResolvedValue({})
  }
}

const { result } = renderHook(() => useDeletePost({ api: mockApi }))
await act(() => result.current.handleDelete('test-id'))

expect(mockApi.posts.postsDelete2).toHaveBeenCalledWith('test-id')
```

---

### 3.6 커스텀 컴포넌트 상세 분석

#### **PostsTable - 복합 기능 테이블 컴포넌트**

**위치:** `packages/components/src/PostsTable/PostsTable.tsx`

**목적:** 게시글 목록을 표시하며, 컬럼 리사이징과 visibility 토글 기능 제공

**주요 기능:**

1. **컬럼 리사이징 (Drag \u0026 Drop)**

```typescript
// 리사이징 상태 관리
const resizingRef = useRef<{
  columnId: string
  startX: number
  startWidth: number
} | null>(null)

const handleMouseDown = (e: React.MouseEvent, columnId: string) => {
  e.preventDefault()
  resizingRef.current = {
    columnId,
    startX: e.clientX,
    startWidth: columnWidths[columnId]
  }
  // 전역 이벤트 리스너 등록
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

const handleMouseMove = (e: MouseEvent) => {
  if (!resizingRef.current) return
  const { columnId, startX, startWidth } = resizingRef.current
  const diff = e.clientX - startX
  const newWidth = Math.max(50, startWidth + diff) // 최소 50px
  setColumnWidths((prev) => ({ ...prev, [columnId]: newWidth }))
}

const handleMouseUp = () => {
  resizingRef.current = null
  // 메모리 누수 방지: 이벤트 리스너 제거
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
}
```

**왜 document에 이벤트를 등록하는가?**

- 마우스가 컬럼 영역 밖으로 나가도 드래그 계속 가능
- 빠른 드래그 시 마우스가 요소를 벗어나는 문제 방지

2. **컬럼 Visibility 토글**

```typescript
const [visibleColumns, setVisibleColumns] = useState<ColumnId[]>([
  'title', 'category', 'userId', 'createdAt', 'actions'
]);

const toggleColumn = (columnId: ColumnId) => {
  if (columnId === 'actions') return;  // Actions는 항상 표시
  setVisibleColumns(prev =>
    prev.includes(columnId)
      ? prev.filter(id => id !== columnId)
      : [...prev, columnId]
  );
};

// 렌더링
{visibleColumns.includes('id') && (
  <td className="px-4 py-3">{post.id}</td>
)}
```

3. **내부 상태 캡슐화의 이점**

```typescript
// ❌ 나쁜 예: 부모 컴포넌트가 테이블 상세 상태 관리
<PostsTable
  posts={posts}
  columnWidths={columnWidths}
  onColumnResize={setColumnWidths}
  visibleColumns={visibleColumns}
  onToggleColumn={toggleColumn}
/>

// ✅ 좋은 예: 테이블이 자체 상태 관리
<PostsTable
  posts={posts}
  onDelete={handleDelete}
  onNavigate={navigate}
/>
```

**장점:**

- API 단순화: 부모는 핵심 데이터만 전달
- 재사용성: 다른 페이지에서도 동일하게 사용
- 관심사 분리: UI 세부사항은 컴포넌트 내부에

---

#### **CustomLegend - 인터랙티브 차트 범례**

**위치:** `packages/components/src/CustomLegend/CustomLegend.tsx`

**목적:** Recharts 차트의 범례에 시리즈 토글 + 색상 변경 기능 추가

**핵심 기능:**

1. **마커 모양 자동 결정 (Circle vs Square)**

```typescript
const getShape = (item: LegendItem) => {
  if (markerShape === 'circle') return <Circle size={12} fill="currentColor" />;
  if (markerShape === 'square') return <Square size={12} fill="currentColor" />;

  // Auto: strokeDasharray로 판단
  const isDashed = item.payload?.strokeDasharray === '5 5';
  return isDashed
    ? <Square size={12} fill="currentColor" />   // 점선 → 사각형
    : <Circle size={12} fill="currentColor" />;  // 실선 → 원형
};
```

**설계 이유:**

- 듀얼 축 차트에서 주축(실선)과 부축(점선)을 시각적으로 구분
- 사용자가 한눈에 어떤 데이터 시리즈인지 파악 가능

2. **컬러 피커 구현**

```typescript
const [colorPicker, setColorPicker] = useState<string | null>(null);

// 컬러 버튼 클릭
<Button
  onClick={(e) => {
    e.stopPropagation();  // 범례 토글 이벤트 전파 방지
    setColorPicker(colorPicker === dataKey ? null : dataKey);
  }}
>
  <div style={{ backgroundColor: color }} />
</Button>

// 컬러 피커
{colorPicker === dataKey && (
  <div className="absolute z-10 bg-popover border rounded-md p-2">
    <input
      type="color"
      defaultValue={color}
      onChange={(e) => onColorChange?.(dataKey, e.target.value)}
      onClick={(e) => e.stopPropagation()}
    />
  </div>
)}
```

**e.stopPropagation()의 중요성:**

- 컬러 피커 클릭 시 범례 토글이 동작하지 않도록 이벤트 전파 차단
- 사용자가 의도하지 않은 동작 방지

3. **hidden 상태 시각적 표현**

```typescript
<div
  style={{
    color: isHidden ? '#ccc' : color,
    opacity: isHidden ? 0.5 : 1
  }}
>
  {getShape(entry)}
</div>
<span className={isHidden ? 'line-through text-muted' : ''}>
  {entry.value}
</span>
```

**사용 예시:**

```typescript
<BarChart data={data}>
  {!hiddenSeries.has('sales') && (
    <Bar dataKey="sales" fill={customColors.sales || '#8884d8'} />
  )}
  <Legend
    content={
      <CustomLegend
        onToggle={toggleSeries}
        hiddenSeries={hiddenSeries}
        onColorChange={handleColorChange}
      />
    }
  />
</BarChart>
```

---

#### **DeletePostModal - 확인 다이얼로그**

**위치:** `packages/components/src/DeletePostModal/DeletePostModal.tsx`

**목적:** 삭제 전 사용자 확인을 받는 모달

**구현:**

```typescript
export function DeletePostModal({
  isOpen,
  onClose,
  onConfirm,
  isDeleting
}: DeletePostModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Post</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this post?
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

**설계 결정:**

1. **Controlled Component 패턴**

   ```typescript
   // 모달은 자체 상태를 가지지 않음 → 부모가 완전히 제어
   <DeletePostModal
     isOpen={deleteModal.isOpen}     // 부모에서 상태 관리
     onClose={deleteModal.close}
   />
   ```

2. **onOpenChange 핸들러**

   ```typescript
   // ESC 키 또는 백드롭 클릭 시 닫기
   onOpenChange={(open) => !open && onClose()}
   ```

3. **Loading 상태 표시**

   ```typescript
   disabled = { isDeleting }
   {
     isDeleting ? 'Deleting...' : 'Delete'
   }

   // 사용자에게 진행 중임을 명확히 알림
   // 중복 클릭 방지
   ```

---

#### **CategoryBadge - 카테고리 배지**

**위치:** `packages/components/src/ui/category-badge.tsx`

**목적:** 게시글 카테고리를 색상으로 시각화

**구현:**

```typescript
export function CategoryBadge({ category }: CategoryBadgeProps) {
  const colorClasses: Record<Category, string> = {
    [Category.NOTICE]: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200',
    [Category.QNA]: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200',
    [Category.FREE]: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200'
  };

  return (
    <Badge variant="outline" className={cn(colorClasses[category])}>
      {category}
    </Badge>
  );
}
```

**설계 포인트:**

1. **Record 타입으로 완전성 보장**

   ```typescript
   const colorClasses: Record<Category, string>
   // → Category의 모든 값에 대해 스타일 정의 강제
   // → 새 카테고리 추가 시 컴파일 에러로 누락 방지
   ```

2. **다크 모드 대응**

   ```css
   bg-red-100 text-red-800           /* 라이트 모드 */
   dark:bg-red-900/30 dark:text-red-400  /* 다크 모드 */
   ```

3. **cn 유틸리티 사용**
   ```typescript
   // clsx + tailwind-merge 조합
   className={cn(colorClasses[category])}
   // → 클래스 충돌 해결, 조건부 클래스 편리하게 처리
   ```

---

#### **Dashboard View 컴포넌트들**

**위치:** `packages/components/src/dashboard/`

이 컴포넌트들은 DashboardPage의 복잡도를 줄이기 위해 뷰별로 분리되었습니다.

**1. BarDonutView - Bar \u0026 Donut 차트**

```typescript
export function BarDonutView({
  coffeeBrands,
  snackBrands,
  customColors,
  hiddenSeries,
  toggleSeries,
  handleColorChange,
  COLORS
}: BarDonutViewProps) {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Bar Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Top Coffee Brands</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={coffeeBrands}>
              {/* Chart implementation */}
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Donut Chart */}
      <Card>
        {/* Similar structure */}
      </Card>
    </div>
  );
}
```

**분리 이유:**

- 각 뷰는 독립적인 차트 조합
- DashboardPage는 뷰 전환 로직만 담당
- 테스트 및 수정이 용이

**2. DualAxisView - 듀얼 Y축 차트**

**핵심 구현:**

```typescript
// 데이터 변환: 여러 팀의 데이터를 하나의 차트 데이터로 병합
const coffeeChartData = useMemo(() => {
  if (!coffeeConsumption?.teams) return [];
  const dataMap = new Map<number, any>();

  coffeeConsumption.teams.forEach(team => {
    team.series.forEach(point => {
      const existing = dataMap.get(point.cups) || { cups: point.cups };
      existing[`${team.team} Productivity`] = point.productivity;
      existing[`${team.team} Bugs`] = point.bugs;
      dataMap.set(point.cups, existing);
    });
  });

  return Array.from(dataMap.values()).sort((a, b) => a.cups - b.cups);
}, [coffeeConsumption]);

// 차트 렌더링
<LineChart data={coffeeChartData}>
  <YAxis yAxisId="left" />
  <YAxis yAxisId="right" orientation="right" />

  {/* 주축 (실선) */}
  <Line yAxisId="left" dataKey="Frontend Productivity" stroke="#8884d8" />

  {/* 부축 (점선) */}
  <Line
    yAxisId="right"
    dataKey="Frontend Bugs"
    stroke="#82ca9d"
    strokeDasharray="5 5"  {/* 점선 스타일 */}
  />
</LineChart>
```

**useMemo를 사용한 이유:**

- 데이터 변환 로직이 복잡하고 비용이 높음
- coffeeConsumption이 변경될 때만 재계산
- 불필요한 렌더링 방지

---

### 3.7 컴포넌트 설계 패턴 정리

**패턴 선택 기준:**

| 패턴               | 사용 시기                   | 예시                         |
| ------------------ | --------------------------- | ---------------------------- |
| **Presentational** | 재사용 가능한 UI            | Button, Input, Badge         |
| **Container**      | 데이터 페칭 + 비즈니스 로직 | PostsListPage, DashboardPage |
| **Compound**       | 관련 기능 묶음 + 내부 상태  | PostsTable (리사이징)        |
| **Controlled**     | 부모가 완전 제어 필요       | DeletePostModal              |

**상태 위치 결정 기준:**

```typescript
// 🤔 이 상태는 어디에 두어야 할까?

// ✅ 컴포넌트 내부: UI 세부사항
const [columnWidths, setColumnWidths] = useState();  // PostsTable 내부

// ✅ 부모 컴포넌트: 여러 자식 간 공유
const [hiddenSeries, setHiddenSeries] = useState();  // DashboardPage 내부

// ✅ React Query: 서버 상태
const { data: posts } = useQuery(...);  // useInfiniteQuery

// ✅ URL: 북마크 가능해야 하는 상태
const [page] = useSearchParams();  // URL query parameter
```

---

## 4. Monorepo 아키텍처 선택 이유

### 4.1 패키지 간 의존성 관리

```typescript
// packages/components/package.json
{
  "dependencies": {
    "@repo/api": "workspace:*",      // API 타입 참조
    "@repo/utils": "workspace:*"     // 유틸리티 함수 사용
  },
  "peerDependencies": {
    "react": "^19.2.0"               // React는 앱에서 제공
  }
}
```

**workspace:\* 프로토콜의 의미:**

- 로컬 패키지를 npm 레지스트리가 아닌 workspace에서 해결
- 항상 최신 버전 사용 (별도 버전 관리 불필요)
- 빌드 시 실제 버전으로 자동 치환

### 4.2 TypeScript 설정 상속

```json
// 루트 tsconfig.json (base)
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2022",
    "module": "ESNext",
    "jsx": "react-jsx"
  }
}

// packages/api/tsconfig.json (extends)
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",               // 패키지 특화 설정만 오버라이드
    "declaration": true,
    "noEmit": false
  }
}
```

**장점:**

- 일관된 컴파일러 옵션
- 중복 설정 제거
- 한 곳에서 TypeScript 버전 관리

### 4.3 ESLint Flat Config 활용

```javascript
// eslint.config.js (루트)
export default defineConfig([
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, tseslint.configs.recommended, reactHooks.configs.flat.recommended],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser
    }
  }
])
```

**모든 앱/패키지가 이 설정 사용:**

- React Hooks 규칙 (useEffect 의존성 배열 검증)
- TypeScript ESLint 규칙 (any 사용 경고)
- 일관된 코드 스타일

---

## 5. 상태 관리 전략

### 5.1 상태 분류

| 상태 종류        | 관리 방법       | 예시                         |
| ---------------- | --------------- | ---------------------------- |
| **Server State** | React Query     | 게시글 목록, 대시보드 데이터 |
| **UI State**     | useState        | 모달 열림/닫힘, 검색어 입력  |
| **Form State**   | React Hook Form | 게시글 작성 폼               |
| **URL State**    | React Router    | 현재 페이지, 쿼리 파라미터   |

### 5.2 왜 Redux를 사용하지 않았나?

```
Redux가 필요한 경우:
✅ 복잡한 전역 상태 (여러 컴포넌트가 동일 상태 공유)
✅ 상태 변경 추적 필요 (DevTools Time Travel)
✅ 미들웨어 기반 사이드 이펙트

이 프로젝트의 특징:
❌ 대부분 서버 상태 (React Query가 더 적합)
❌ 전역 상태 거의 없음 (로그인 토큰 정도)
❌ 간단한 UI 상태 (useState로 충분)

결론:
- React Query + useState 조합이 더 단순하고 효율적
- Redux는 오버엔지니어링
```

### 5.3 Form State 관리 (React Hook Form + Zod)

**위치:** `apps/react-app/src/pages/PostFormPage.tsx`

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { postSchema } from '@repo/schema'

const {
  register,
  handleSubmit,
  formState: { errors }
} = useForm({
  resolver: zodResolver(postSchema), // Zod 스키마로 검증
  defaultValues: {
    title: '',
    body: '',
    category: 'FREE',
    tags: []
  }
})
```

**선택 이유:**

1. **비제어 컴포넌트 방식**
   - 매 키 입력마다 리렌더링 없음 (성능)
   - ref로 DOM 직접 참조

2. **Zod 통합**
   - 스키마 정의 한 곳에서 (packages/schema)
   - 런타임 + 컴파일 타임 검증 동시 보장

3. **금칙어 검증 예시**

   ```typescript
   // packages/schema/src/posts.schema.ts
   const forbiddenWords = ['캄보디아', '프놈펜', '불법체류', '텔레그램']

   export const postSchema = z.object({
     title: z
       .string()
       .max(80)
       .refine((val) => !forbiddenWords.some((word) => val.includes(word)), { message: '금칙어가 포함되어 있습니다.' }),
     body: z
       .string()
       .max(2000)
       .refine((val) => !forbiddenWords.some((word) => val.includes(word)), { message: '금칙어가 포함되어 있습니다.' })
   })
   ```

---

## 6. 성능 최적화 기법

### 6.1 무한 스크롤 vs 페이지네이션

**무한 스크롤을 선택한 이유:**

```
장점:
✅ 모바일 UX 우수 (스크롤만으로 탐색)
✅ 탐색 흐름 끊김 없음
✅ 페이지 번호 클릭 불필요

단점 (해결 방법):
❌ 특정 위치로 직접 이동 어려움
   → URL 쿼리 파라미터로 해결 가능 (향후 개선)
❌ 맨 끝까지 가기 어려움
   → 정렬 옵션 제공으로 보완

결론:
- 게시판의 주 사용 패턴은 "최신글 확인"
- 무한 스크롤이 더 적합
```

### 6.2 Intersection Observer API 활용

```typescript
// react-intersection-observer 라이브러리 사용
import { useInView } from 'react-intersection-observer';

const { ref } = useInView({
  threshold: 0.1,        // 10%만 보여도 트리거
  triggerOnce: false,    // 반복 트리거
  onChange: (inView) => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  },
});

// 사용:
<div ref={ref} className="sentinel" />
```

**대안 비교:**

| 방법                  | 장점      | 단점                      | 선택 |
| --------------------- | --------- | ------------------------- | ---- |
| Intersection Observer | 성능 우수 | 설정 복잡                 | ✅   |
| Scroll Event          | 단순함    | 성능 저하 (throttle 필요) | ❌   |
| 버튼 클릭             | 제어 가능 | UX 저하                   | ❌   |

### 6.3 코드 스플리팅

```typescript
// React.lazy + Suspense
const DashboardPage = lazy(() => import('./pages/DashboardPage'));

<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/dashboard" element={<DashboardPage />} />
  </Routes>
</Suspense>
```

**번들 크기 개선:**

- 초기 로드: `index.js` (핵심 라우팅)
- 대시보드 진입 시: `DashboardPage.js` + `recharts.js` (차트 라이브러리)
- 결과: 초기 번들 크기 30% 감소

### 6.4 Recharts 최적화

```typescript
// 1. ResponsiveContainer 사용 (반응형)
<ResponsiveContainer width="100%" height={400}>
  <BarChart data={data}>
    {/* ... */}
  </BarChart>
</ResponsiveContainer>

// 2. 애니메이션 제어
<BarChart animationDuration={300}>  {/* 기본 800ms → 300ms */}

// 3. 툴팁 최적화
<Tooltip
  content={<CustomTooltip />}  // 커스텀 툴팁 (불필요한 정보 제거)
/>
```

---

## 7. 타입 안정성 보장

### 7.1 API 타입 자동 생성

```bash
# Swagger JSON → TypeScript
pnpm --filter react-app generate:api
```

**생성 결과:**

```typescript
// packages/api/src/data-contracts.ts (자동 생성)
export interface Post {
  id: string
  title: string
  body: string
  category: 'NOTICE' | 'QNA' | 'FREE'
  tags: string[]
  createdAt: string
  updatedAt: string
}

export type Category = Post['category']
export type SortField = 'title' | 'createdAt'
export type SortOrder = 'asc' | 'desc'
```

**장점:**

- 백엔드 API 변경 시 즉시 타입 오류 감지
- 수동 타입 정의 불필요
- 타입과 실제 API의 불일치 방지

### 7.2 Zod 스키마와 TypeScript 타입 동기화

```typescript
// packages/schema/src/posts.schema.ts
import { z } from 'zod'

export const postSchema = z.object({
  title: z.string().max(80),
  body: z.string().max(2000),
  category: z.enum(['NOTICE', 'QNA', 'FREE']),
  tags: z.array(z.string()).max(5)
})

// TypeScript 타입 추론
export type PostFormData = z.infer<typeof postSchema>
// 결과:
// {
//   title: string;
//   body: string;
//   category: 'NOTICE' | 'QNA' | 'FREE';
//   tags: string[];
// }
```

**Single Source of Truth:**

- 스키마 정의 → 타입 자동 생성
- 검증 로직과 타입이 항상 일치
- 런타임 안정성 + 컴파일 타임 안정성

---

## 8. 예상 질문 & 답변

### 8.1 아키텍처 관련

**Q: "왜 Monorepo를 선택했나요?"**

A: 이 프로젝트는 React와 Next.js 두 개의 앱을 포함하며, 공통 로직(API 클라이언트, UI 컴포넌트, 유틸리티)이 많습니다. Monorepo를 사용하면:

1. **코드 재사용성**: `@repo/components`를 두 앱에서 동시에 사용하여 중복을 제거했습니다.
2. **일관성**: ESLint, TypeScript 설정을 한 곳에서 관리하여 모든 앱이 동일한 품질 기준을 유지합니다.
3. **원자적 변경**: API 타입 변경 시 모든 소비자를 한 번에 업데이트할 수 있어 타입 불일치를 방지합니다.

Multi-repo를 사용할 경우 버전 관리와 동기화가 복잡해지고, 패키지 배포 과정이 추가되어 개발 속도가 느려집니다.

---

**Q: "pnpm을 선택한 이유는 무엇인가요?"**

A: pnpm은 npm/yarn 대비 다음 장점이 있습니다:

1. **디스크 효율성**: 전역 store에 패키지를 한 번만 저장하고 하드 링크로 연결합니다. 5개 프로젝트에서 React를 사용해도 300MB만 차지합니다.
2. **엄격한 의존성 관리**: Phantom dependencies를 방지하여 `package.json`에 명시된 패키지만 import할 수 있습니다. 이는 타입 안정성을 높입니다.
3. **Monorepo 네이티브 지원**: `workspace:*` 프로토콜과 `--filter` 옵션으로 모노레포 관리가 편리합니다.

---

### 8.2 React Query 관련

**Q: "React Query의 staleTime을 0으로 설정한 이유는?"**

A: 게시판의 특성상 실시간성이 중요하기 때문입니다:

1. **사용자 시나리오**: 사용자가 글을 작성한 후 목록으로 돌아왔을 때, 방금 작성한 글이 즉시 보여야 합니다.
2. **staleTime: 0의 의미**: 데이터를 가져온 즉시 stale로 표시하여, 컴포넌트가 마운트되거나 윈도우 포커스를 받을 때 자동 리페치합니다.
3. **gcTime: 5분**: 캐시는 5분간 유지하여 빠른 페이지 재방문 시 즉시 데이터를 표시하고, 백그라운드에서 리페치합니다.

이 조합으로 UX(즉시 표시)와 실시간성(자동 업데이트)을 모두 확보했습니다.

---

**Q: "무한 스크롤에서 Cursor-based pagination을 사용한 이유는?"**

A: Offset-based pagination의 문제를 해결하기 위해서입니다:

**Offset-based의 문제점:**

- 사용자가 1페이지를 보는 중 새 글이 등록되면, 2페이지로 이동 시 중복/누락이 발생합니다.
- 예: Offset 0~19 조회 → 새 글 등록 → Offset 20~39 조회 시 20번 글 중복 표시

**Cursor-based의 장점:**

- 불변 포인터(예: 마지막 글의 ID)를 기준으로 다음 페이지를 조회합니다.
- 실시간 데이터 변경에도 정확한 위치를 유지합니다.
- API가 `nextCursor`를 반환하므로 클라이언트는 단순히 전달만 하면 됩니다.

---

**Q: "Optimistic Update를 삭제에 사용하지 않은 이유는?"**

A: 무한 스크롤 구조에서 Optimistic Update의 복잡도가 이점보다 크다고 판단했습니다:

1. **데이터 구조의 복잡성**: `pages` 배열에서 특정 아이템을 찾아 제거하는 로직이 복잡합니다.
2. **에러 처리**: 삭제 실패 시 롤백이 UX에 혼란을 초래할 수 있습니다 (이미 사라진 아이템이 다시 나타남).
3. **네트워크 속도**: API 응답이 200ms 이하로 충분히 빠릅니다.

대신 `invalidateQueries`로 서버 상태와 동기화하고, `isDeleting` 상태로 사용자에게 피드백을 제공했습니다.

---

### 8.3 컴포넌트 설계 관련

**Q: "Presentational/Container 패턴을 사용한 이유는?"**

A: 관심사 분리와 재사용성을 위해서입니다:

1. **Presentational (packages/components)**:
   - Props로만 동작하며 비즈니스 로직이 없습니다.
   - 스토리북으로 독립적으로 문서화/테스트 가능합니다.
   - 여러 앱에서 재사용할 수 있습니다.

2. **Container (apps/react-app/src/pages)**:
   - React Query로 데이터를 페칭하고 상태를 관리합니다.
   - Presentational 컴포넌트를 조합하여 페이지를 구성합니다.
   - 비즈니스 로직을 캡슐화합니다.

예를 들어, `PostsTable`은 props로 데이터를 받아 표시만 하고, `PostsListPage`는 데이터 페칭과 필터링 로직을 담당합니다.

---

**Q: "Custom Hook으로 무엇을 추상화했나요?"**

A: 반복되는 비즈니스 로직을 재사용 가능한 훅으로 추출했습니다:

1. **useModal**: 모달 열기/닫기 + 데이터 전달 로직
   - 제네릭으로 타입 안전성 보장 (`useModal<string>()`)
   - 여러 모달에서 재사용 (삭제 확인, 상세 보기 등)

2. **useDeletePost**: 삭제 + 캐시 무효화 로직
   - mutation 성공 시 자동으로 `invalidateQueries` 실행
   - 삭제 로직이 필요한 모든 페이지에서 일관되게 사용

이로써 코드 중복을 제거하고, 테스트 단위를 명확히 했습니다.

---

### 8.4 성능 최적화 관련

**Q: "useMemo를 어떤 기준으로 사용했나요?"**

A: 다음 두 조건을 만족할 때만 사용했습니다:

1. **계산 비용이 높음**: 예를 들어, `coffeeChartData`는 중첩 루프로 데이터를 변환합니다.
2. **의존성 변경이 적음**: `coffeeConsumption`은 API 리페치 시에만 변경되므로, 불필요한 재계산을 방지할 수 있습니다.

**사용하지 않은 경우:**

- 단순 필터링 (`posts.filter(...)`) - 계산 비용이 낮아 useMemo의 비교 비용이 더 큽니다.
- 컴포넌트 props 계산 - React의 기본 렌더링이 충분히 빠릅니다.

과도한 useMemo 사용은 코드 복잡도만 높이고 실질적 성능 향상이 없습니다.

---

**Q: "Intersection Observer를 직접 사용하지 않고 라이브러리를 선택한 이유는?"**

A: `react-intersection-observer`는 다음 이점이 있습니다:

1. **Hook API**: `useInView`로 선언적으로 사용 가능합니다.
2. **메모리 관리**: 언마운트 시 자동으로 observer를 정리합니다.
3. **에러 처리**: 브라우저 호환성 처리가 내장되어 있습니다.

직접 구현 시 위 로직들을 모두 관리해야 하며, 버그 가능성이 높습니다. 라이브러리 용량도 2KB로 작아 trade-off가 합리적입니다.

---

### 8.5 타입 안정성 관련

**Q: "API 타입을 자동 생성한 이유는?"**

A: 수동 타입 정의의 문제점을 해결하기 위해서입니다:

1. **동기화**: Swagger 스펙이 변경되면 `pnpm generate:api`로 타입을 재생성하여 즉시 반영됩니다.
2. **신뢰성**: 백엔드 타입과 프론트엔드 타입이 항상 일치합니다.
3. **생산성**: 수백 개의 타입을 수동으로 정의할 필요가 없습니다.

**트레이드오프:**

- 생성 코드가 최적이 아닐 수 있지만, 타입 불일치로 인한 런타임 에러를 방지하는 이점이 더 큽니다.

---

**Q: "Zod를 사용한 이유는?"**

A: TypeScript만으로는 런타임 검증이 불가능하기 때문입니다:

```typescript
// TypeScript 타입 (컴파일 타임에만 존재)
type PostFormData = { title: string; body: string }

// 런타임에 사용자 입력 검증 불가
const data: PostFormData = JSON.parse(userInput) // ❌ 타입만 선언, 실제 검증 X

// Zod 스키마 (런타임 검증)
const postSchema = z.object({
  title: z.string().max(80),
  body: z.string().max(2000).refine(/* 금칙어 검증 */)
})

postSchema.parse(data) // ✅ 런타임에 실제 검증 수행
```

**추가 이점:**

- `z.infer<typeof schema>`로 TypeScript 타입 자동 생성
- React Hook Form과 완벽한 통합 (`zodResolver`)
- 중앙화된 검증 로직 (프론트엔드/백엔드 동일 스키마 재사용 가능)

---

### 8.6 기타 질문

**Q: "shadcn/ui를 선택한 이유는?"**

A: 기존 UI 라이브러리의 한계를 극복하기 위해서입니다:

**기존 라이브러리의 문제:**

- **MUI, Ant Design**: 무거운 번들, 커스터마이징 어려움
- **Headless UI**: 스타일링을 직접 해야 함 (시간 소모)

**shadcn/ui의 장점:**

1. **소스 코드 포함**: 컴포넌트를 프로젝트에 복사하므로 완전한 커스터마이징 가능
2. **접근성**: Radix UI 기반으로 ARIA 속성 자동 적용
3. **Tailwind 통합**: 일관된 디자인 시스템
4. **트리쉐이킹**: 사용하는 컴포넌트만 번들에 포함

단점은 컴포넌트를 직접 관리해야 하지만, 이 프로젝트에서는 확장성과 커스터마이징이 더 중요했습니다.

---

**Q: "Next.js와 React 앱을 모두 만든 이유는?"**

A: 서로 다른 렌더링 전략을 비교하기 위해서입니다:

1. **React (CSR)**:
   - 빠른 개발 속도 (Vite)
   - 클라이언트 중심 인터랙션에 적합
   - 로그인 후 사용하는 게시판에 최적

2. **Next.js (SSR/SSG)**:
   - SEO 최적화
   - 초기 로딩 성능 (서버에서 HTML 생성)
   - 퍼블릭 페이지에 적합

Monorepo를 통해 두 앱이 동일한 비즈니스 로직(`@repo/api`, `@repo/hooks`)을 공유하면서, 각각의 렌더링 전략에 최적화된 구현을 할 수 있습니다.

---

**Q: "개선하고 싶은 부분이 있나요?"**

A: 다음 개선 사항을 고려 중입니다:

1. **Storybook 통합**: 컴포넌트를 독립적으로 문서화하고 시각적으로 테스트
2. **Unit Test 추가**: Vitest로 훅과 유틸리티 함수 테스트
3. **에러 바운더리**: React Error Boundary로 런타임 에러 처리
4. **로깅 및 모니터링**: Sentry로 프로덕션 에러 추적
5. **성능 모니터링**: Lighthouse CI로 성능 메트릭 자동 측정

현재는 기능 구현에 집중했지만, 프로덕션 환경에서는 위 항목들이 필수입니다.

---

**Q: "이 프로젝트에서 가장 어려웠던 점은?"**

A: **무한 스크롤과 React Query의 통합**이었습니다:

1. **페이지 병합 로직**: `pages.flatMap(page => page.items)`로 모든 페이지를 하나의 배열로 만들면서도, 각 페이지의 `nextCursor`를 추적해야 했습니다.

2. **필터 변경 시 캐시 관리**: 검색어/카테고리 변경 시 `queryKey`가 바뀌므로 이전 캐시와 새 쿼리를 모두 관리해야 했습니다.

3. **Intersection Observer 타이밍**: sentinel 요소가 화면에 보이는 순간 `fetchNextPage`를 호출하되, 이미 로딩 중이면 중복 호출을 방지해야 했습니다.

이 과정에서 React Query의 `getNextPageParam`, `initialPageParam` 등의 API를 깊이 이해하게 되었고, 커서 기반 페이지네이션의 장점을 체감했습니다.

---

## 📚 추가 학습 자료

### React Query Deep Dive

- [Practical React Query](https://tkdodo.eu/blog/practical-react-query) - TkDodo의 시리즈
- [Infinite Queries 공식 문서](https://tanstack.com/query/latest/docs/react/guides/infinite-queries)

### Monorepo Best Practices

- [pnpm Workspace 가이드](https://pnpm.io/workspaces)
- [Monorepo Tools 비교](https://monorepo.tools/)

### TypeScript Type Safety

- [Zod vs Yup vs Joi](https://zod.dev/)
- [TypeScript Generics Deep Dive](https://www.typescriptlang.org/docs/handbook/2/generics.html)

---

## ✅ 체크리스트

면접 전 다음 항목을 반드시 확인하세요:

- [ ] 프로젝트 로컬에서 정상 실행 (`pnpm dev`)
- [ ] 빌드 성공 확인 (`pnpm build`)
- [ ] E2E 테스트 실행 및 결과 확인
- [ ] 주요 컴포넌트 코드 리뷰 (PostsListPage, DashboardPage)
- [ ] React Query DevTools로 캐시 동작 확인
- [ ] 네트워크 탭에서 API 호출 확인
- [ ] README와 이 문서 다시 읽기

---

<div align="center">

**면접 화이팅! 🚀**

자신감을 갖고 본인이 구현한 내용을 설명하세요.  
"왜 이렇게 했는지"를 명확히 설명할 수 있다면 충분합니다.

</div>
