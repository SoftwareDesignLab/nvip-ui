import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PreloaderComponent } from './layout/preloader/preloader.component';
import { TopHeaderComponent } from './layout/top-header/top-header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HttpClientModule } from '@angular/common/http';
import { CveModule } from './cve/cve.module';
import { AboutComponent } from './layout/about/about.component';
import { FaqComponent } from './layout/faq/faq.component';



@NgModule({
    declarations: [
        AppComponent,
        PreloaderComponent,
        TopHeaderComponent,
        FooterComponent,
        AboutComponent,
        FaqComponent,
   
    ],
    imports: [BrowserModule, AppRoutingModule,HttpClientModule, CveModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
