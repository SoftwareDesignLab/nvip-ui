import { Injectable } from '@angular/core';
import { Routes } from './apiRoutes';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
    providedIn: 'root',
})
export class VulnerabilitiesService {
    constructor(private http: HttpClient) {}

    findAll(options: any): Observable<any> {
        return this.http.get(Routes.vulnerability, {
            params: options,
        });
    }

    search(options:any,searchData:any):Observable<any>{
        let params = new HttpParams();
        Object.keys(options).forEach(key => {
            params = params.set(key, options[key]);
        });
        return  this.http.post(Routes.vulnerability+"/search",searchData,{
            params
        })
    }

    findOne(cveId: string): Observable<any> {
        return this.http.get(Routes.vulnerability + cveId);
    }
}
