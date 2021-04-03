import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EMPTY } from 'rxjs';
import { catchError, mergeMap, tap } from 'rxjs/operators';
import { SupplierService } from 'src/app/suppliers/supplier.service';

import { ProductService } from '../product.service';

@Component({
  selector: 'pm-product-detail-alt',
  templateUrl: './product-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent {
  pageTitle = 'Product Detail';
  errorMessage = '';
  product$ = this.productService.selectedProduct$.pipe(
    tap((product) => console.log('Got product in product-detail')),
    catchError(err => {
      this.errorMessage = err;
      return EMPTY;
    })
  );

  productSuppliers$ = this.product$.pipe(
    mergeMap((product) => this.supplierService.getSuppliersByIds$(product.supplierIds))
  );

  constructor(private productService: ProductService, private supplierService: SupplierService) { }

}
