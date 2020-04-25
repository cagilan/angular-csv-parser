import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IssueCountFilterService {
  userInfoList: any[];
  selectedIssueCount: any;
  userInfoToShow: any[];

  constructor() { }

  filter(userInfoList, selectedIssueCount) {
    return userInfoList.filter((record) => {
      return record['Issue count'] === selectedIssueCount;
    });
  }
}
