import { Component, OnInit } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { IssueCountFilterService } from '../services/issue-count-filter.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-parser',
  templateUrl: './parser.component.html',
  styleUrls: ['./parser.component.scss']
})
export class ParserComponent implements OnInit {

  /**
   * userInfoList: makes a copy of parsed csv data
   */
  userInfoList: any[] = [];
  /**
   *  selectedIssueCount : User entered Issue Count
   */
  selectedIssueCount: any;
  /**
   *   userInfoToShow : Data to display
   */
  userInfoToShow: any[] = [];
  sortedInfo: any[] = [];
  headers: any[] = [];
  currentActiveSortIndex: string;

  /**
   *
   * @param csvParse Object of PapaParser
   * @param filterService Object of IssueCountFilterService
   */
  constructor(private csvParse: Papa, private filterService: IssueCountFilterService, private spinner: NgxSpinnerService) { }

  /**
   *
   * @param uploadEvent : File Object
   */
  onChange(uploadEvent: any) {

    if (uploadEvent[0]) {
      this.spinner.show();
      this.csvParse.parse(uploadEvent[0], {
        header: true,
        skipEmptyLines: true,
        complete: (result, file) => {

          this.generatingTableData(result);
        }
      });
    }
  }

  generatingTableData(result) {
    /**
     * userInfoList : keeping a copy of result data
     */
    this.userInfoList = result.data;
    this.headers = Object.keys(result.data[0]);
    this.userInfoToShow = result.data;
    setTimeout(() => {
      /** spinner ends after 500 milli-seconds */
      this.spinner.hide();
    }, 500);
  }

  filter() {
    this.userInfoToShow = this.filterService.filter(this.userInfoList, this.selectedIssueCount);
    /**
     * If the entered issue count is not present, it will display NO RECORDS FOUND
     * and resetting the table logic
     */
    if (this.userInfoToShow.length === 0 && this.selectedIssueCount === '') {
      this.userInfoToShow = this.userInfoList;
    }
  }

  compare = (index) => (a, b) => {
    if (a[index] < b[index]) {
      return -1;
    }
    if (a[index] > b[index]) {
      return 1;
    }
    return 0;
  }

  sort(index) {
    this.currentActiveSortIndex = index;
    this.userInfoToShow.sort(this.compare(index));
  }

  ngOnInit() {
  }

}
