import { Component, OnInit } from "@angular/core";
import { HttpLoadingService } from "../../services/shared/http-loading.service";

@Component({
    selector: "app-spinner",
    templateUrl: "./spinner.component.html",
})
export class SpinnerComponent implements OnInit {
    constructor(public loadingService:HttpLoadingService) {}

    ngOnInit(): void {}
}
