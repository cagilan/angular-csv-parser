import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { MatTableDataSource } from '@angular/material/table';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MaterialFileInputModule } from 'ngx-material-file-input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';

import { ParserComponent } from './parser.component';

describe('ParserComponent', () => {
  let component: ParserComponent;
  let fixture: ComponentFixture<ParserComponent>;
  let result = {};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ParserComponent],
      imports: [MatTableModule, MatSortModule, MatIconModule, MaterialFileInputModule, MatFormFieldModule,
        MatCardModule, HttpClientModule, BrowserAnimationsModule, FormsModule, ReactiveFormsModule, MatInputModule,
        MatPaginatorModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParserComponent);
    component = fixture.componentInstance;
    result = {
      data: [
        { 'First name': 'peter', 'Sur name': 'parker', 'Issue count': '10', 'Date of birth': '1978-01-02T00:00:00' },
        { 'First name': 'tom', 'Sur name': 'cruise', 'Issue count': '8', 'Date of birth': '1979-02-08T00:00:00' }
      ]
    };
    component.files = {
      name: 'issues'
    };
    fixture.detectChanges();
  });

  describe('initialize component', () => {

    it('should create component', () => {
      expect(component).toBeTruthy();
    });

    it('should check initial component values', () => {
      expect(component.userInfoToShow.length).toEqual(0);
      expect(component.showSpinner).toEqual(false);
    });
  });

  describe('Issue tracker table generation and validation', () => {

    it('it should call the generatingTableData', () => {

      component.generatingTableData(result);

      expect(component.userInfoToShow.length).toEqual(2);
      expect(component.headers.length).toEqual(4);
      expect(component.headers).toEqual(['First name', 'Sur name', 'Issue count', 'Date of birth']);
      expect(component.showSpinner).toBe(false);
    });

    it('should validate the issue tracker table', fakeAsync(() => {

      component.generatingTableData(result);

      tick(300);
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        fixture.detectChanges();

        const compiled = fixture.debugElement.nativeElement;
        const button = compiled.querySelectorAll('button.mat-sort-header-button');

        expect(button[0].innerHTML).toBe('First name');
        expect(button[1].innerHTML).toBe('Sur name');
        expect(button[2].innerHTML).toBe('Issue count');
        expect(button[3].innerHTML).toBe('Date of birth');

        const matCells = compiled.querySelectorAll('mat-cell');

        expect(matCells[0].innerHTML.trim()).toBe('peter');
        expect(matCells[1].innerHTML.trim()).toBe('parker');
        expect(matCells[2].innerHTML.trim()).toBe('10');
        expect(matCells[3].innerHTML.trim()).toBe('1978-01-02T00:00:00');
      });

      expect(component.userInfoToShow.length).toEqual(2);
    }));
  });

  describe('Sorting', () => {
    it('sorting scneario', fakeAsync(() => {

      component.generatingTableData(result);

      tick(300);
      fixture.detectChanges();

      const compiled = fixture.debugElement.nativeElement;
      const button = compiled.querySelectorAll('button.mat-sort-header-button');

      component.dataSource = new MatTableDataSource(component.userInfoToShow);
      component.sort = new MatSort();
      component.dataSource.sort = component.sort;

      button[0].click();
      fixture.detectChanges();

      expect(component.dataSource.filteredData[1]).toEqual({
        'First name': 'tom', 'Sur name': 'cruise',
        'Issue count': '8', 'Date of birth': '1979-02-08T00:00:00'
      });
    }));
  });

  describe('Filter', () => {

    beforeEach(() => {
      component.userInfoToShow = [
        { 'First name': 'peter', 'Sur name': 'parker', 'Issue count': '10' },
        { 'First name': 'tom', 'Sur name': 'cruise', 'Issue count': '8' }
      ];
    });

    it('Should able to filter based on name', () => {

      component.dataSource = new MatTableDataSource(component.userInfoToShow);

      expect(component.showSpinner).toBe(false);
      expect(component.dataSource.filteredData.length).toBe(2);

      component.applyFilter('parker');

      expect(component.dataSource.filteredData[0]).toEqual({
        'First name': 'peter', 'Sur name': 'parker', 'Issue count': '10'
      });
    });

    it('Should able to filter based on issue count', () => {

      component.dataSource = new MatTableDataSource(component.userInfoToShow);

      expect(component.showSpinner).toBe(false);
      expect(component.dataSource.filteredData.length).toBe(2);

      component.applyFilter('8');

      expect(component.dataSource.filteredData[0]).toEqual({
        'First name': 'tom', 'Sur name': 'cruise', 'Issue count': '8'
      });
    });
  });

});
