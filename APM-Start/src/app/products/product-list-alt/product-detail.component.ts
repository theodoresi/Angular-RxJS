import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EMPTY } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

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
  productSuppliers = [];

  constructor(private productService: ProductService) { }

}
