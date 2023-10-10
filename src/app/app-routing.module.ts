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
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './pages/about/about.component';
import { CreateAccountComponent } from './pages/create-account/create-account.component';
import { DailyComponent } from './pages/daily/daily.component';
import { MainComponent } from './pages/main/main.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { RecentComponent } from './pages/recent/recent.component';
import { ReviewComponent } from './pages/review/review.component';
import { SearchComponent } from './pages/search/search.component';
import { VulnerabilityComponent } from './pages/vulnerability/vulnerability.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthService } from './services/Auth/auth-service.service';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'about', component: AboutComponent },
  { path: 'review/:id', component: ReviewComponent, canActivate: [() => inject(AuthService).canActivate()] },
  { path: 'recent', component: RecentComponent, canActivate: [() => inject(AuthService).canActivate()] },
  { path: 'daily', component: DailyComponent, canActivate: [() => inject(AuthService).canActivate()] },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'search', component: SearchComponent, canActivate: [() => inject(AuthService).canActivate()] },
  { path: 'vulnerability/:id', component: VulnerabilityComponent, canActivate: [() => inject(AuthService).canActivate()] },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppRoutingModule {}
