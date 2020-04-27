import { Component, OnInit } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { IssueCountFilterService } from '../services/issue-count-filter.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { FileInput } from 'ngx-material-file-input';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';


export interface PeriodicElement {
  name: string;
  position: string;
  weight: number;
  symbol: string;
  //   // first_name: string;
  //   // sur_name: string;
  //   // issue_count: number;
  //   // dob: string;

}

const ELEMENT_DATA: PeriodicElement[] = [
  { name: '1', position: 'chadran', weight: 1.0079, symbol: '1' },
  { name: '2', position: 'agilan', weight: 4.0026, symbol: '1' },
  { name: '3', position: 'agilan2', weight: 6.941, symbol: '1' },
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
  public files;

  fileControl: FormControl;


  // displayedColumns: string[] = ['name', 'position', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<any>();

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

    this.fileControl = new FormControl(this.files);
  }
  /**
   *
   * @param uploadEvent : File Object
   */
  parseCSV(file) {
    this.showSpinner = true;
    this.csvParse.parse(file._files[0], {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        this.generatingTableData(result);
      }
    });
  }

  generatingTableData(result) {
    /**
     * userInfoList : keeping a copy of result data
     */
    this.userInfoList = result.data;
    this.headers = Object.keys(result.data[0]);
    this.userInfoToShow = result.data;
    this.dataSource = new MatTableDataSource(this.userInfoToShow);
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
    this.fileControl.valueChanges.subscribe((files: any) => {
      this.parseCSV(files);
    });
  }

  sortData($event) {
    const sortId = $event.active;
    const sortDirection = $event.direction;
    if ('asc' === sortDirection) {
      this.dataSource.data = this.userInfoToShow.slice().sort(
        (a, b) => a[sortId] > b[sortId] ? -1 : a[sortId] < b[sortId] ? 1 : 0
      );
    } else {
      this.dataSource.data = this.userInfoToShow.slice().sort(
        (a, b) => a[sortId] > b[sortId] ? -1 : a[sortId] < b[sortId] ? 1 : 0
      );
    }
  }
}
