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
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/Auth/auth-service.service';
import { faTimes, faKey, faLock } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
    /** Font Awesome Icons */
    faTimes = faTimes;
    faKey = faKey;
    faLock = faLock;
    /** Variables to hold credentials state in form */
    dataLoading = false;
    credentials = {
        username: '',
        password: '',
    };
    registerSelected = false;

    /**
     * login panel constructor
     * @param authService - authentication service singleton - access auth api calls
     * @param funcs - access globally init functions
     */
    constructor(private authService: AuthService) {}

    /** access login endpoint from loginServlet */
    login(f: NgForm, ) {
        this.dataLoading = true;
        this.authService.onLogin({
        userName: f.value.username,
        password: f.value.password,
        }, "/");
        this.dataLoading = false;
    }

    incorrectLoginListener() {
        return this.authService.incorrectAuth;
    }

    /** handle close login */
    clearListener() {
        this.registerSelected = false;
    }

    /** handle register button click */
    registerListener() {
        this.registerSelected = true;
    }

}
