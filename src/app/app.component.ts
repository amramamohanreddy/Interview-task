import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ExchangeConversionService } from './services/exchange-conversion.service';
import { AppConstants } from 'src/app/constants/app-constants';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

export interface ConverstionHistory {
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  convertedAmount: number;
}
export interface LocalStoreHistory {
  history: Array<ConverstionHistory>
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})


export class AppComponent {
  conversionFormGrp:FormGroup;
  convertedCurrencyList: Array<ConverstionHistory> = [];
  validationErrors: string;
  currencyList: Array<string> = AppConstants.CURRENCY_LIST;
  constructor(private exchangePriceServcie: ExchangeConversionService, private fb: FormBuilder) {

  }
  ngOnInit() {
    this.getConversionHistory();
    this.buildConversionForm();
  }
  /**
   * reactive form group initialization.
   */
  private buildConversionForm() {
    this.conversionFormGrp = this.fb.group({
      amount: ["100" , Validators.required],
      toCurrency: ['USD' , Validators.required],
      fromCurrency: ['EUR' , Validators.required]
    })
  }
  // Getters for the form controls.
  get amount() { return this.conversionFormGrp.get('amount');}
  get toCurrency() { return this.conversionFormGrp.get('toCurrency');}
  get fromCurrency() { return this.conversionFormGrp.get('fromCurrency');}
  /**
   * We make the service call to fetch the converstion rate.
   * Following the convarsion rate, we populated the object and history of the transations as well.
   */
  private getConversionRate = (): void => {
    this.exchangePriceServcie.getLatestConversionRates(this.fromCurrency.value, this.toCurrency.value).
      subscribe(
        data => {
          const converstionRate = data.rates[this.toCurrency.value];
          if(converstionRate) {
            const onGoingConversion = this.getCurrentConverstionRates(converstionRate);
            this.getConversionHistory();
            this.storeHistoryInBrowser(onGoingConversion);
          } else {
            this.validationErrors = "Not received a valid conversion rate, please adujust your currencies.";
          }
        },
        error => {
          this.validationErrors = error.error.error;
        });
  }
  /**
   * Preparing the ongoing currency conversion object.
   */
  private getCurrentConverstionRates = (exchangeRate): ConverstionHistory => {
    let currentConversion: ConverstionHistory;
    const convertedValue = this.amount.value * exchangeRate;
    currentConversion = {
      amount: this.amount.value,
      toCurrency: this.toCurrency.value,
      convertedAmount: convertedValue,
      fromCurrency: this.fromCurrency.value
    }
    return currentConversion;
  }
  /**
   * We clear any exising values in the conversion history array.
   * If there are any values in the history, we fetch them.
   * This method we used two places.
   */
  private getConversionHistory = (): void => {
    this.convertedCurrencyList = [];
    if (localStorage.getItem("exchangeHistory")) {
      this.convertedCurrencyList = (<LocalStoreHistory> JSON.parse(localStorage.getItem("exchangeHistory"))).history;
    }
  }
  /**
   * Store the final avaialbe conversions in array
   * We also, try to create an object with the array of conversions history list.
   * this conversion to object, would help to parse back from string to object.
   */
  private storeHistoryInBrowser = (currentConversion): void => {
    this.convertedCurrencyList.push(currentConversion);
    let localStoreObject: LocalStoreHistory = {
      history: this.convertedCurrencyList
    }
    localStorage.setItem("exchangeHistory", JSON.stringify(localStoreObject));
  }
  convert() {
    this.clearValidationErrors();
    if (this.amount && this.amount.value > 0 && this.fromCurrency.value && this.toCurrency.value) {
      this.getConversionRate();
    } else {
      this.validationErrors = "Please select amount and currencies";
    }
  }
  /**
   * Just make sure we clear any valdation errors before use hits the service/convert button.
   * We can reuse this whereever reuqired and we can add more object to this method as needed.
   */
  private clearValidationErrors() {
    this.validationErrors = '';
  }
}
