import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { filter, map, catchError} from 'rxjs/operators';

export interface ExchangeObject {
    rates:{},
    base: string,
    date: string
}

@Injectable({
  providedIn: 'root'
})

export class ExchangeConversionService {

  constructor( private http:HttpClient) { }

  getLatestConversionRates(baseCurrency, toCurrency): Observable<ExchangeObject> {
    const exchangePriceAPI = "https://api.exchangeratesapi.io/latest?symols=" + toCurrency +"&base=" + baseCurrency
    return this.http.get<ExchangeObject>(exchangePriceAPI).pipe(
      map(data => data),
      catchError(error => {
        return throwError(error);
      })
    );

  }
}
