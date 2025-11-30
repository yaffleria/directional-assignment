/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export enum SortOrder {
  Asc = "asc",
  Desc = "desc",
}

export enum SortField {
  CreatedAt = "createdAt",
  Title = "title",
}

export enum Category {
  NOTICE = "NOTICE",
  QNA = "QNA",
  FREE = "FREE",
}

export interface User {
  /** @example "u_1" */
  id?: string;
  /** @example "alice@example.com" */
  email?: string;
}

export interface Post {
  /** @example "p_abc123" */
  id: string;
  /** @example "u_1" */
  userId: string;
  /** @example "Sample Post #1" */
  title: string;
  /** @example "Hello world" */
  body: string;
  category: Category;
  /** @example ["react","ts"] */
  tags: string[];
  /** @format date-time */
  createdAt: string;
}

export interface LoginRequest {
  /** @example "alice@example.com" */
  email: string;
  /** @example "alice1234" */
  password: string;
}

export interface LoginResponse {
  token?: string;
  user?: User;
}

export interface PostCreateRequest {
  /** @maxLength 80 */
  title: string;
  /** @maxLength 2000 */
  body: string;
  category: Category;
  /** @maxItems 5 */
  tags?: string[];
}

/** 부분 업데이트. 최소 1개 이상의 필드를 포함. */
export interface PostUpdateRequest {
  /** @maxLength 80 */
  title?: string;
  /** @maxLength 2000 */
  body?: string;
  category?: Category;
  /** @maxItems 5 */
  tags?: string[];
}

export interface PostListResponse {
  items?: Post[];
  /**
   * 다음 페이지를 위한 커서 토큰(opaque base64url). 더 이상 페이지가 없으면 null.
   * @example "eyJzIjoidGl0bGUiLCJvIjoiYXNjIiwidiI6Iu2VnO2VgCIsImlkIjoicF83ODkifQ"
   */
  nextCursor?: string | null;
  /**
   * 이전 페이지를 위한 커서 토큰(opaque base64url). 더 이상 페이지가 없으면 null.
   * @example "eyJzIjoidGl0bGUiLCJvIjoiYXNjIiwidiI6Iu2VnO2VgCIsImlkIjoicF83ODkifQ"
   */
  prevCursor?: string | null;
}

export interface CoffeeDataPoint {
  /**
   * @min 0
   * @example 3
   */
  cups: number;
  /**
   * @min 0
   * @example 6
   */
  bugs: number;
  /**
   * @min 0
   * @max 100
   * @example 85
   */
  productivity: number;
}

export interface CoffeeTeam {
  /** @example "Frontend" */
  team: string;
  series: CoffeeDataPoint[];
}

/** @example {"teams":[{"team":"Frontend","series":[{"cups":1,"bugs":12,"productivity":60},{"cups":2,"bugs":8,"productivity":72},{"cups":3,"bugs":6,"productivity":85},{"cups":4,"bugs":7,"productivity":83},{"cups":5,"bugs":9,"productivity":78}]},{"team":"Backend","series":[{"cups":1,"bugs":14,"productivity":58},{"cups":2,"bugs":10,"productivity":70},{"cups":3,"bugs":7,"productivity":82},{"cups":4,"bugs":8,"productivity":80},{"cups":5,"bugs":11,"productivity":75}]},{"team":"AI","series":[{"cups":1,"bugs":13,"productivity":62},{"cups":2,"bugs":9,"productivity":74},{"cups":3,"bugs":6,"productivity":88},{"cups":4,"bugs":7,"productivity":86},{"cups":5,"bugs":10,"productivity":80}]}]} */
export interface CoffeeConsumptionResponse {
  teams?: CoffeeTeam[];
}

export interface WeeklyMoodItem {
  /** @example "2024-12-09" */
  week: string;
  /**
   * @min 0
   * @max 100
   * @example 72
   */
  happy: number;
  /**
   * @min 0
   * @max 100
   * @example 18
   */
  tired: number;
  /**
   * @min 0
   * @max 100
   * @example 10
   */
  stressed: number;
}

/** @example [{"week":"2024-11-25","happy":68,"tired":21,"stressed":11},{"week":"2024-12-02","happy":61,"tired":25,"stressed":14},{"week":"2024-12-09","happy":72,"tired":18,"stressed":10},{"week":"2024-12-16","happy":58,"tired":30,"stressed":12},{"week":"2024-12-23","happy":80,"tired":15,"stressed":5}] */
export type WeeklyMoodTrendResponse = WeeklyMoodItem[];

export interface TopCoffeeBrandItem {
  /** @example "스타벅스" */
  brand: string;
  /**
   * @min 0
   * @max 100
   * @example 40
   */
  popularity: number;
}

/** @example [{"brand":"스타벅스","popularity":40},{"brand":"컴포즈커피","popularity":25},{"brand":"커피빈","popularity":20},{"brand":"바나프레소","popularity":10},{"brand":"기타","popularity":5}] */
export type TopCoffeeBrandsResponse = TopCoffeeBrandItem[];

export interface DeleteResponse {
  /** @example true */
  ok: boolean;
  /**
   * @min 0
   * @example 1
   */
  deleted: number;
}

export interface SnackImpactDataPoint {
  /**
   * @min 0
   * @example 3
   */
  snacks: number;
  /**
   * @min 0
   * @example 2
   */
  meetingsMissed: number;
  /**
   * @min 0
   * @max 100
   * @example 84
   */
  morale: number;
}

export interface SnackImpactDepartment {
  /** @example "Marketing" */
  name: string;
  metrics: SnackImpactDataPoint[];
}

/** @example {"departments":[{"name":"Marketing","metrics":[{"snacks":1,"meetingsMissed":3,"morale":70},{"snacks":2,"meetingsMissed":2,"morale":78},{"snacks":3,"meetingsMissed":2,"morale":84},{"snacks":4,"meetingsMissed":4,"morale":80},{"snacks":5,"meetingsMissed":5,"morale":76}]},{"name":"Sales","metrics":[{"snacks":1,"meetingsMissed":4,"morale":68},{"snacks":2,"meetingsMissed":3,"morale":75},{"snacks":3,"meetingsMissed":2,"morale":82},{"snacks":4,"meetingsMissed":3,"morale":79},{"snacks":5,"meetingsMissed":6,"morale":73}]},{"name":"HR","metrics":[{"snacks":1,"meetingsMissed":1,"morale":72},{"snacks":2,"meetingsMissed":1,"morale":80},{"snacks":3,"meetingsMissed":2,"morale":87},{"snacks":4,"meetingsMissed":2,"morale":84},{"snacks":5,"meetingsMissed":3,"morale":81}]}]} */
export interface SnackImpactResponse {
  departments?: SnackImpactDepartment[];
}

export interface WeeklyWorkoutItem {
  /** @example "2025-01-05" */
  week: string;
  /**
   * @min 0
   * @example 12
   */
  running: number;
  /**
   * @min 0
   * @example 8
   */
  cycling: number;
  /**
   * @min 0
   * @example 6
   */
  stretching: number;
}

/** @example [{"week":"2025-01-05","running":12,"cycling":8,"stretching":6},{"week":"2025-01-12","running":14,"cycling":10,"stretching":7},{"week":"2025-01-19","running":16,"cycling":9,"stretching":8},{"week":"2025-01-26","running":13,"cycling":11,"stretching":6},{"week":"2025-02-02","running":18,"cycling":12,"stretching":9}] */
export type WeeklyWorkoutTrendResponse = WeeklyWorkoutItem[];

export interface PopularSnackBrandItem {
  /** @example "오리온" */
  name: string;
  /**
   * @min 0
   * @max 100
   * @example 38
   */
  share: number;
}

/** @example [{"name":"오리온","share":38},{"name":"롯데제과","share":28},{"name":"크라운","share":18},{"name":"해태","share":12},{"name":"기타","share":4}] */
export type PopularSnackBrandsResponse = PopularSnackBrandItem[];
