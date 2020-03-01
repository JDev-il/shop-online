import { TestBed } from '@angular/core/testing';

import { MarketApiService } from './market-api.service';

describe('MarketApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MarketApiService = TestBed.get(MarketApiService);
    expect(service).toBeTruthy();
  });
});
