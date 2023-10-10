/**
 * Copyright 2023 Rochester Institute of Technology (RIT). Developed with
 * government support under contract 70RSAT19CB0000020 awarded by the United
 * States Department of Homeland Security.
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
import { ApiService } from '../Api/api-service.service';
import { CookieService } from '../Cookie/cookie.service';
import { Router } from '@angular/router';


/* Related Interfaces */

/** user credentials from login form */
export interface AuthCredentials {
  userName: string;
  password: string;
}

/** User session - containing valuable information on who's logged in
 * and how elevated their privileges are
 */
export interface Session {
  userID: number;
  userName: string;
  roleId: number;
  firstName: string;
  lastName: string;
  token: string;
  expirationDate: object;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  /** if we get error msg from logging in, store it here */
  incorrectAuth = "";

  /**
   * Authentication service constructor
   * @param api access login endpoints
   * @param cookieService access browser cookie
   */
  constructor(private api: ApiService, private cookieService: CookieService, private router: Router) {}

  /** establish a session on a successful user login */
  onLogin(credentials: AuthCredentials, returnUrl: string) {
    this.api
      .login({
        userName: credentials.userName,
        password: credentials.password,
      })
      .subscribe({
        next: (res) => {
          var response = res as Session;
          var session: Session = {
            userID: response.userID,
            userName: response.userName,
            roleId: response.roleId,
            firstName: response.firstName,
            lastName: response.lastName,
            token: response.token,
            expirationDate: response.expirationDate
          }
          this.cookieService.put('nvip_user', session)
          this.router.navigate([returnUrl]);
          this.incorrectAuth = "";
        },
        error: (e) => {
          this.incorrectAuth = e.error.message;
          return false;
        },
        complete: () => {return true},
      });
  }

  /** check for login by accessing browser cookie */
  isAuthenticated() {
    const cookie = this.cookieService.get('nvip_user');
    return  cookie !== undefined && cookie !== null && Object.keys(cookie).length > 0 ;
  }

  canActivate() {
    if (this.isAuthenticated()) {
      return true;
    }
    this.router.navigate(['login']);
    return false;
}

  /** access browser cookie of logged in user */
  get() {
    return this.cookieService.get('nvip_user');
  }

  /** remove cookie from browser, redirect user */
  logout() {
    this.cookieService.remove('nvip_user');
  }
}
