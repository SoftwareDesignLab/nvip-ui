import { Component, Input } from '@angular/core';
import { CveService } from '../../services/cve.service';

export class AffectedProduct {
    cpe: string;
    productName: string;
    version: string;
    vendor: string;
    purl: string;
}

@Component({
    selector: 'app-affected-products',
    templateUrl: './affected-products.component.html',
})
export class AffectedProductsComponent {
    @Input() cveId: string = '';

    groupedProducts: Map<string, AffectedProduct[]> = new Map();
    affectedProducts: AffectedProduct[] = [];

    constructor(private cveService: CveService) {}

    ngOnInit(): void {
        this.getAfefectedProducts();
    }

    getAfefectedProducts() {
        this.cveService
            .getAffectedProducts(this.cveId)
            .subscribe((response) => {
                this.affectedProducts = Array.from(response);
                this.groupedProducts = this.groupByProduct(
                    this.affectedProducts
                );
            });
    }

    private groupByProduct(
        items: AffectedProduct[]
    ): Map<string, AffectedProduct[]> {
        const map = new Map<string, AffectedProduct[]>();
        items.forEach((item) => {
            const existing = map.get(item.productName) || [];
            existing.push(item);
            map.set(item.productName, existing);
        });
        return map;
    }
}
