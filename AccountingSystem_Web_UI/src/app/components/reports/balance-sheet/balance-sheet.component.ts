import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BalanceSheetService } from '../../../services/balance-sheet.service';
import { YearsMonthsService } from 'src/app/services/years-months.service';
import { JournalSeatsService } from '../../../services/journal-seats.service';
import { PrintPdf } from '../../models/print';
import { SnackBarSavedChangesComponent } from '../../shared/snack-bar-saved-changes/snack-bar-saved-changes.component';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-balance-sheet',
  templateUrl: './balance-sheet.component.html',
  styles: [],
  providers: [BalanceSheetService, YearsMonthsService, JournalSeatsService]
})
export class BalanceSheetComponent implements OnInit {

  public companyName: string;
  public dataSource = [];
  public idCompany;
  public balanceSheetForm: FormGroup;
  public displayTable: boolean = false;
  public initialDate;
  public finalDate;
  public spinner = false;
  public month;
  public year;
  public months = [];
  public years = [];
  public searchType = 'period';
  public openingSeat = [];
  public finalDateMajor: boolean = false;
  public monthName;

  constructor(private snackBar: MatSnackBar, private yearsMothsService: YearsMonthsService, private formBuilder: FormBuilder, private balanceSheetService: BalanceSheetService) {
    this.openingSeat = JSON.parse(localStorage.getItem('opseat'));
    this.initialDate = this.openingSeat[0].date;
  }

  ngOnInit() {
    this.companyName = localStorage.getItem('companyName');
    this.idCompany = localStorage.getItem('idCompany');
    this.formBalanceSheetDefault();
    this.months = this.yearsMothsService.selectMonths();
    this.years = this.yearsMothsService.selectYears();
  }

  formBalanceSheetDefault() {
    this.balanceSheetForm = this.formBuilder.group({
      searchType: [''],
      month: ['', Validators.required],
      year: ['', Validators.required],
    });
  }

  changeToPeriodSearch() {
    this.searchType = 'period';
    this.month = null;
    this.year = null;
    this.formBalanceSheetDefault();
  }
  changeToDatesSearch() {
    this.initialDate = this.openingSeat[0].date;
    this.searchType = 'dates';
    this.balanceSheetForm = this.formBuilder.group({
      searchType: [''],
      initialDate: [this.initialDate, Validators.required],
      finalDate: ['', Validators.required],
    });
  }
  getBalanceSheet() {
    console.log(this.initialDate, ' / ' + this.finalDate);
    this.balanceSheetService.selectBalanceSheet(this.idCompany, this.searchType, this.initialDate, this.finalDate,
      this.month, this.year).subscribe((res: any) => {
        this.spinner = false;
        this.dataSource = res;
        this.displayTable = true;
      });
  }
  onSubmit() {
    this.finalDateMajor = false;
    if (this.balanceSheetForm.valid) {
      if (this.searchType === 'dates') {
        if (Date.parse(this.initialDate) < Date.parse(this.finalDate)) {
          this.displayTable = false;
          this.spinner = true;
          this.month = 0;
          this.year = 0;
          const endDate = this.finalDate;
          this.finalDate = (endDate.getMonth() + 1) + '-' + endDate.getDate() + '-' + endDate.getFullYear();
          this.getBalanceSheet();
        } else {
          this.finalDateMajor = true;
        }
      } else {
        this.monthName = this.months[this.months.findIndex(res => res.id === this.month)].name;
        this.displayTable = false;
        this.spinner = true;
        this.finalDate = new Date(Date.now()).toUTCString();
        this.getBalanceSheet();
      }
    }

  }

  downloadPdf() {
    if (this.displayTable) {
      let from = document.getElementById('report-title').textContent;
      const printer = new PrintPdf('Balance de Situación '+ from +'.pdf', 'pdf-container');
      printer.downloadPDF();
    } else {
      this.openSnackBar('No existen datos para descargar');
    }
  }
  openSnackBar(message) {
    this.snackBar.openFromComponent(SnackBarSavedChangesComponent, {
      data: { message: message }, duration: 2000,
    });
  }

}
