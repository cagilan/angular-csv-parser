import { FileInput } from 'ngx-material-file-input';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { IssueCountFilterService } from '../services/issue-count-filter.service';


@Component({
  selector: 'app-parser',
  templateUrl: './parser.component.html',
  styleUrls: ['./parser.component.scss']
})

export class ParserComponent implements OnInit {
  userInfoToShow: any[] = [];
  selectedIssueCount: any;
  headers: any[] = [];
  showSpinner = false;
  public files;
  fileControl: FormControl;
  // displayedColumns: string[] = ['first', 'last', 'count', 'dob'];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  /**
   *
   * @param csvParse Object of PapaParser
   * @param filterService Object of IssueCountFilterService
   */
  constructor(private csvParse: Papa,
              private filterService: IssueCountFilterService,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'open_in_browser',
      sanitizer.bypassSecurityTrustResourceUrl('assets/open_in_browser-black-48dp.svg'));

    this.fileControl = new FormControl(this.files);
  }
  /**
   *
   * @param file : File Object
   */
  parseCSV(file) {
    this.files = file._files[0];
    this.showSpinner = true;
    this.csvParse.parse(this.files, {
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
    this.headers = Object.keys(result.data[0]);
    this.userInfoToShow = result.data;
    this.dataSource = new MatTableDataSource(this.userInfoToShow);
    setTimeout(() => {
      this.showSpinner = false;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }, 300);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {
    this.fileControl.valueChanges.subscribe((files: any) => {
      if (files) {
        this.parseCSV(files);
      }
    });
  }
}
