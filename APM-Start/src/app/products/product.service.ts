import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject, combineLatest, EMPTY, merge, Observable, of, Subject, throwError } from 'rxjs';
import { catchError, map, scan, tap } from 'rxjs/operators';

import { Product } from './product';
import { Supplier } from '../suppliers/supplier';
import { SupplierService } from '../suppliers/supplier.service';
import { ProductCategoryService } from '../product-categories/product-category.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productsUrl = 'api/products';
  private httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

  products$ = this.http.get<Product[]>(this.productsUrl).pipe(
    tap((products) => console.log(`*** In products$: ${products}`)),
    catchError(this.handleError)
  );

  private newProductSubject = new Subject<Product>();
  productsWithNewProduct$ = merge(this.products$, this.newProductSubject).pipe(
    scan((products: Product[], newProduct: Product) => [...products, newProduct]),
    tap((products) => console.log(`*** In productsWithNewProduct$ ${products}`))
  );

  productsWithCategory$ = combineLatest([this.productsWithNewProduct$, this.productCategoryService.productCategories$]).pipe(
    map(([products, categories]) =>
      products.map((product) => ({
        ...product,
        price: product.price * 100,
        categoryName: categories.find((c) => c.id === product.categoryId)?.name || 'unknown'
      }) as Product)
    ),
    catchError((err) => this.handleError(err)),
    tap((data) => console.log(`*** In productsWithCategory$: ${data}`)),
  );

  productSelectedSubject = new BehaviorSubject<number>(0);
  selectedProduct$ = combineLatest([this.productsWithCategory$, this.productSelectedSubject]).pipe(
    map(([products, productId]) => products.find((product) => product.id === productId)),
    tap((product) => console.log(`*** In SelectedProduct$: ${product}`))
  );

  selectedProductChanged(productId): void {
    this.productSelectedSubject.next(productId);
  }

  addNewProduct(product): void {
    // this.newProductSubject.next(product); // Case 1: Without backend

    // Case 2: interact with backend
    this.http.post<Product>(this.productsUrl, product, this.httpOptions).subscribe({
      next: (p) => this.newProductSubject.next(p)
    });
  }

  getProductById(productId: number): Observable<Product> {
    return this.http.get<Product>(`${this.productsUrl}/${productId}`).pipe(
      tap((product) => console.log(`*** In getProductById: ${product}`))
    );
  }

  constructor(
    private http: HttpClient,
    private supplierService: SupplierService,
    private productCategoryService: ProductCategoryService
  ) { }

  private fakeProduct(): Product {
    return {
      id: 42,
      productName: 'Another One',
      productCode: 'TBX-0042',
      description: 'Our new product',
      price: 8.9,
      categoryId: 3,
      // category: 'Toolbox',
      quantityInStock: 30,
    };
  }

  private handleError(err: any): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }
}
