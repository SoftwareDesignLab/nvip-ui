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
import { Component, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { faKey, faLock, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from 'src/app/services/Api/api-service.service';
import { AuthService } from 'src/app/services/Auth/auth-service.service';

/** Create account page */
@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css']
})
export class CreateAccountComponent {
  /** FontAwesome Icons */
  faKey = faKey;
  faLock = faLock;
  faTimes = faTimes;
  /** Variables to hold form state */
  dataLoading = false;
  credentials = {
    username: '',
    password: '',
    repeatPassword: '',
    fname: '',
    lname: '',
    email: ''
  }

  /** error message if create account fails.. i.e. User Already Exists. */
  invalidCreateAccount = "";

  @Output() cancel = new EventEmitter<{ registerSelected: boolean }>;

  /**
   * create account constructor
   * @param authService access create account endpoint
   */
  constructor(private authService: AuthService, private api: ApiService) { }

  /** give ngForm to api endpoint to create user based on input html form */
  createAccount(f: NgForm) {
    if(f.value.password === f.value.repeatPassword){
      // make api call
      this.api.createAccount(f.value, {
        next: () => {
          this.authService.onLogin({
            userName: f.value.username,
            password: f.value.password,
          }, "/");
          alert("Your account is Created!");
        },
        error: (e) => {
          this.invalidCreateAccount = e.error.message;
        },
      });
    } else {
      this.passwordError();
    }
  }
  /** displays error message is password and repeatPassword don't match */
  passwordError(){
    var passwordError = document.getElementById('registrationMessage') as HTMLDivElement;
    var formSpacing = document.getElementById('regForm') as HTMLDivElement;
    passwordError.style.display = 'block';
    formSpacing.style.marginTop = "6em";
  }

  /** handle close create account */
  clearListener() {
    this.cancel.emit({ registerSelected: false });
  }

}
