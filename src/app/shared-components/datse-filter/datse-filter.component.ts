import { Component, Input, OnInit, Output  ,EventEmitter} from "@angular/core";
import { DatePeriod } from "../../cve/models/utils.model";



@Component({
    selector: "app-datse-filter",
    templateUrl: "./datse-filter.component.html",
    styleUrls: ["./datse-filter.component.scss"],
})
export class DatseFilterComponent implements OnInit {
    id:string="datefilter"
    @Input() filterDates:DatePeriod=new DatePeriod()
    @Input() header:string=""
    @Output() datesChange:EventEmitter<boolean>=new EventEmitter<boolean>();
    constructor() {}

    ngOnInit(): void {
       
    }
}
