import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopheaderComponent } from './home/headers/topheader/topheader.component';
import { FooterComponent } from './home/headers/footer/footer.component';
import { CveModule } from './cve/cve.module';
import { AppInterceptorService } from './services/shared/app-interceptor.service';

@NgModule({
    declarations: [AppComponent, TopheaderComponent, FooterComponent],
    imports: [BrowserModule, AppRoutingModule, CveModule, HttpClientModule],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AppInterceptorService,
            multi: true,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
