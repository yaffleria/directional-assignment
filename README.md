# 📝 Directional 프론트엔드 채용 과제

> **pnpm Workspace 기반 모노레포 프로젝트**  
> React 19 + Next.js 16 멀티 애플리케이션 아키텍처

<br />

## 🔗 Live Demo

- **React App**: [https://directional-assignment-ten.vercel.app](https://directional-assignment-ten.vercel.app)
  - _SPA 라우팅 설정이 적용되어 정상 동작합니다._
- **Next.js App**: [https://directional-assignment-next-app-c9s.vercel.app](https://directional-assignment-next-app-c9s.vercel.app)

<br />

## 🎯 프로젝트 개요

이 프로젝트는 **모던 웹 개발의 Best Practice**를 지향하여 설계한 게시판 및 대시보드 시스템입니다.
pnpm Workspace를 활용한 모노레포 구조로 설계되어, **재사용성**과 **확장성**을 최우선으로 고려했습니다.
Antigravity IDE + Gemini3-pro + Claude Sonet 4.5를 활용하였습니다.

### 주요 특징

- 🏗️ **Monorepo Architecture** - React/Next.js 멀티 앱 + 공유 패키지
- ⚡ **Performance Optimized** - Code splitting, Infinite scroll, React Query caching
- 🎨 **Modern UI/UX** - shadcn/ui 기반 컴포넌트 시스템
- 🔒 **Type-Safe** - End-to-end TypeScript + Zod validation
- 🧪 **Well-Tested** - Playwright E2E 테스트 커버리지
- 📊 **Rich Data Visualization** - Recharts 기반 인터랙티브 차트

<br />

---

## 🚀 빠른 시작

### 필수 요구사항

- **Node.js** 18.0.0 이상
- **pnpm** 8.0.0 이상

### 설치 및 실행

```bash
# 1. 저장소 클론
git clone <repository-url>
cd directional-assignment

# 2. 의존성 설치
pnpm install

# 3. 개발 서버 실행 (모든 앱 동시 실행)
pnpm dev

# React App: http://localhost:5173
# Next.js App: http://localhost:3000
```

### 개별 앱 실행

```bash
# React 앱만 실행
pnpm --filter react-app dev

# Next.js 앱만 실행
pnpm --filter next-app dev
```

### 프로덕션 빌드

```bash
# 전체 빌드 (타입 체크 포함)
pnpm build

# 린트 검사
pnpm lint

# E2E 테스트 (React App)
pnpm --filter react-app test:e2e
```

<br />

---

## 🛠️ 기술 스택

### 아키텍처

| Category     | Technology                   | Purpose                    |
| ------------ | ---------------------------- | -------------------------- |
| **Monorepo** | pnpm Workspace               | 효율적인 멀티 패키지 관리  |
| **Apps**     | React 19 + Vite / Next.js 16 | 서로 다른 렌더링 전략 구현 |
| **Language** | TypeScript 5.9               | 타입 안정성 보장           |
| **Build**    | Vite 7 / Turbopack           | 빠른 개발 경험             |

### 상태 관리 & 데이터 페칭

| Library             | Version | Usage                                 |
| ------------------- | ------- | ------------------------------------- |
| **TanStack Query**  | v5      | 서버 상태 관리, 캐싱, Infinite scroll |
| **React Router**    | v7      | Client-side routing (React app)       |
| **React Hook Form** | v7      | 폼 상태 관리                          |
| **Zod**             | v4      | 런타임 스키마 검증                    |

**TanStack Query 주요 활용:**

- ✅ `useInfiniteQuery` - 커서 기반 무한 스크롤 구현
- ✅ Optimistic Updates - 낙관적 UI 업데이트
- ✅ Query Invalidation - 데이터 동기화
- ✅ Background Refetch - 자동 데이터 신선도 유지

### UI/UX

| Library          | Purpose                                  |
| ---------------- | ---------------------------------------- |
| **shadcn/ui**    | Headless 컴포넌트 시스템 (Radix UI 기반) |
| **Tailwind CSS** | Utility-first CSS 프레임워크             |
| **Recharts**     | 선언적 차트 라이브러리                   |
| **Lucide React** | 최신 아이콘 세트                         |

### 개발 도구

- **ESLint 9** (Flat Config) - 모노레포 전체 린팅
- **Playwright** - E2E 테스트 자동화
- **AI-Assisted API Gen** - Python & AI를 활용한 API 클라이언트 생성 (Endpoint 접근 제한 대응)
- **Prettier** - 코드 포매팅

<br />

---

## ✨ 주요 구현 기능

### 1. 📋 게시판 CRUD

#### 핵심 기능

- ✅ **무한 스크롤** - `useInfiniteQuery` + Intersection Observer
- ✅ **실시간 검색** - 디바운싱 없이 React Query의 자동 캐싱 활용
- ✅ **다중 필터링** - 카테고리, 정렬, 검색어 조합
- ✅ **컬럼 커스터마이징** - 너비 조절, 표시/숨김 토글
- ✅ **금칙어 필터링** - Zod 스키마 레벨 검증

#### 기술적 하이라이트

```typescript
// Cursor-based pagination with React Query
const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
  queryKey: ['posts', search, category, sort, order],
  queryFn: ({ pageParam }) =>
    api.posts.postsList({
      limit: 20,
      nextCursor: pageParam,
      search,
      category,
      sort,
      order
    }),
  getNextPageParam: (lastPage) => lastPage.nextCursor,
  staleTime: 0
})
```

### 2. 📊 데이터 시각화 대시보드

#### 차트 종류

- **Bar Chart** - 커피 브랜드 인기도
- **Donut Chart** - 스낵 시장 점유율
- **Stacked Area Chart** - 주간 기분 트렌드
- **Stacked Bar Chart** - 운동 패턴 분석
- **Dual Y-Axis Line Chart** - 다중 메트릭 상관관계

#### 인터랙티브 기능

- 🎨 **커스텀 컬러 피커** - 실시간 차트 색상 변경
- 👁️ **데이터 시리즈 토글** - 선택적 데이터 표시
- 📍 **마커 차별화** - 주축/부축 시각적 구분
- 📱 **반응형 차트** - 모바일~데스크톱 대응

### 3. 🏗️ Monorepo 아키텍처

```
directional-assignment/
├── apps/
│   ├── react-app/          # React 19 + Vite (CSR)
│   └── next-app/           # Next.js 16 App Router (SSR)
│
└── packages/               # 공유 라이브러리
    ├── @repo/api          # AI 기반 생성 API 클라이언트
    ├── @repo/components   # shadcn/ui 기반 컴포넌트
    ├── @repo/hooks        # 커스텀 React Hooks
    ├── @repo/schema       # Zod 검증 스키마
    └── @repo/utils        # 유틸리티 함수
```

#### 설계 원칙

- **DRY**: 중복 코드 제거 - 공통 로직은 패키지로 추출
- **Single Source of Truth**: API 타입, 검증 스키마 중앙화
- **Scalability**: 새 앱 추가 시 기존 패키지 재사용

### 4. 🔐 인증 & 라우팅

- **JWT 토큰 기반** 인증
- **Protected Routes** - 미인증 사용자 리다이렉트
- **React App**: localStorage 기반 토큰 관리
- **Next.js App**: HTTP-only Cookie 기반 (보안 강화)

### 5. ⚡ 성능 최적화

| 기법                | 구현               | 효과                    |
| ------------------- | ------------------ | ----------------------- |
| **Code Splitting**  | Dynamic imports    | 초기 번들 크기 감소     |
| **Query Caching**   | React Query        | 중복 요청 제거          |
| **Infinite Scroll** | Cursor pagination  | 대용량 데이터 효율 처리 |
| **Optimistic UI**   | Mutation callbacks | 체감 성능 향상          |

<br />

---

## 📁 프로젝트 구조

<details>
<summary><b>전체 구조 보기</b></summary>

```
directional-assignment/
├── apps/
│   ├── react-app/                    # React + Vite 애플리케이션
│   │   ├── src/
│   │   │   ├── api/
│   │   │   │   └── client.ts        # Axios 인스턴스 + API 초기화
│   │   │   ├── components/
│   │   │   │   └── layout/          # 앱별 레이아웃
│   │   │   ├── pages/               # React Router 페이지
│   │   │   │   ├── DashboardPage.tsx
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   ├── PostsListPage.tsx
│   │   │   │   ├── PostDetailPage.tsx
│   │   │   │   └── PostFormPage.tsx
│   │   │   ├── App.tsx              # 라우팅 설정
│   │   │   └── main.tsx             # 앱 엔트리포인트
│   │   ├── e2e/                     # Playwright E2E 테스트
│   │   ├── tailwind.config.js
│   │   ├── vite.config.ts
│   │   └── package.json
│   │
│   └── next-app/                    # Next.js 16 App Router
│       ├── src/
│       │   ├── api/
│       │   │   └── client.ts       # Next.js용 API (SSR/CSR 분리)
│       │   ├── app/                # App Router 페이지
│       │   │   ├── layout.tsx
│       │   │   ├── page.tsx
│       │   │   ├── posts/
│       │   │   └── dashboard/
│       │   └── components/
│       ├── next.config.ts
│       └── package.json
│
├── packages/                        # 공유 라이브러리
│   ├── api/                        # @repo/api
│   │   └── src/
│   │       ├── index.ts           # API 클래스 export
│   │       ├── Api.ts             # AI 기반 자동 생성
│   │       └── data-contracts.ts  # TypeScript 타입
│   │
│   ├── components/                # @repo/components
│   │   └── src/
│   │       ├── ui/                # shadcn/ui 컴포넌트
│   │       │   ├── button.tsx
│   │       │   ├── input.tsx
│   │       │   ├── dialog.tsx
│   │       │   └── ...
│   │       ├── CategoryBadge/
│   │       ├── CustomLegend/      # 차트 커스텀 범례
│   │       ├── DeletePostModal/
│   │       ├── LoadingSpinner/
│   │       ├── PostsTable/        # 무한 스크롤 테이블
│   │       └── layout/            # 공유 레이아웃
│   │
│   ├── hooks/                     # @repo/hooks
│   │   └── src/
│   │       ├── useDeletePost.ts   # 게시글 삭제 훅
│   │       └── useModal.ts        # 모달 상태 관리 훅
│   │
│   ├── schema/                    # @repo/schema
│   │   └── src/
│   │       ├── login.schema.ts    # 로그인 검증
│   │       └── posts.schema.ts    # 게시글 검증 + 금칙어
│   │
│   └── utils/                     # @repo/utils
│       └── src/
│           ├── cn.ts              # clsx + tailwind-merge
│           └── date.ts            # 날짜 포맷팅
│
├── eslint.config.js                # 공유 ESLint 설정 (Flat Config)
├── tsconfig.json                   # 공유 TypeScript 기본 설정
├── pnpm-workspace.yaml             # Workspace 정의
└── package.json                    # Monorepo 루트 스크립트
```

</details>

<br />

---

## 🎨 UI/UX 설계 철학

### Design System

- **shadcn/ui 선택 이유**
  - ✅ 컴포넌트 소스 코드를 프로젝트에 직접 포함 (소스 코드 레벨의 제어권 확보)
  - ✅ Radix UI 기반으로 접근성(a11y) 자동 보장
  - ✅ Tailwind CSS와 긴밀한 통합

### 사용자 경험

- **즉각적인 피드백** - Optimistic UI 업데이트
- **끊김 없는 스크롤** - Intersection Observer 활용
- **시각적 일관성** - 일관된 디자인 토큰
- **반응형 디자인** - 모바일 퍼스트 접근

<br />

---

## 🧪 테스트 전략

### E2E 테스트 (Playwright)

```bash
# 테스트 실행
pnpm --filter react-app test:e2e

# UI 모드
pnpm --filter react-app test:e2e:ui
```

**커버리지:**

- ✅ 로그인 플로우
- ✅ 게시글 CRUD
- ✅ 무한 스크롤
- ✅ 필터링 & 검색
- ✅ 차트 인터랙션

<br />

---

## 🔄 CI/CD 고려사항

이 프로젝트는 다음과 같은 배포 전략을 고려하여 설계되었습니다:

- **Vercel** - Next.js App (Edge Runtime 활용)
- **Netlify/Vercel** - React App (정적 빌드)
- **공유 패키지** - npm private registry 또는 모노레포 유지

<br />

---

## 📚 학습 리소스

프로젝트에서 사용된 주요 기술:

- [TanStack Query Docs](https://tanstack.com/query/latest) - 서버 상태 관리
- [shadcn/ui](https://ui.shadcn.com/) - 컴포넌트 라이브러리
- [pnpm Workspace](https://pnpm.io/workspaces) - 모노레포 관리
- [Recharts](https://recharts.org/) - 차트 라이브러리

<br />

---

## 📄 License

이 프로젝트는 Directional 채용 과제 목적으로 제작되었습니다.

---

<div align="center">

**Built with ❤️ using React, Next.js, and TypeScript**

[🔝 맨 위로](#-directional-프론트엔드-채용-과제)

</div>
