import {
    Component,
    OnInit,
    EventEmitter,
    Output,
    Input,
    AfterViewInit,
    ViewChild,
    ChangeDetectorRef,
    AfterViewChecked,
    OnChanges,
    SimpleChanges,
    ElementRef,
} from '@angular/core';
import {
    BsDatepickerDirective,
    BsLocaleService,
} from 'ngx-bootstrap/datepicker';

declare const $: any;

class util {
    static setElementId(name: string): string {
        var id = name + Math.round(Math.random() * 10000);
        return id;
    }
    static setElementLabel(label: string): string {
        return label + " : ";
    }
}
@Component({
    selector: 'app-datepicker',
    templateUrl: './datapicker.component.html'
})
export class DatepickerComponent {
    @ViewChild('datepicker', { static: true })
    datepicker: BsDatepickerDirective;
    @Input() input: Date = new Date();
    @Input() name: string;
    @Input() label: string;
    @Input() max: Date;
    @Output() dateChange = new EventEmitter<Date>();
    id: string = '';
    constructor(
        public cdRef: ChangeDetectorRef
    ) {
        
    }

    ngOnInit(): void {
        this.id = util.setElementId(this.name);
        this.label = util.setElementLabel(this.label);
    }
    onDateChange(event: any): void {
        this.dateChange.emit(event);
    }

    ngOnChanges() {
        this.cdRef.detectChanges(); // trigger change detection manually
    }
}
