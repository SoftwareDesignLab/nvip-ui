/**
 * Copyright 2023 Rochester Institute of Technology (RIT). Developed with
 * government support under contract 70RCSA22C00000008 awarded by the United
 * States Department of Homeland Security for Cybersecurity and Infrastructure Security Agency.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpContext,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Observer } from 'rxjs';
import { AuthCredentials } from '../Auth/auth-service.service';
import { Routes } from './api_routes';
import { ReviewUpdateCriteria } from 'src/app/models/review-update-criteria.model';
import { ReviewDataCriteria } from 'src/app/models/review-data-criteria.model';

/* Related Interfaces */

export interface HttpRequest {
  url: string;
  options: HttpRequestOptions;
}

export interface HttpRequestOptions {
  method: string;
  headers?: HttpHeaders | { [header: string]: string | string[] } | undefined;
  context?: HttpContext | undefined;
  params?: HttpRequestParams;
  reportProgress?: boolean;
  withCredentials?: boolean;
}

export type HttpRequestParams =
  | HttpParams
  | {
      [param: string]:
        | string
        | number
        | boolean
        | ReadonlyArray<string | number | boolean>;
    };

export type ApiRequestObserver =
  | Partial<Observer<Object>>
  | ((value: Object) => void);


@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private GET_OPTIONS: HttpRequestOptions = {
    method: 'GET',
  };
  private POST_OPTIONS: HttpRequestOptions = {
    method: 'POST',
  };

  constructor(private httpClient: HttpClient) {}

  login(credentials: AuthCredentials) {
    //callback: ApiRequestObserver) {
    const request = this.httpClient.post(
      Routes.login,
      { ...credentials }
    );
    // request.subscribe(callback)
    return request;
  }

  createAccount(credentials: object, callback: ApiRequestObserver) {
    const body = JSON.stringify(credentials);
    this.httpClient
      .post(Routes.register, body, {
        headers: {
          'Content-Type': 'application/json',
        }
      })
      .subscribe(callback);
  }

  countGraphs(callback: ApiRequestObserver) {
    this.httpClient
      .get(Routes.main, this.injectGetParameters({ countGraphs: 'all' }, ""))
      .subscribe(callback);
  }


  cveSearch(searchRequest: any) {
    return this.httpClient
    .get(Routes.vulnerability, this.injectGetParameters({ ...searchRequest }, searchRequest.token))
  }

  reviewUpdate(id: string, updateRequest: ReviewUpdateCriteria, updateRequestData: ReviewDataCriteria, callback: ApiRequestObserver) {
    const body = JSON.stringify(updateRequestData)

    let params = new HttpParams()

    for (const [key, value] of Object.entries(updateRequest)) {
      // console.log("updateRequest - " + `${key}: ${value}`);
      params = params.append(`${key}`, `${value}`)
    }

    this.httpClient
      .post(Routes.review,
        body,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization' : 'Bearer ' + updateRequest.token
          },
          params: params
        }
      )
      .subscribe(callback);
  }

  vulnServGetByID(id: string, username: string, token: string) {
    return this.httpClient.get(
      Routes.vulnerability+'/'+id,
      this.injectGetParameters({
        token: token,
        username: username
      }, token)
    );
  }

  searchInfo(username: string, token: string) {
    return this.httpClient.get(
      Routes.search,
      this.injectGetParameters({
        searchInfo: true,
        token: token,
        username: username
      }, token)
    );
  }

  vulnServGetByDate(date: string, token: string) {
    return this.httpClient.get(
      Routes.vulnerability + '/date/' + date,
      this.injectGetParameters({}, token)
    );
  }

  private injectPostBody(body: object) {
    return { ...this.POST_OPTIONS, body: body };
  }

  private injectGetParameters(params: HttpRequestParams, token: string) {
    return { 
      ...this.GET_OPTIONS, 
      headers: {
        'Authorization' : 'Bearer ' + token
      },
      params: params };
  }
  private injectPostParameters(params: HttpRequestParams, token: string) {
    return { 
      ...this.POST_OPTIONS, 
      headers: {
        'Authorization' : 'Bearer ' + token
      },
      params: params };
  }
}
