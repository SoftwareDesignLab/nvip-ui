import { Injectable } from '@angular/core';
import { Routes } from './apiRoutes';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
    providedIn: 'root',
})
export class CveService {
    constructor(private http: HttpClient) {}

    getDetails(cveId:string):Observable<any>{
        return this.http.get(Routes.cve+"/details/"+cveId)
    }

    getCpe(cveId:string):Observable<any>{
        return this.http.get(Routes.cve+"/cpe/"+cveId)
    }

    getDescription(cveId:string):Observable<any>{
        return this.http.get(Routes.cve+"/description/"+cveId)
    }

    getRawDescription(cveId:string):Observable<any>{
        return this.http.get(Routes.cve+"/rawdescriptions/"+cveId)
    }

    getAffectedProducts(cveId:string):Observable<any>{
        return this.http.get(Routes.cve+"/affectedproducts/"+cveId)
    }

    getExploits(cveId:string):Observable<any>{
        return this.http.get(Routes.cve+"/exploits/"+cveId)
    }

    getVdoLabels(cveId:string):Observable<any>{
        return this.http.get(Routes.cve+"/vdolabels/"+cveId)
    }

    getFixes(cveId:string):Observable<any>{
        return this.http.get(Routes.cve+"/fixes/"+cveId)
    }

    getPatches(cveId:string):Observable<any>{
        return this.http.get(Routes.cve+"/patches/"+cveId)
    }

}
