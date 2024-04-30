import { Component, Input } from '@angular/core';
import { AffectedProduct, AffectedProductsComponent } from '../affected-products/affected-products.component';
import { CveService } from '../../services/cve.service';

@Component({
    selector: 'app-cpe',
    templateUrl: './cpe.component.html',
    styleUrl: './cpe.component.scss',
})
export class CpeComponent extends AffectedProductsComponent {
   
}
