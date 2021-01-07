import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MonthlyClosingsService } from '../../../services/monthly-closings.service';
import { YearsMonthsService } from '../../../services/years-months.service';
import { MatDialog, MatSnackBar, MatTableDataSource } from '@angular/material';
import { ConfirmationMessageComponent } from '../../shared/confirmation-message/confirmation-message.component';
import { IncomeStatementService } from '../../../services/income-statement.service';
import { SnackBarSavedChangesComponent } from '../../shared/snack-bar-saved-changes/snack-bar-saved-changes.component';
import { LoadingDialogComponent } from '../../shared/loading-dialog/loading-dialog.component';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-monthly-closing',
  templateUrl: './monthly-closing.component.html',
  styles: [],
  providers: [MonthlyClosingsService, YearsMonthsService, IncomeStatementService]
})
export class MonthlyClosingComponent implements OnInit, AfterViewInit {

  public spinnerCalculating: boolean;
  displayedColumns: string[] = ['month', 'year', 'profitLoss', 'detail', 'date', 'icons'];
  dataSource: any = [];
  @ViewChild(MatPaginator, {static: false})
  set paginator(value: MatPaginator) {
    if (this.dataSource){
      this.dataSource.paginator = value;
    }
  }
  @ViewChild(MatSort, {static: false})
  set sort(value: MatSort) {
    if (this.dataSource){
      this.dataSource.sort = value;
    }
  }
  public idCompany;
  public progressBar: boolean = false;
  public companyName: string;
  public isCreating: boolean = false;
  public isEditing: boolean = false;
  public form: FormGroup;
  public spinner: boolean = true;
  public months = [];
  public years = [];
  public month: number;
  public year: number;
  public detail: string;
  public closing = {};
  public profitOrLoss: number;
  public data = [];


  constructor(private snackBar: MatSnackBar, public dialog: MatDialog, private yearsMonthsService: YearsMonthsService,
    private monthlyClosingsService: MonthlyClosingsService,
    private formBuilder: FormBuilder, private incomeStatementService: IncomeStatementService) { }
    ngAfterViewInit() {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

  ngOnInit() {
    this.idCompany = localStorage.getItem('idCompany');
    this.companyName = localStorage.getItem('companyName');
    this.getMonthlyClosings();
    this.months = this.yearsMonthsService.selectMonths();
    this.years = this.yearsMonthsService.selectYears();
    this.formGroup();
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  getMonthlyClosings() {
    this.monthlyClosingsService.selectMonthlyClosings().subscribe((res: any) => {
      this.data = res;
      this.spinner = false;
      this.dataSource = new MatTableDataSource(res);
    });
  }
  inicialize() {
    this.month = null;
    this.year = null;
    this.detail = null;
    this.formGroup();
  }
  formGroup() {
    this.form = this.formBuilder.group({
      month: ['', Validators.required],
      year: ['', Validators.required],
      detail: ['', Validators.required]
    });
  }
  displayCreate() {

    this.isCreating = true;
  }

  onSubmit() {
    if (this.form.valid) {
      const initialDate = new Date(Date.now()).toUTCString();
      this.openLoadingDialog();
      this.incomeStatementService.selectIncomeStatement(this.idCompany, 'period', initialDate, initialDate, this.month, this.year)
        .subscribe((res: any) => {
          this.dialog.closeAll();
          this.profitOrLoss = res[res.length - 1].amount;
          this.openConfirmationCreate();
        });
    }
  }

  openConfirmationCreate(): void {
    const dialogRef = this.dialog.open(ConfirmationMessageComponent, {
      data: {
        'title': 'Crear Cierre mensual', 'description': '¿Deseas crear el cierre?',
        'body': 'La utilidad del periodo es de: ', 'number': this.profitOrLoss
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createClosing();
      }
    });
  }

  createClosing() {
    this.closing = {
      Details: this.detail,
      IdCompany: this.idCompany,
      Month: this.month,
      Year: this.year,
      ProfitOrLoss: this.profitOrLoss
    };
    this.isCreating = false;
    this.progressBar = true;
    this.monthlyClosingsService.createMonthlyClosing(this.closing).subscribe((res) => {
      this.getMonthlyClosings();
      this.inicialize();
      this.closing = {};
      this.month = null;
      this.year = null;
      this.detail = null;
      this.profitOrLoss = null;
      this.progressBar = false;
      this.openSnackBar('¡Cierre creado!');
    }, err => {
      this.openSnackBar('¡Error de servidor!');
      console.log(err);
    });
  }

  deleteMonthlyClosing(idMonthlyClosing) {

   this.openConfirmationMessageDelete(idMonthlyClosing);
  }

  cancelCreate() {
    this.isCreating = false;
    this.inicialize();
  }

  openLoadingDialog(): void {
    const dialogRef = this.dialog.open(LoadingDialogComponent, {
      disableClose: true,
      data: {
        'text': 'Calculando...'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }
  openConfirmationMessageDelete(idMonthlyClosing): void {
    const dialogRef = this.dialog.open(ConfirmationMessageComponent, {
      data: { 'title': 'Eliminar Cierre', 'description': '¿Deseas eliminar el cierre?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.progressBar = true;
        this.monthlyClosingsService.deleteMonthlyClosing(idMonthlyClosing).subscribe((res) => {
          this.getMonthlyClosings();
          this.openSnackBar('¡Cierre Eliminado!');
          this.progressBar = false;
        }, err => {
          this.openSnackBar('¡Error de servidor!');
          console.log(err);
        });
      }
    });
  }

  openSnackBar(message) {
    this.snackBar.openFromComponent(SnackBarSavedChangesComponent, {
      data: { message: message }, duration: 2000,
    });
  }
}
