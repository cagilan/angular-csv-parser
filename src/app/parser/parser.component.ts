import { Component, OnInit } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { IssueCountFilterService } from '../services/issue-count-filter.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FileInput } from 'ngx-material-file-input';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material/icon';


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];


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
  showSpinner = false;
  form: FormGroup;

  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  /**
   *
   * @param csvParse Object of PapaParser
   * @param filterService Object of IssueCountFilterService
   */
  constructor(private csvParse: Papa,
              private filterService: IssueCountFilterService,
              private fb: FormBuilder,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
      iconRegistry.addSvgIcon(
        'open_in_browser',
        sanitizer.bypassSecurityTrustResourceUrl('assets/open_in_browser-black-48dp.svg'));
     }
  /**
   *
   * @param uploadEvent : File Object
   */
  onChange(uploadEvent: any) {

    if (uploadEvent[0]) {
      this.showSpinner = true;
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
      this.showSpinner = false;
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
    this.form = this.fb.group({
      file: []
  });
}


}
