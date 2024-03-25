import { Injectable } from "@angular/core";

@Injectable({
    providedIn: "root",
})
export class HttpLoadingService {
    public loading: boolean = false;
    constructor() {}


}
