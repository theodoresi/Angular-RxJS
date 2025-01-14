import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Supplier } from 'src/app/suppliers/supplier';
import { SupplierService } from 'src/app/suppliers/supplier.service';
import { ProductService } from '../product.service';

@Component({
  selector: 'pm-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product$ = this.route.params.pipe(
    mergeMap((param) => this.productService.getProductById(param.id))
  );
  productSuppliers$ = this.product$.pipe(
    mergeMap((product) => this.supplierService.getSuppliersByIds$(product.supplierIds))
  );

  // The "Get it all" approach
  productSuppliersAlt$ = combineLatest([this.product$, this.supplierService.suppliers$]).pipe(
    map(([product, suppliers]) => suppliers.filter((supplier) => product.supplierIds.includes(supplier.id)))
  );

  vm$ = combineLatest([this.product$, this.productSuppliers$, this.productSuppliersAlt$]).pipe(
    map(([product, suppliers, suppliersAlt]) => ({ product, suppliers, suppliersAlt}))
  )

  constructor(private route: ActivatedRoute, private productService: ProductService, private supplierService: SupplierService) { }

  ngOnInit(): void {
  }
}
