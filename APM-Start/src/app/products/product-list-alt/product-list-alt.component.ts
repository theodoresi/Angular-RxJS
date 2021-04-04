import { ChangeDetectionStrategy, Component } from '@angular/core';

import { combineLatest, EMPTY, Subject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { ProductService } from '../product.service';

@Component({
  selector: 'pm-product-list',
  templateUrl: './product-list-alt.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListAltComponent {
  pageTitle = 'Products';
  errorMessage = new Subject<string>();
  selectedProduct$ = this.productService.selectedProduct$;

  products$ = this.productService.productsWithCategory$.pipe(
    catchError((err) => {
      this.errorMessage.next(err);
      return EMPTY;
    })
  );

  vm$ = combineLatest([this.products$, this.selectedProduct$]).pipe(
    map(([products, selectedProduct ]) => ({ products, selectedProduct }))
  )

  constructor(private productService: ProductService) { }


  onSelected(productId: number): void {
    this.productService.selectedProductChanged(productId);
  }
}
