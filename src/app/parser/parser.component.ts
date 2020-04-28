import { Component, OnInit, ViewChild } from '@angular/core';
import { Papa } from 'ngx-papaparse';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';


@Component({
  selector: 'app-parser',
  templateUrl: './parser.component.html',
  styleUrls: ['./parser.component.scss']
})

export class ParserComponent implements OnInit {
  userInfoToShow: any[] = [];
  headers: any[] = [];
  showSpinner = false;
  public files;
  fileControl: FormControl;
  dataSource = new MatTableDataSource<any>();
  isValidFile = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  /**
   *
   * @param csvParse Object of PapaParser
   * @param iconRegistry Object of MatIconRegistry injectable service
   * @param sanitizer DomSanitizer service
   */
  constructor(private csvParse: Papa,
              iconRegistry: MatIconRegistry,
              sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'open_in_browser',
      sanitizer.bypassSecurityTrustResourceUrl('assets/open_in_browser-black-48dp.svg'));

    this.fileControl = new FormControl(this.files);
  }

  parseCSV() {
    this.showSpinner = true;
    this.isValidFile = true;
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

  applyFilter(filterValue) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {
    this.fileControl.valueChanges.subscribe((files: any) => {
      if (files._files[0].size > 0) {
        this.files = files._files[0];
        this.parseCSV();
      } else {
        this.isValidFile = false;
        this.userInfoToShow = [];
      }
    });
  }
}
