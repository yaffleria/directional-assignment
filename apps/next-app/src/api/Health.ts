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

import { HttpClient } from './http-client'
import type { RequestParams } from './http-client'

export class Health<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @name HealthList
   * @summary Health check
   * @request GET:/health
   */
  healthList = (params: RequestParams = {}) =>
    this.request<void, any>({
      path: `/health`,
      method: 'GET',
      ...params
    })
}
