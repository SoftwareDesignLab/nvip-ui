import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor
} from '@angular/common/http';
import { finalize, tap } from 'rxjs';
import { AuthService } from './auth-service.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    // redirects to login page if user token expired (aka 401 error code)
    constructor(private authService: AuthService) {}
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return next.handle(req)
        .pipe(
            tap({
            // Succeeds when there is a response; ignore other events
            next: (event) => {
                // console.log("Good response from server");
            },
            // Operation failed; error is an HttpErrorResponse
            error: (error) => {
                // console.log("Bad response from server, status: " + error.status);
                if (error.status == 401) {
                    // console.log("redirecting to login");
                    this.authService.logout();
                    window.location.href = "/login";
                }
            }
            }),
            finalize(() => {
                
            })
        );
    }
}