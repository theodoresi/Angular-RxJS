import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EMPTY } from 'rxjs';
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
    filter((selectedProduct) => Boolean(selectedProduct)),
    // The "Just in time" approach
    switchMap((product) => this.supplierService.getSuppliersByIds$(product.supplierIds))
  );

  constructor(private productService: ProductService, private supplierService: SupplierService) { }

}
