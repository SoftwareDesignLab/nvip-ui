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
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MainComponent } from './pages/main/main.component';
import { AboutComponent } from './pages/about/about.component';
import { ReviewComponent } from './pages/review/review.component';
import { RecentComponent } from './pages/recent/recent.component';
import { CreateAccountComponent } from './pages/create-account/create-account.component';
import { DailyComponent } from './pages/daily/daily.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { SearchComponent } from './pages/search/search.component';
import { VulnerabilityComponent } from './pages/vulnerability/vulnerability.component';
import { DailyVulnDropdownComponent } from './components/daily-vuln-dropdown/daily-vuln-dropdown.component';
import { ApiService } from './services/Api/api-service.service';
import { AuthService } from './services/Auth/auth-service.service';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NvipChartComponent } from './components/nvip-chart/nvip-chart.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SearchDropdownComponent } from './components/search-dropdown/search-dropdown.component';
import { GoogleChartComponent } from './components/google-chart/google-chart.component';
import { GoogleGaugeComponent } from './components/google-chart/google-gauge.component';
import { LoginComponent } from './pages/login/login.component';
import {
  NavbarModule,
  CollapseModule,
  GridModule,
  FooterModule,
  AccordionModule,
  SharedModule,
  TableModule,
  UtilitiesModule,
  BadgeModule,
  ButtonModule,
  TooltipModule
} from '@coreui/angular';
import { AuthInterceptor } from './services/Auth/app-http-interceptor.service';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    MainComponent,
    AboutComponent,
    ReviewComponent,
    RecentComponent,
    CreateAccountComponent,
    DailyComponent,
    PrivacyComponent,
    SearchComponent,
    VulnerabilityComponent,
    DailyVulnDropdownComponent,
    NvipChartComponent,
    SearchDropdownComponent,
    GoogleChartComponent,
    GoogleGaugeComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FontAwesomeModule,
    NgxChartsModule,
    FormsModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    NavbarModule,
    CollapseModule,
    GridModule,
    FooterModule,
    AccordionModule,
    SharedModule,
    TableModule,
    UtilitiesModule,
    BadgeModule,
    ButtonModule,
    TooltipModule
  ],
  providers: [
    ApiService, 
    AuthService, 
    HttpClientModule,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons();
  }
}
