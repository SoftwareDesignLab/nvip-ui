import { Injectable } from '@angular/core';
import { Routes } from './apiRoutes';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
    providedIn: 'root',
})
export class SsvcService {
    constructor(private http: HttpClient) {}
    
    getSsvcScore(cveId:string):Observable<any>{
        return this.http.get(Routes.ssvc+"/"+cveId)
    }
}
