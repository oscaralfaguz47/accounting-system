import { Component, OnInit } from '@angular/core';
import { IncomeStatementService } from '../../../services/income-statement.service';
import { FormBuilder, FormGroup, Validators, FormGroupDirective } from '@angular/forms';
import { YearsMonthsService } from '../../../services/years-months.service';
import { PrintPdf } from '../../models/print';
import { MatSnackBar } from '@angular/material';
import { SnackBarSavedChangesComponent } from '../../shared/snack-bar-saved-changes/snack-bar-saved-changes.component';

@Component({
  selector: 'app-income-statement',
  templateUrl: './income-statement.component.html',
  styles: [],
  providers: [IncomeStatementService]
})
export class IncomeStatementComponent implements OnInit {

  public companyName: string;
  public dataSource = [];
  public idCompany;
  public incomeStatementForm: FormGroup;
  public displayTable: boolean = false;
  public initialDate;
  public finalDate;
  public spinner = false;
  public month;
  public monthName;
  public year;
  public months = [];
  public years = [];
  public searchType = 'period';
  public finalDateMajor: boolean = false;
  public subtitleDate: string;
  public buttonLabelHideRows: string = 'Mostrar cuentas en ceros';



  constructor(private snackBar: MatSnackBar, private yearsMothsService: YearsMonthsService, private incomeStatementService: IncomeStatementService, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.companyName = localStorage.getItem('companyName');
    this.idCompany = localStorage.getItem('idCompany');
    this.formIncomeStatementDefault();
    this.months = this.yearsMothsService.selectMonths();
    this.years = this.yearsMothsService.selectYears();
  }

  formIncomeStatementDefault() {
    this.incomeStatementForm = this.formBuilder.group({
      month: ['', Validators.required],
      year: ['', Validators.required],
    });
  }
  formDates(){
    this.incomeStatementForm = this.formBuilder.group({
      initialDate: ['', Validators.required],
      finalDate: ['', Validators.required],
    });
  }

  changeToPeriodSearch(formDirective: FormGroupDirective) {
    this.displayTable = false;
    this.searchType = 'period';
    this.formIncomeStatementDefault();
    this.incomeStatementForm.reset();
    formDirective.resetForm();
  }
  changeToDatesSearch(formDirective: FormGroupDirective) {
    this.finalDateMajor = false;
    this.displayTable = false;
    this.searchType = 'dates';
    this.formDates();
    this.incomeStatementForm.reset();
    formDirective.resetForm();
  }

  showAccountsWithoutAmount() {
    var elements = document.getElementsByClassName('table-row');
    for (var i = 0; i < elements.length; i++) {
      console.log(elements[i].className);
      if (elements[i].className.indexOf('hide') !== -1) {
        this.buttonLabelHideRows = 'Ocultar cuentas en ceros';
        elements[i].classList.remove('hide');
      } else {
        this.buttonLabelHideRows = 'Mostrar cuentas en ceros';
        elements[i].classList.add('hide');
      }
    }
  }
  getIncomeStatement(formDirective) {
    this.incomeStatementService.selectIncomeStatement(this.idCompany, this.searchType, this.initialDate, this.finalDate,
      this.month, this.year).subscribe((res: any) => {

        this.initialDate = null;
        this.finalDate = null;
        this.month = null;
        this.year = null;
        this.incomeStatementForm.reset();
        formDirective.resetForm();
        this.spinner = false;
        this.dataSource = res;
        this.displayTable = true;
      });
  }
  onSubmit(formDirective: FormGroupDirective) {
    if (this.incomeStatementForm.valid) {
      if (this.searchType === 'dates') {
        console.log('dates');
        if (Date.parse(this.initialDate) < Date.parse(this.finalDate)) {
          this.displayTable = false;
          this.spinner = true;
          this.month = 0;
          this.year = 0;
          const startDate = this.initialDate;
          this.initialDate = (startDate.getMonth() + 1) + '-' + startDate.getDate() + '-' + startDate.getFullYear();
          const endDate = this.finalDate;
          this.subtitleDate = 'Del ' + startDate.getDate() + '-' + (startDate.getMonth() + 1) + '-' + startDate.getFullYear() +
           ' al ' + endDate.getDate() + '-' + (endDate.getMonth() + 1) + '-' + endDate.getFullYear();
          this.finalDate = (endDate.getMonth() + 1) + '-' + endDate.getDate() + '-' + endDate.getFullYear();
          this.getIncomeStatement(formDirective);
        } else {
          this.finalDateMajor = true;
        }
      } else {
        console.log('period');
        this.monthName = this.months[this.months.findIndex(res => res.id === this.month)].name;
        this.displayTable = false;
        this.spinner = true;
        this.initialDate = new Date(Date.now()).toUTCString();
        this.finalDate = new Date(Date.now()).toUTCString();
        this.subtitleDate = 'Período ' + this.monthName + ' del ' + this.year;
        this.getIncomeStatement(formDirective);
      }
    }
  }

  downloadPdf() {
    if (this.displayTable) {
      let from = document.getElementById('report-title').textContent;
      const printer = new PrintPdf('Estado Resultados '+ from +'.pdf', 'pdf-container');
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
