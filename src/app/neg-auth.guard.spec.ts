import { TestBed, async, inject } from '@angular/core/testing';

import { NegAuthGuard } from './neg-auth.guard';

describe('NegAuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NegAuthGuard]
    });
  });

  it('should ...', inject([NegAuthGuard], (guard: NegAuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
