# 게시판 프로젝트 (Board Project)

React와 TypeScript 기반의 현대적인 게시판 웹 애플리케이션입니다. shadcn/ui를 활용한 세련된 UI와 고급 기능을 제공합니다.

## 📋 목차

- [프로젝트 실행 방법](#프로젝트-실행-방법)
- [사용한 기술 스택](#사용한-기술-스택)
- [주요 구현 기능](#주요-구현-기능)
- [프로젝트 구조](#프로젝트-구조)

---

## 🚀 프로젝트 실행 방법

### 필수 요구사항

- **Node.js**: v18.0.0 이상
- **pnpm**: v8.0.0 이상 (권장 패키지 매니저)

### 설치 및 실행

```bash
# 1. 의존성 설치
pnpm install

# 2. 개발 서버 실행
pnpm dev

# 3. 브라우저에서 http://localhost:5173 접속
```

### 기타 명령어

```bash
# TypeScript 타입 체크
pnpm tsc --noEmit

# 프로덕션 빌드
pnpm build

# 프로덕션 미리보기
pnpm preview

# ESLint 실행
pnpm lint
```

### 테스트 계정

```
이메일: jungmin.ji@icloud.com
비밀번호: Q5kL7wPnQ6
```

---

## 🛠️ 사용한 기술 스택

### Core

- **React 19** - UI 라이브러리
- **TypeScript** - 정적 타입 지원
- **Vite** - 빠른 개발 환경 및 빌드 도구
- **pnpm** - 효율적인 패키지 관리

### 상태 관리 & 데이터 페칭

- **TanStack Query (React Query) v5** - 서버 상태 관리 및 캐싱
  - `useInfiniteQuery`를 활용한 무한 스크롤 구현
  - 자동 캐싱 및 백그라운드 업데이트
- **React Router v7** - 클라이언트 사이드 라우팅

### UI 프레임워크 & 컴포넌트

- **shadcn/ui** - 재사용 가능한 고품질 UI 컴포넌트
  - Button, Input, Label, Textarea, Select
  - Badge, Card, Dialog, Dropdown Menu
  - Table, Form, Pagination
- **Tailwind CSS v3** - 유틸리티 우선 CSS 프레임워크
- **Radix UI** - 접근성 높은 headless UI 컴포넌트
- **Lucide React** - 아이콘 라이브러리

### 폼 관리 & 유효성 검사

- **React Hook Form v7** - 효율적인 폼 상태 관리
- **Zod v4** - TypeScript 우선 스키마 유효성 검사
- **@hookform/resolvers** - React Hook Form과 Zod 통합

### 데이터 시각화

- **Recharts v3** - React 기반 차트 라이브러리
  - Line Chart (듀얼 Y축)
  - Bar Chart (스택형)
  - Area Chart (스택형)
  - Pie Chart (도넛형)
  - Custom Legend 구현

### API & 네트워킹

- **Axios** - HTTP 클라이언트
- **swagger-typescript-api** - Swagger 스키마로부터 TypeScript API 클라이언트 자동 생성

### 유틸리티

- **clsx** + **tailwind-merge** - 조건부 클래스네임 관리
- **react-intersection-observer** - 무한 스크롤 뷰포트 감지
- **class-variance-authority** - 컴포넌트 variant 관리

### 개발 도구

- **ESLint** - 코드 린팅
- **TypeScript ESLint** - TypeScript 전용 린트 규칙
- **PostCSS** + **Autoprefixer** - CSS 후처리

---

## ✨ 주요 구현 기능

### 1. 인증 시스템

- ✅ 로그인 페이지
- ✅ JWT 토큰 기반 인증
- ✅ Protected Routes (인증 필요 페이지)
- ✅ 자동 로그아웃 기능

### 2. 게시판 CRUD

#### 게시글 관리

- ✅ 게시글 작성 (제목, 내용, 카테고리, 태그)
- ✅ 게시글 목록 조회
- ✅ 게시글 상세 조회
- ✅ 게시글 수정
- ✅ 게시글 삭제
- ✅ 금칙어 필터링 ("캄보디아", "프놈펜", "불법체류", "텔레그램")

#### 데이터 제약사항

- 제목: 최대 80자
- 본문: 최대 2000자
- 태그: 최대 5개
- 카테고리: NOTICE, QNA, FREE

### 3. 고급 테이블 기능

- ✅ **무한 스크롤** - `useInfiniteQuery`를 활용한 커서 기반 페이지네이션
- ✅ **컬럼 크기 조절** - 드래그로 테이블 컬럼 너비 변경
- ✅ **컬럼 표시/숨김** - Dropdown Menu로 컬럼 가시성 토글
- ✅ **검색** - 제목 및 본문 검색
- ✅ **정렬** - 제목/작성일 기준 오름차순/내림차순
- ✅ **필터링** - 카테고리별 필터링
- ✅ **반응형 디자인** - 모바일 및 데스크톱 최적화

### 4. 데이터 시각화 대시보드

#### 차트 종류

1. **Bar Chart** - 커피 브랜드 인기도
2. **Donut Chart** - 스낵 브랜드 시장 점유율
3. **Stacked Area Chart** - 주간 기분 트렌드
4. **Stacked Bar Chart** - 주간 운동 트렌드
5. **Dual Y-Axis Line Chart** - 커피 소비량 vs 생산성/버그
6. **Dual Y-Axis Line Chart** - 스낵 섭취 vs 사기/회의 불참

#### 고급 차트 기능

- ✅ **커스텀 범례** - 데이터 시리즈 토글 기능
- ✅ **마커 차별화**
  - 원형 마커 (●): 실선 데이터 (왼쪽 Y축)
  - 사각형 마커 (■): 점선 데이터 (오른쪽 Y축)
- ✅ **인터랙티브 툴팁** - Hover 시 모든 데이터 표시
- ✅ **반응형 차트** - 화면 크기에 따라 자동 조정

### 5. UI/UX 향상

- ✅ **shadcn/ui 통합** - 일관된 디자인 시스템
- ✅ **다크 모드 지원** - CSS 변수 기반 테마
- ✅ **로딩 상태** - 스켈레톤 UI 및 스피너
- ✅ **에러 처리** - 사용자 친화적 에러 메시지
- ✅ **모달 확인** - 삭제 시 확인 다이얼로그
- ✅ **토스트 알림** - 작업 성공/실패 피드백

---

## 📁 프로젝트 구조

```
directional-assignment/                # Monorepo root
├── apps/
│   ├── react-app/                    # React + Vite 애플리케이션
│   │   ├── src/
│   │   │   ├── api/
│   │   │   │   └── client.ts        # Axios 인스턴스 설정
│   │   │   ├── components/
│   │   │   │   └── layout/          # 앱별 레이아웃 컴포넌트
│   │   │   ├── pages/               # React Router 페이지
│   │   │   │   ├── DashboardPage.tsx
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   ├── PostsListPage.tsx
│   │   │   │   ├── PostDetailPage.tsx
│   │   │   │   └── PostFormPage.tsx
│   │   │   ├── App.tsx
│   │   │   ├── main.tsx
│   │   │   └── index.css
│   │   ├── e2e/                     # Playwright E2E 테스트
│   │   ├── tailwind.config.js
│   │   ├── vite.config.ts
│   │   └── package.json
│   │
│   └── next-app/                    # Next.js 16 App Router 애플리케이션
│       ├── src/
│       │   ├── api/
│       │   │   └── client.ts       # Next.js용 API 클라이언트
│       │   ├── app/                # App Router 페이지
│       │   └── components/
│       ├── tailwind.config.ts
│       ├── next.config.ts
│       └── package.json
│
├── packages/                        # 공유 라이브러리
│   ├── api/                        # @repo/api
│   │   └── src/
│   │       ├── index.ts           # API 클라이언트 export
│   │       ├── Api.ts             # Swagger 생성 API 클래스
│   │       └── data-contracts.ts  # TypeScript 타입 정의
│   │
│   ├── components/                # @repo/components
│   │   └── src/
│   │       ├── ui/                # shadcn/ui 컴포넌트
│   │       │   ├── button.tsx
│   │       │   ├── input.tsx
│   │       │   ├── dialog.tsx
│   │       │   └── ...
│   │       ├── CategoryBadge/
│   │       ├── CustomLegend/
│   │       ├── DeletePostModal/
│   │       ├── LoadingSpinner/
│   │       ├── PostsTable/
│   │       ├── Tag/
│   │       └── layout/            # 공유 레이아웃
│   │
│   ├── hooks/                     # @repo/hooks
│   │   └── src/
│   │       ├── useDeletePost.ts
│   │       └── useModal.ts
│   │
│   ├── schema/                    # @repo/schema
│   │   └── src/
│   │       ├── login.schema.ts
│   │       └── posts.schema.ts
│   │
│   └── utils/                     # @repo/utils
│       └── src/
│           ├── cn.ts              # clsx + tailwind-merge
│           └── date.ts            # 날짜 포맷팅
│
├── eslint.config.js                # 공유 ESLint 설정
├── tsconfig.json                   # 공유 TypeScript 기본 설정
├── pnpm-workspace.yaml             # pnpm workspace 정의
└── package.json                    # Monorepo 루트 설정
```

---

## 🔑 주요 기술 포인트

### 1. 타입 안정성

- Swagger로부터 자동 생성된 TypeScript 타입
- Zod를 활용한 런타임 유효성 검사
- 엄격한 TypeScript 설정 (`strict: true`)

### 2. 상태 관리 전략

- **서버 상태**: TanStack Query (캐싱, 무효화, 백그라운드 리페치)
- **UI 상태**: React의 `useState`, `useReducer`
- **폼 상태**: React Hook Form

### 3. 성능 최적화

- 무한 스크롤로 초기 로딩 시간 단축
- TanStack Query의 자동 캐싱
- 코드 스플리팅 (React Router)
- 이미지 및 에셋 최적화

### 4. 접근성 (a11y)

- Radix UI의 접근성 높은 컴포넌트
- 시맨틱 HTML
- 키보드 네비게이션 지원
- ARIA 라벨 및 속성

### 5. 개발자 경험

- TypeScript 자동완성
- ESLint를 통한 코드 품질 관리
- Hot Module Replacement (HMR)
- 명확한 디렉토리 구조

---

## 📝 Git 커밋 컨벤션

프로젝트는 [Conventional Commits](https://www.conventionalcommits.org/) 규칙을 따릅니다:

```
<type>[optional scope]: <description>

예시:
- feat(posts): Implement proper infinite scroll using useInfiniteQuery
- refactor(ui): Migrate custom Button to shadcn/ui Button
- fix(auth): Fix token expiration handling
- docs: Update README with installation instructions
- chore(config): Add path alias support for shadcn/ui integration
```

**Type:**

- `feat`: 새로운 기능
- `fix`: 버그 수정
- `refactor`: 코드 리팩토링
- `docs`: 문서 변경
- `style`: 코드 포맷팅
- `chore`: 빌드/설정 변경
