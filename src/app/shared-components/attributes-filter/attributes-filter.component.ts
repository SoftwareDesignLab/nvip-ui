import { Component ,EventEmitter, Input, Output} from '@angular/core';
import { Attributes } from '../../cve/models/utils.model';

@Component({
    selector: 'app-attributes-filter',
    templateUrl: './attributes-filter.component.html',
})
export class AttributesFilterComponent {

    @Input() SourceAttributes: any;
    @Input() TargetAttributes: Attributes;
    @Output() contentUpdate = new EventEmitter();
    id = Math.round(Math.random() * 10000);
    ngOnInit() {}
    onCheckboxChange(i:number, event:any) {
        if (event.target.checked){
            this.TargetAttributes.push(event.target.name, event.target.value);
        }else{
            this.TargetAttributes.pop(event.target.name, event.target.value);
        }
        this.contentUpdate.emit(true);
    }
}
