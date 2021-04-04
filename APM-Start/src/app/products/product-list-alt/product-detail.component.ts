import { ChangeDetectionStrategy, Component } from '@angular/core';
import { combineLatest, EMPTY } from 'rxjs';
import { catchError, filter, map, mergeMap, shareReplay, switchMap, tap } from 'rxjs/operators';
import { SupplierService } from 'src/app/suppliers/supplier.service';

import { ProductService } from '../product.service';

@Component({
  selector: 'pm-product-detail-alt',
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent {
  errorMessage = '';
  product$ = this.productService.selectedProduct$.pipe(
    tap((product) => console.log('Got product in product-detail')),
    catchError(err => {
      this.errorMessage = err;
      return EMPTY;
    })
  );

  pageTitle$ = this.product$.pipe(
    map((product) => product ? `Product detail for: ${product.productName}` : null)
  )

  productSuppliers$ = this.product$.pipe(
    // The "Just in time" approach
    switchMap((product) => this.supplierService.getSuppliersByIds$(product.supplierIds))
  );

  vm$ = combineLatest([this.product$, this.productSuppliers$, this.pageTitle$]).pipe(
    filter((selectedProduct) => Boolean(selectedProduct)),
    map(([product, productSuppliers, pageTitle]) => ({ product, productSuppliers, pageTitle }))
  )

  constructor(private productService: ProductService, private supplierService: SupplierService) { }

}
