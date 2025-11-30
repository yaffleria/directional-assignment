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

import {
  CoffeeConsumptionResponse,
  PopularSnackBrandsResponse,
  Post,
  SnackImpactResponse,
  TopCoffeeBrandsResponse,
  WeeklyMoodTrendResponse,
  WeeklyWorkoutTrendResponse,
} from "./data-contracts";
import { HttpClient, RequestParams } from "./http-client";

export class Mock<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * @description 서버 시작 시 생성된 고정 500개 데이터 중 앞에서부터 `count`개를 반환합니다. 항상 동일한 데이터셋에서 slice 되므로 요청마다 결과가 일관됩니다.
   *
   * @name PostsList
   * @summary 고정 Mock 데이터 N건 반환 (기본 300, 최대 500)
   * @request GET:/mock/posts
   */
  postsList = (
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
    });
  /**
   * No description
   *
   * @name TopCoffeeBrandsList
   * @summary 바/도넛 차트용 인기 커피 브랜드 분포 목업
   * @request GET:/mock/top-coffee-brands
   */
  topCoffeeBrandsList = (params: RequestParams = {}) =>
    this.request<TopCoffeeBrandsResponse, any>({
      path: `/mock/top-coffee-brands`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @name PopularSnackBrandsList
   * @summary 바/도넛 차트용 인기 간식 브랜드 분포 목업
   * @request GET:/mock/popular-snack-brands
   */
  popularSnackBrandsList = (params: RequestParams = {}) =>
    this.request<PopularSnackBrandsResponse, any>({
      path: `/mock/popular-snack-brands`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @name WeeklyMoodTrendList
   * @summary 스택형 바/면적 차트용 주간 무드 트렌드 목업
   * @request GET:/mock/weekly-mood-trend
   */
  weeklyMoodTrendList = (params: RequestParams = {}) =>
    this.request<WeeklyMoodTrendResponse, any>({
      path: `/mock/weekly-mood-trend`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @name WeeklyWorkoutTrendList
   * @summary 스택형 바/면적 차트용 주간 운동 트렌드 목업
   * @request GET:/mock/weekly-workout-trend
   */
  weeklyWorkoutTrendList = (params: RequestParams = {}) =>
    this.request<WeeklyWorkoutTrendResponse, any>({
      path: `/mock/weekly-workout-trend`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @name CoffeeConsumptionList
   * @summary 멀티라인 차트용 팀별 커피 소비/버그/생산성 목업
   * @request GET:/mock/coffee-consumption
   */
  coffeeConsumptionList = (params: RequestParams = {}) =>
    this.request<CoffeeConsumptionResponse, any>({
      path: `/mock/coffee-consumption`,
      method: "GET",
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @name SnackImpactList
   * @summary 멀티라인 차트용 부서별 간식 영향 목업
   * @request GET:/mock/snack-impact
   */
  snackImpactList = (params: RequestParams = {}) =>
    this.request<SnackImpactResponse, any>({
      path: `/mock/snack-impact`,
      method: "GET",
      format: "json",
      ...params,
    });
}
