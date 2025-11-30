# E2E Tests - Create New Post

## 개요

이 E2E 테스트는 Playwright를 사용하여 게시글 작성 기능을 테스트하고, 샘플 데이터를 생성합니다.

## 테스트 케이스

### 1. 단일 게시글 작성 테스트

새 게시글을 성공적으로 작성하는지 테스트합니다.

**테스트 단계:**

1. 로그인
2. "New Post" 버튼 클릭
3. 폼 입력 (제목, 카테고리, 태그, 본문)
4. 제출
5. 게시글 목록에서 작성한 게시글 확인

### 2. 샘플 데이터 생성 (100개 게시글)

다양한 카테고리와 태그를 가진 100개의 게시글을 자동으로 생성합니다.

**생성되는 데이터:**

- **카테고리:** NOTICE, QNA, FREE (랜덤)
- **제목:** 8가지 접두사 × 번호
- **본문:** 8가지 템플릿 × 작성 정보
- **태그:** 10가지 조합 중 랜덤 선택

## 실행 방법

### 사전 요구사항

```bash
# Playwright 브라우저 설치 (이미 완료)
pnpm exec playwright install chromium
```

### 개발 서버 실행

테스트 실행 전에 개발 서버가 실행 중이어야 합니다:

```bash
pnpm dev
```

또는 Playwright가 자동으로 서버를 시작하도록 설정되어 있습니다.

### 테스트 실행

#### 1. 단일 게시글 작성 테스트

```bash
pnpm test:single-post
```

#### 2. **100개 샘플 데이터 생성 (권장)**

```bash
pnpm test:generate-data
```

이 명령어는:

- 자동으로 로그인
- 100개의 게시글을 순차적으로 생성
- 각 게시글마다 콘솔에 진행상황 출력
- 완료 후 성공 메시지 표시

**예상 소요 시간:** 약 5-10분

#### 3. 모든 E2E 테스트 실행

```bash
pnpm test:e2e
```

#### 4. UI 모드로 테스트 (디버깅용)

```bash
pnpm test:e2e:ui
```

## 생성되는 샘플 데이터 예시

### 게시글 1

```
제목: 중요 공지 #1
카테고리: NOTICE
태그: react, typescript
본문: 이번 주 주요 업데이트 사항에 대해 안내드립니다...
작성 번호: 1
작성 시간: 2025-11-30 18:51:00
```

### 게시글 50

```
제목: 질문 있습니다 #50
카테고리: QNA
태그: tanstack-query, data-fetching
본문: React와 TypeScript를 사용한 프로젝트 개발 중...
작성 번호: 50
작성 시간: 2025-11-30 18:55:00
```

## 테스트 설정

### Playwright 설정 (`playwright.config.ts`)

- **Base URL:** http://localhost:5173
- **Workers:** 1 (순차 실행)
- **Browser:** Chromium
- **Timeout:** 10초
- **Reporter:** HTML 리포트

### 테스트 계정

```
Email: jungmin.ji@icloud.com
Password: Q5kL7wPnQ6
```

## 문제 해결

### 테스트 실패 시

1. **개발 서버 확인:** `pnpm dev`가 실행 중인지 확인
2. **로그인 정보:** 테스트 계정이 유효한지 확인
3. **브라우저:** Chromium이 설치되었는지 확인
4. **포트:** localhost:5173이 사용 가능한지 확인

### 디버깅

```bash
# UI 모드로 실행 (단계별 확인 가능)
pnpm test:e2e:ui

# 헤드풀 모드로 실행 (브라우저 보이기)
pnpm exec playwright test --headed

# 특정 테스트만 실행
pnpm exec playwright test -g "create 100"
```

## 결과 확인

### HTML 리포트

테스트 실행 후 HTML 리포트가 생성됩니다:

```bash
pnpm exec playwright show-report
```

### 스크린샷

실패 시 자동으로 스크린샷이 저장됩니다:

- 위치: `test-results/`

## 추가 정보

### 태그 옵션

- react, typescript
- shadcn, ui, components
- tanstack-query, data-fetching
- vite, build-tool
- tailwindcss, styling
- frontend, web-development
- api, integration
- debugging, troubleshooting
- best-practices, tips
- guide, tutorial

### 제목 접두사

- 중요 공지
- 질문 있습니다
- 자유 게시글
- 도움이 필요해요
- 공유합니다
- 안내사항
- 문의드립니다
- 정보 공유

### 본문 템플릿

8가지 다양한 템플릿이 랜덤으로 사용되며, 각 게시글마다 작성 번호와 시간이 추가됩니다.
