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

import { Category, SortField, SortOrder } from "./data-contracts";
import type {
  DeleteResponse,
  Post,
  PostCreateRequest,
  PostListResponse,
  PostUpdateRequest,
} from "./data-contracts";
import { ContentType, HttpClient } from "./http-client";
import type { RequestParams } from "./http-client";

export class Posts<
  SecurityDataType = unknown
> extends HttpClient<SecurityDataType> {
  /**
   * @description 양방향 커서 기반 페이지네이션(prevCursor/nextCursor)을 지원합니다. prev/next를 동시에 전달할 수 없습니다.
   *
   * @name PostsList
   * @summary 내 포스트 목록 (본인 것만)
   * @request GET:/posts
   * @secure
   */
  postsList = (
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
    params: RequestParams = {}
  ) =>
    this.request<PostListResponse, void>({
      path: `/posts`,
      method: "GET",
      query: query,
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @name PostsCreate
   * @summary 포스트 작성 (본인)
   * @request POST:/posts
   * @secure
   */
  postsCreate = (data: PostCreateRequest, params: RequestParams = {}) =>
    this.request<Post, void>({
      path: `/posts`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
  /**
   * @description JWT 소유자의 모든 포스트를 삭제합니다.
   *
   * @name PostsDelete
   * @summary 내 모든 포스트 삭제
   * @request DELETE:/posts
   * @secure
   */
  postsDelete = (params: RequestParams = {}) =>
    this.request<DeleteResponse, void>({
      path: `/posts`,
      method: "DELETE",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * No description
   *
   * @name PostsDetail
   * @summary 포스트 단건 (본인 것만)
   * @request GET:/posts/{id}
   * @secure
   */
  postsDetail = (id: string, params: RequestParams = {}) =>
    this.request<Post, void>({
      path: `/posts/${id}`,
      method: "GET",
      secure: true,
      format: "json",
      ...params,
    });
  /**
   * @description 필요한 필드만 부분 업데이트합니다. 최소 1개 필드가 필요합니다.
   *
   * @name PostsPartialUpdate
   * @summary 포스트 부분 업데이트 (본인 것만)
   * @request PATCH:/posts/{id}
   * @secure
   */
  postsPartialUpdate = (
    id: string,
    data: PostUpdateRequest,
    params: RequestParams = {}
  ) =>
    this.request<Post, void>({
      path: `/posts/${id}`,
      method: "PATCH",
      body: data,
      secure: true,
      type: ContentType.Json,
      format: "json",
      ...params,
    });
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
  postsDelete2 = (id: string, params: RequestParams = {}) =>
    this.request<DeleteResponse, void>({
      path: `/posts/${id}`,
      method: "DELETE",
      secure: true,
      format: "json",
      ...params,
    });
}
