import { TestBed } from '@angular/core/testing';

import { ExchangeConversionService } from './exchange-conversion.service';

describe('ExchangeConversionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExchangeConversionService = TestBed.get(ExchangeConversionService);
    expect(service).toBeTruthy();
  });
});
