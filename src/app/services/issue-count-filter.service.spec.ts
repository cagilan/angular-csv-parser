import { TestBed } from '@angular/core/testing';

import { IssueCountFilterService } from './issue-count-filter.service';

describe('IssueCountFilterService', () => {
  let service: IssueCountFilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IssueCountFilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
