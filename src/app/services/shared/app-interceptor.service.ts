import { Injectable } from "@angular/core";
import {
    HttpInterceptor,
    HttpRequest,
    HttpHeaders,
    HttpParams,
    HttpHandler,
    HttpErrorResponse,
} from "@angular/common/http";
import { catchError, finalize } from "rxjs/operators";
import { throwError } from "rxjs";
import { HttpLoadingService } from "./http-loading.service";

@Injectable({
    providedIn: "root",
})
export class AppInterceptorService implements HttpInterceptor {
    private totalRequests = 0;
    constructor( private loadingService:HttpLoadingService) {}
    intercept(req: HttpRequest<any>, next: HttpHandler) {
        
        this.totalRequests++;
        this.loadingService.loading = true;
        const newReq = req.clone();
    
        return next.handle(newReq).pipe(
            finalize(() => {
                this.totalRequests--;
                if (this.totalRequests == 0) {
                    this.loadingService.loading = false;
                }
            }),
        );
    }
    errorHandler(error:any) {
        if (error instanceof HttpErrorResponse) {
            if (error instanceof ErrorEvent) {
                console.log("error event");
            } else {
                switch (error.status) {
                    case 403:
                        console.log("unauthorized");
                }
            }
        }
        
        return throwError(error);
    }
}
