import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
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
  suppliers$ = this.product$.pipe(
    mergeMap((product) => this.supplierService.getSuppliersByIds$(product.supplierIds))
  );

  constructor(private route: ActivatedRoute, private productService: ProductService, private supplierService: SupplierService) { }

  ngOnInit(): void {
  }
}
