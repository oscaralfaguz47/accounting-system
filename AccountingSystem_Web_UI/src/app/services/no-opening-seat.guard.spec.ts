import { TestBed, async, inject } from '@angular/core/testing';

import { NoOpeningSeatGuard } from './no-opening-seat.guard';

describe('NoOpeningSeatGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NoOpeningSeatGuard]
    });
  });

  it('should ...', inject([NoOpeningSeatGuard], (guard: NoOpeningSeatGuard) => {
    expect(guard).toBeTruthy();
  }));
});
