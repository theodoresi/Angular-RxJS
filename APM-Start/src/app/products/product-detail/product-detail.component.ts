import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { mergeMap } from 'rxjs/operators';
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

  constructor(private route: ActivatedRoute, private productService: ProductService, private supplierService: SupplierService) { }

  ngOnInit(): void {
    this.supplierService.suppliers$.subscribe();
  }
}
