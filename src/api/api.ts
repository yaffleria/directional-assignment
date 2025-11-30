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

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "https://fe-hiring-rest-api.vercel.app",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title FE Hiring REST API
 * @version 1.0.0
 * @baseUrl https://fe-hiring-rest-api.vercel.app
 *
 * 로그인(JWT) / 본인 포스트 작성·조회 / 목업 300건 제공 - Enum/조건부 입력/제한조건 반영
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  health = {
    /**
     * No description
     *
     * @name HealthList
     * @summary Health check
     * @request GET:/health
     */
    healthList: (params: RequestParams = {}) =>
      this.request<void, any>({
        path: `/health`,
        method: "GET",
        ...params,
      }),
  };
  auth = {
    /**
     * No description
     *
     * @name LoginCreate
     * @summary 로그인 (JWT 발급)
     * @request POST:/auth/login
     */
    loginCreate: (data: LoginRequest, params: RequestParams = {}) =>
      this.request<LoginResponse, void>({
        path: `/auth/login`,
        method: "POST",
        body: data,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
  posts = {
    /**
     * @description 양방향 커서 기반 페이지네이션(prevCursor/nextCursor)을 지원합니다. prev/next를 동시에 전달할 수 없습니다.
     *
     * @name PostsList
     * @summary 내 포스트 목록 (본인 것만)
     * @request GET:/posts
     * @secure
     */
    postsList: (
      query?: {
        /**
         * 페이지 크기 (1~100)
         * @min 1
         * @max 100
         * @default 10
         */
        limit?: number;
        /** 이전 페이지용 커서(opaque). 이전 응답의 prevCursor를 그대로 전달. nextCursor와 동시 사용 불가. */
        prevCursor?: string;
        /** 다음 페이지용 커서(opaque). 이전 응답의 nextCursor를 그대로 전달. prevCursor와 동시 사용 불가. */
        nextCursor?: string;
        /** 정렬 필드 */
        sort?: SortField;
        /** 정렬 방향 */
        order?: SortOrder;
        category?: Category;
        /** @format date-time */
        from?: string;
        /** @format date-time */
        to?: string;
        /** 제목/본문 검색어 (공백으로 여러 단어 입력 시 AND 매칭) */
        search?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<PostListResponse, void>({
        path: `/posts`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name PostsCreate
     * @summary 포스트 작성 (본인)
     * @request POST:/posts
     * @secure
     */
    postsCreate: (data: PostCreateRequest, params: RequestParams = {}) =>
      this.request<Post, void>({
        path: `/posts`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description JWT 소유자의 모든 포스트를 삭제합니다.
     *
     * @name PostsDelete
     * @summary 내 모든 포스트 삭제
     * @request DELETE:/posts
     * @secure
     */
    postsDelete: (params: RequestParams = {}) =>
      this.request<DeleteResponse, void>({
        path: `/posts`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name PostsDetail
     * @summary 포스트 단건 (본인 것만)
     * @request GET:/posts/{id}
     * @secure
     */
    postsDetail: (id: string, params: RequestParams = {}) =>
      this.request<Post, void>({
        path: `/posts/${id}`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description 필요한 필드만 부분 업데이트합니다. 최소 1개 필드가 필요합니다.
     *
     * @name PostsPartialUpdate
     * @summary 포스트 부분 업데이트 (본인 것만)
     * @request PATCH:/posts/{id}
     * @secure
     */
    postsPartialUpdate: (
      id: string,
      data: PostUpdateRequest,
      params: RequestParams = {},
    ) =>
      this.request<Post, void>({
        path: `/posts/${id}`,
        method: "PATCH",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name PostsDelete2
     * @summary 포스트 삭제 (본인 것만)
     * @request DELETE:/posts/{id}
     * @originalName postsDelete
     * @duplicate
     * @secure
     */
    postsDelete2: (id: string, params: RequestParams = {}) =>
      this.request<DeleteResponse, void>({
        path: `/posts/${id}`,
        method: "DELETE",
        secure: true,
        format: "json",
        ...params,
      }),
  };
  mock = {
    /**
     * @description 서버 시작 시 생성된 고정 500개 데이터 중 앞에서부터 `count`개를 반환합니다. 항상 동일한 데이터셋에서 slice 되므로 요청마다 결과가 일관됩니다.
     *
     * @name PostsList
     * @summary 고정 Mock 데이터 N건 반환 (기본 300, 최대 500)
     * @request GET:/mock/posts
     */
    postsList: (
      query?: {
        /**
         * 반환할 항목 수 (고정 500개 중 앞에서부터 slice). 기본 300, 최대 500
         * @min 1
         * @max 500
         * @default 300
         * @example 5
         */
        count?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          items?: Post[];
          /** @example 300 */
          count?: number;
        },
        any
      >({
        path: `/mock/posts`,
        method: "GET",
        query: query,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name TopCoffeeBrandsList
     * @summary 바/도넛 차트용 인기 커피 브랜드 분포 목업
     * @request GET:/mock/top-coffee-brands
     */
    topCoffeeBrandsList: (params: RequestParams = {}) =>
      this.request<TopCoffeeBrandsResponse, any>({
        path: `/mock/top-coffee-brands`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name PopularSnackBrandsList
     * @summary 바/도넛 차트용 인기 간식 브랜드 분포 목업
     * @request GET:/mock/popular-snack-brands
     */
    popularSnackBrandsList: (params: RequestParams = {}) =>
      this.request<PopularSnackBrandsResponse, any>({
        path: `/mock/popular-snack-brands`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name WeeklyMoodTrendList
     * @summary 스택형 바/면적 차트용 주간 무드 트렌드 목업
     * @request GET:/mock/weekly-mood-trend
     */
    weeklyMoodTrendList: (params: RequestParams = {}) =>
      this.request<WeeklyMoodTrendResponse, any>({
        path: `/mock/weekly-mood-trend`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name WeeklyWorkoutTrendList
     * @summary 스택형 바/면적 차트용 주간 운동 트렌드 목업
     * @request GET:/mock/weekly-workout-trend
     */
    weeklyWorkoutTrendList: (params: RequestParams = {}) =>
      this.request<WeeklyWorkoutTrendResponse, any>({
        path: `/mock/weekly-workout-trend`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name CoffeeConsumptionList
     * @summary 멀티라인 차트용 팀별 커피 소비/버그/생산성 목업
     * @request GET:/mock/coffee-consumption
     */
    coffeeConsumptionList: (params: RequestParams = {}) =>
      this.request<CoffeeConsumptionResponse, any>({
        path: `/mock/coffee-consumption`,
        method: "GET",
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @name SnackImpactList
     * @summary 멀티라인 차트용 부서별 간식 영향 목업
     * @request GET:/mock/snack-impact
     */
    snackImpactList: (params: RequestParams = {}) =>
      this.request<SnackImpactResponse, any>({
        path: `/mock/snack-impact`,
        method: "GET",
        format: "json",
        ...params,
      }),
  };
}
