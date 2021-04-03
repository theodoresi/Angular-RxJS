import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { throwError, Observable, of, concat, from } from 'rxjs';
import { concatMap, mergeMap, tap, toArray } from 'rxjs/operators';
import { Supplier } from './supplier';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  suppliersUrl = 'api/suppliers';

  constructor(private http: HttpClient) { }

  getSuppliersByIds$(ids: number[]): Observable<Supplier[]> {
    return from(ids).pipe(
      // mergeMap takes a function whose return value is an Observable
      // It then maps the result Observable to the value encapsulated in it, in this caase, Supplier
      concatMap((supplierId) => this.http.get<Supplier>(`${this.suppliersUrl}/${supplierId}`)),
      // So for the next operator, the paramter is a Supplier
      tap((supplier: Supplier) => console.log(`${supplier.name} (${supplier.id})`)),
      toArray()
    );
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
