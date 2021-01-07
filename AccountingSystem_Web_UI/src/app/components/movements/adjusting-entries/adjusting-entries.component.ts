import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { JournalSeatsService } from '../../../services/journal-seats.service';
import { FormControl, FormGroup, FormBuilder, FormArray, Validators, FormGroupDirective } from '@angular/forms';
import { AccountingAccoutsService } from '../../../services/accounting-accouts.service';
import { AccountAffectationsService } from '../../../services/account-affectations.service';
import { MatSnackBar, MatDialog, MatTableDataSource } from '@angular/material';
import { SnackBarSavedChangesComponent } from '../../shared/snack-bar-saved-changes/snack-bar-saved-changes.component';
import { ConfirmationMessageComponent } from '../../shared/confirmation-message/confirmation-message.component';
import { JournalMovementsService } from '../../../services/journal-movements.service';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'app-adjusting-entries',
  templateUrl: './adjusting-entries.component.html',
  styles: [],
  providers: [JournalSeatsService, AccountingAccoutsService]
})
export class AdjustingEntriesComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['seatNumber', 'origin', 'date', 'description', 'amount', 'icons'];
  public journalSeatsDataSource: any = [];
  @ViewChild(MatPaginator, { static: false })
  set paginator(value: MatPaginator) {
    if (this.journalSeatsDataSource) {
      this.journalSeatsDataSource.paginator = value;
    }
  }
  @ViewChild(MatSort, { static: false })
  set sort(value: MatSort) {
    if (this.journalSeatsDataSource) {
      this.journalSeatsDataSource.sort = value;
    }
  }

  public titleCreateEdit: string;
  public companyName;
  public movementsForm: FormGroup;
  public seatForm: FormGroup;
  public journalMovementsBySeat: {};
  public viewSeats: boolean = false;
  public creatingSeat: boolean = false;
  public viewDetails: boolean = false;
  public accountAffectation;
  public accountingAccounts;
  public accountId;
  public accountAffectationId;
  public movementAmount;
  public movementDescription;
  public seatDescription: string;
  public seatDate: Date;
  public debitAmount: number = 0;
  public creditAmount: number = 0;
  public tableRows: Array<{
    idAccount: number, account: string, idAffectation: number, affectation: string, amount: number,
    description: string
  }> = [];
  public seat = {};
  public idCompany;
  public date;
  public journalMovementsArray = [];
  public journalMovementObject = {};
  public progressBar: boolean;
  public updatingSeat: boolean = false;
  public idJournalSeat;
  public seatElement;
  public spinner: boolean = true;


  constructor(public dialog: MatDialog, private snackBar: MatSnackBar,
    private router: Router,
    private formBuilder: FormBuilder, private journalSeatsService: JournalSeatsService,
    private journalMovementsService: JournalMovementsService,
    private accountAffectationsService: AccountAffectationsService,
    private accountingAccountsService: AccountingAccoutsService) {
  }
  ngAfterViewInit() {
    this.journalSeatsDataSource.paginator = this.paginator;
    this.journalSeatsDataSource.sort = this.sort;
  }

  ngOnInit() {
    this.companyName = localStorage.getItem('companyName');
    this.idCompany = localStorage.getItem('idCompany');
    this.progressBar = false;
    this.seat = {};
    this.journalMovementObject = {};
    this.journalMovementsArray = [];
    this.getJournalSeats();
    this.chargeAccountAffectationsDropdown();

    this.accountingAccountsService.selectAllAccountingAccounts().subscribe((res: any) => {
      this.accountingAccounts = res;
    });
    this.formSeat();
    this.formMovements();
  }
  getJournalSeats() {
    this.spinner = true;
    this.journalSeatsService.selectJournalSeats().subscribe((res: any) => {
      this.journalSeatsDataSource = new MatTableDataSource(res);
      this.spinner = false;
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.journalSeatsDataSource.filter = filterValue.trim().toLowerCase();
  }
  formSeat() {
    this.seatForm = this.formBuilder.group({
      seatDate: ['', Validators.required],
      seatDescription: ['', Validators.required]
    });
  }
  formMovements() {
    this.movementsForm = this.formBuilder.group({
      accountId: ['', Validators.required],
      accountAffectationId: ['', Validators.required],
      movementAmount: ['', Validators.required],
      movementDescription: ['']
    });
  }
  inicializePage() {
    this.tableRows = [];
    this.accountId = null;
    this.accountAffectationId = null;
    this.movementAmount = null;
    this.movementDescription = null;
    this.seatDescription = null;
    this.seatDate = null;
    this.formSeat();
    this.formMovements();
    this.debitAmount = 0;
    this.creditAmount = 0;
    this.seat = {};
    this.journalMovementObject = {};
    this.journalMovementsArray = [];
  }
  chargeAccountAffectationsDropdown() {
    this.accountAffectationsService.getAccountAffectations().subscribe((res: any) => {
      this.accountAffectation = res;
    });
  }
  getJournalMovements(seat) {
    this.titleCreateEdit = 'Editar Asiento Contable';
    if (seat.originName === 'Asiento de apertura') {
      this.router.navigate(['configuracion/asiento-apertura']);
    }
    this.seatDate = seat.date;
    this.idJournalSeat = seat.idJournalSeat;
    this.seatDescription = seat.description;
    this.journalMovementsService.getJournalMovements(seat.idJournalSeat).subscribe((res: any) => {

      const x = [];

      for (let i = 0; i < res.length; i++) {
        const accountIndex = this.accountingAccounts.findIndex(account => account.idAccountingAccount === res[i].idAccountingAccount);
        const accountAffectationIndex = this.accountAffectation.findIndex(affectation =>
          affectation.idAccountAffectation === res[i].idAccountAffectation);
        this.journalMovementsBySeat = {
          idAccount: res[i].idAccountingAccount,
          account: this.accountingAccounts[accountIndex].accountName,
          idAffectation: res[i].idAccountAffectation,
          affectation: this.accountAffectation[accountAffectationIndex].name,
          amount: res[i].totalAmount,
          description: res[i].description
        };
        x.push(this.journalMovementsBySeat);
        this.tableRows = x;

      }
      this.detectChanges();

      this.viewSeats = false;
      this.creatingSeat = true;
    });
  }
  displaySeats() {
    this.inicializePage();
    this.viewDetails = false;
    this.viewSeats = true;
    this.creatingSeat = false;
    this.spinner = false;
  }
  displayCreateSeatPage() {
    this.viewDetails = false;
    this.inicializePage();
    this.creatingSeat = true;
    this.viewSeats = false;
    this.titleCreateEdit = 'Crear Asiento Contable';
  }
  addTableRow(data, formDirective: FormGroupDirective) {

    if (this.movementsForm.valid) {
      const accountIndex = this.accountingAccounts.findIndex(account => account.idAccountingAccount === this.accountId);
      const accountAffectationIndex = this.accountAffectation.findIndex(affectation =>
        affectation.idAccountAffectation === this.accountAffectationId);

      this.tableRows.push({
        idAccount: this.accountId, account: this.accountingAccounts[accountIndex].accountName,
        idAffectation: this.accountAffectationId, affectation: this.accountAffectation[accountAffectationIndex].name,
        amount: this.movementAmount, description: this.movementDescription
      });

      this.detectChanges();
      this.movementsForm.reset();
      formDirective.resetForm();

    }
  }
  deleteTableRow(indexRow) {
    this.tableRows.splice(indexRow, 1);
    this.detectChanges();
  }
  detectChanges() {
    this.debitAmount = 0;
    this.creditAmount = 0;
    for (let i = 0; i < this.tableRows.length; i++) {
      if (this.tableRows[i].affectation === 'Débito') {
        this.debitAmount = Number(this.debitAmount) + Number(this.tableRows[i].amount);
      } else {
        this.creditAmount = Number(this.creditAmount) + Number(this.tableRows[i].amount);
      }
    }
  }
  onSubmit() {

    if (this.seatForm.valid) {
      if (this.tableRows.length > 0) {
        if (this.debitAmount === this.creditAmount) {
          // data is valid
          this.openConfirmationMessage();

        } else {
          this.openSnackBar('¡Débitos y Créditos no son iguales!');
        }
      } else {
        this.openSnackBar('¡No existen movimientos!');
      }

    }

  }
  createSeat() {
    if (this.titleCreateEdit === 'Crear Asiento Contable') {
      this.formSeat();
      this.formMovements();
    }
    this.seat = {};
    this.journalMovementObject = {};
    this.journalMovementsArray = [];
    this.progressBar = true;
    const today = this.seatDate;
    const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    this.date = (today.getMonth() + 1) + '-' + today.getDate() + '-' + today.getFullYear() + ' ' + time;
    for (let i = 0; i < this.tableRows.length; i++) {
      this.journalMovementObject = {
        IdAccountingAccount: this.tableRows[i].idAccount,
        IdAccountAffectation: this.tableRows[i].idAffectation,
        Date: this.date,
        TotalAmount: this.tableRows[i].amount,
        Description: this.tableRows[i].description,
        IdOrigin: 4
      };
      this.journalMovementsArray.push(this.journalMovementObject);
    }

    this.seat = {
      IdOrigin: 4,
      IdCompany: this.idCompany,
      Date: this.date,
      Description: this.seatDescription,
      Amount: this.debitAmount,
      JournalMovements: this.journalMovementsArray
    };
    console.log(this.seat);
    this.journalSeatsService.createJournalSeat(this.seat).subscribe((response) => {
      this.seat = {};
      this.progressBar = false;
      this.openSnackBar('¡Asiento Creado!');
      this.creatingSeat = false;
      this.viewSeats = true;
      this.progressBar = false;
      this.getJournalSeats();
    }, err => {
      this.openSnackBar('¡Error de servidor!');
      console.log(err);
    });
  }
  updateSeat() {
    this.seat = {};
    this.journalMovementObject = {};
    this.journalMovementsArray = [];
    this.progressBar = true;
    this.date = this.seatDate;
    console.log(this.date);
    for (let i = 0; i < this.tableRows.length; i++) {
      this.journalMovementObject = {
        IdAccountingAccount: this.tableRows[i].idAccount,
        IdAccountAffectation: this.tableRows[i].idAffectation,
        Date: this.date,
        TotalAmount: this.tableRows[i].amount,
        Description: this.tableRows[i].description,
        IdOrigin: 4
      };
      this.journalMovementsArray.push(this.journalMovementObject);
    }

    this.seat = {
      IdJournalSeat: this.idJournalSeat,
      IdOrigin: 4,
      IdCompany: this.idCompany,
      Date: this.date,
      Description: this.seatDescription,
      Amount: this.debitAmount,
      JournalMovements: this.journalMovementsArray
    };
    console.log(this.seat);
    this.journalSeatsService.updateJournalSeat(this.seat).subscribe((response) => {
      this.getJournalSeats();
      this.progressBar = false;
      this.openSnackBar('¡Asiento Actualizado!');
      this.creatingSeat = false;
      this.viewSeats = true;
      this.progressBar = false;
    }, err => {
      this.openSnackBar('¡Error de servidor!');
      console.log(err);
    });
  }
  deleteJournalSeat(idJournalSeat) {
    const dialogRef = this.dialog.open(ConfirmationMessageComponent, {
      data: { 'title': 'Eliminar Asiento', 'description': '¿Deseas eliminar el asiento?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.progressBar = true;
        this.journalSeatsService.deleteJournalSeat(idJournalSeat).subscribe((response) => {
          this.getJournalSeats();
          this.openSnackBar('¡Asiento Eliminado!');
          this.progressBar = false;
        }, err => {
          this.openSnackBar('¡Error de servidor!');
          console.log(err);
        });
      }
    });
  }
  openConfirmationMessage(): void {
    if (this.titleCreateEdit === 'Editar Asiento Contable') {
      const dialogRef = this.dialog.open(ConfirmationMessageComponent, {
        data: { 'title': 'Editar Asiento', 'description': '¿Deseas editar el asiento?' }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.updateSeat();
        }
      });
    } else {
      const dialogRef = this.dialog.open(ConfirmationMessageComponent, {
        data: { 'title': 'Crear Asiento', 'description': '¿Deseas crear el asiento?' }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.createSeat();
        }
      });
    }
  }
  viewSeatDetails(element) {
    this.viewSeats = false;
    this.viewDetails = true;
    this.seatElement = element;
  }
  openSnackBar(message) {
    this.snackBar.openFromComponent(SnackBarSavedChangesComponent, {
      data: { message: message }, duration: 2000,
    });
  }
}
