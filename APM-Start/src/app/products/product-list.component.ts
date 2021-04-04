import { Component, ChangeDetectionStrategy } from '@angular/core';

import { BehaviorSubject, combineLatest, EMPTY, forkJoin, Subject } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Product } from './product';

import { ProductService } from './product.service';
import { ProductCategoryService } from '../product-categories/product-category.service';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent {
  pageTitle = 'Product List';
  errorMessage = new Subject<string>();
  selectedCategoryId = new BehaviorSubject<number>(0);

  categories$ = this.productCategoryService.productCategories$;
  productsWithCategory$ = this.productService.productsWithCategory$;

  filteredProductsWithCategory$ = combineLatest([this.productsWithCategory$, this.selectedCategoryId]).pipe(
    map(([products, categoryId]) => categoryId ? products.filter((product) => product.categoryId === categoryId) : products),
    tap((products) => console.log(`In filteredProductsWithCategory$ ${products}`))
  );

  vm$ = combineLatest([this.filteredProductsWithCategory$, this.categories$]).pipe(
    map(([products, categories]) => ({ products, categories})),
    catchError((err) => {
      this.errorMessage.next('Error happened');
      return EMPTY;
    })
  )

  constructor(private productService: ProductService, private productCategoryService: ProductCategoryService) { }

  onAdd(): void {
    this.productService.addNewProduct({
      productName: 'My Product',
      categoryId: 3
    } as Product);
  }

  onSelected(categoryId: string): void {
    this.selectedCategoryId.next(+categoryId);
  }

  onProductSelected(product: Product): void {
    this.productService.selectedProductChanged(product.id);
  }
}
