import { test, expect } from "@playwright/test";

const TEST_EMAIL = "jungmin.ji@icloud.com";
const TEST_PASSWORD = "Q5kL7wPnQ6";

// Sample data for generating posts
const CATEGORIES = ["NOTICE", "QNA", "FREE"];
const TITLE_PREFIXES = [
  "중요 공지",
  "질문 있습니다",
  "자유 게시글",
  "도움이 필요해요",
  "공유합니다",
  "안내사항",
  "문의드립니다",
  "정보 공유",
];
const BODY_TEMPLATES = [
  "이번 주 주요 업데이트 사항에 대해 안내드립니다. 새로운 기능이 추가되었으며, 기존 버그가 수정되었습니다.",
  "React와 TypeScript를 사용한 프로젝트 개발 중 발생한 이슈에 대해 질문드립니다. 해결 방법을 아시는 분 계신가요?",
  "오늘 배운 내용을 정리해서 공유합니다. shadcn/ui를 사용하면 정말 개발 속도가 빨라지네요!",
  "TanStack Query의 useInfiniteQuery를 활용한 무한 스크롤 구현 방법을 소개합니다.",
  "프로젝트 진행 중 유용한 팁을 발견해서 공유드립니다. 많은 도움이 되길 바랍니다.",
  "다음 주 일정 안내드립니다. 모두 참고 부탁드립니다.",
  "API 연동 관련해서 궁금한 점이 있어 문의드립니다.",
  "개발 환경 설정 가이드를 작성했습니다. 참고하시면 좋을 것 같아요.",
];
const TAG_OPTIONS = [
  ["react", "typescript"],
  ["shadcn", "ui", "components"],
  ["tanstack-query", "data-fetching"],
  ["vite", "build-tool"],
  ["tailwindcss", "styling"],
  ["frontend", "web-development"],
  ["api", "integration"],
  ["debugging", "troubleshooting"],
  ["best-practices", "tips"],
  ["guide", "tutorial"],
];

// Helper to get category label
function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    NOTICE: "Notice",
    QNA: "Q&A",
    FREE: "Free",
  };
  return labels[category] || category;
}

// Helper function to generate random data
function generatePostData(index: number) {
  const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
  const titlePrefix =
    TITLE_PREFIXES[Math.floor(Math.random() * TITLE_PREFIXES.length)];
  const bodyTemplate =
    BODY_TEMPLATES[Math.floor(Math.random() * BODY_TEMPLATES.length)];
  const tags = TAG_OPTIONS[Math.floor(Math.random() * TAG_OPTIONS.length)];

  return {
    title: `${titlePrefix} #${index + 1}`,
    body: `${bodyTemplate}\n\n작성 번호: ${
      index + 1
    }\n작성 시간: ${new Date().toLocaleString("ko-KR")}`,
    category,
    tags: tags.join(", "),
  };
}

test.describe("New Post E2E Test", () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto("/");

    // Fill login form
    await page.fill('input[type="email"]', TEST_EMAIL);
    await page.fill('input[type="password"]', TEST_PASSWORD);

    // Click login button
    await page.click('button[type="submit"]');

    // Wait for navigation to posts page
    await page.waitForURL("/posts", { timeout: 10000 });
  });

  test("should create a new post successfully", async ({ page }) => {
    // Generate post data
    const postData = generatePostData(0);

    // Click "New Post" button
    await page.click('button:has-text("New Post")');

    // Wait for navigation to post form
    await page.waitForURL("/posts/new");

    // Fill title
    await page.fill("input#title", postData.title);

    // Select category using shadcn Select component
    await page.click('button[role="combobox"]');
    await page.waitForTimeout(300); // Wait for dropdown to open
    await page.click(
      `[role="option"]:has-text("${getCategoryLabel(postData.category)}")`
    );

    // Fill tags and body
    await page.fill("input#tags", postData.tags);
    await page.fill("textarea#body", postData.body);

    // Submit the form
    await page.click('button[type="submit"]:has-text("Create Post")');

    // Wait for navigation back to posts list
    await page.waitForURL("/posts", { timeout: 10000 });

    // Verify the post appears in the list
    await expect(page.locator(`text=${postData.title}`)).toBeVisible();
  });
});

// Data generation test - creates 100 posts
test.describe("Generate Sample Data", () => {
  test.beforeAll(async () => {
    console.log("Starting to generate 100 sample posts...");
  });

  test("create 100 sample posts", async ({ page }) => {
    // Set longer timeout for this test (10 minutes)
    test.setTimeout(600000);

    // Login once
    await page.goto("/");
    await page.fill('input[type="email"]', TEST_EMAIL);
    await page.fill('input[type="password"]', TEST_PASSWORD);
    await page.click('button[type="submit"]');
    await page.waitForURL("/posts", { timeout: 10000 });

    // Create 100 posts
    for (let i = 0; i < 100; i++) {
      const postData = generatePostData(i);

      console.log(`Creating post ${i + 1}/100: ${postData.title}`);

      try {
        // Navigate to new post page
        await page.click('button:has-text("New Post")');
        await page.waitForURL("/posts/new", { timeout: 10000 });

        // Fill title
        await page.fill("input#title", postData.title, { timeout: 5000 });

        // Select category using shadcn Select component
        await page.click('button[role="combobox"]');
        await page.waitForTimeout(300); // Wait for dropdown to open
        await page.click(
          `[role="option"]:has-text("${getCategoryLabel(postData.category)}")`
        );

        // Fill tags
        await page.fill("input#tags", postData.tags, { timeout: 5000 });

        // Fill body
        await page.fill("textarea#body", postData.body, { timeout: 5000 });

        // Submit
        await page.click('button[type="submit"]:has-text("Create Post")');

        // Wait for navigation
        await page.waitForURL("/posts", { timeout: 10000 });

        // Small delay to avoid overwhelming the server
        await page.waitForTimeout(200);
      } catch (error) {
        console.error(`Failed to create post ${i + 1}:`, error);
        // Take screenshot on error
        await page.screenshot({ path: `test-results/error-post-${i + 1}.png` });
        throw error;
      }
    }

    console.log("✅ Successfully created 100 sample posts!");
  });
});
