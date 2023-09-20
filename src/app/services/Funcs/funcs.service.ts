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
/** Function service */
@Injectable({
  providedIn: 'root'
})
export class FuncsService {

  /** legacy AngularJS openLogin function that uses HTML styling to overlay 
   * login panel over current page and displays to user 
   */
  openLogin() {
    var loginPanel = document.getElementById('loginPanel') as HTMLDivElement;
    var nvipContent = document.getElementById('nvipContent') as HTMLDivElement;
    var loginMessage = document.getElementById(
      'loginMessage'
    ) as HTMLDivElement;
    var loginForm = document.getElementById('loginForm') as HTMLDivElement;

    loginPanel.style.display = 'block';
    loginPanel.style.visibility = 'visible';
    loginPanel.style.opacity = '1';
    nvipContent.style.filter = 'blur(100px)';
    loginMessage.style.display = 'none';
    loginForm.style.marginTop = '4em';
  }

  /**
   * modifies CSS to hide login panel
   */
  closeLogin() {
    var loginPanel = document.getElementById('loginPanel') as HTMLDivElement;
    var nvipContent = document.getElementById('nvipContent') as HTMLDivElement;
    var loginForm = document.getElementById('loginForm') as HTMLDivElement;

    loginPanel.style.display = 'none';
    loginPanel.style.opacity = '0';
    loginForm.style.marginTop = '0';
    nvipContent.style.filter = 'blur(0px)';
  }

  /**
  * modifies CSS to add login failure message
  */
  incorrectLogin(){
    var incorrectMessage = document.getElementById('loginMessage') as HTMLDivElement;

    incorrectMessage.style.display = 'block';
  }

}
