import { Component, OnInit, DoCheck } from '@angular/core';
import { AccountingAccoutsService } from '../../services/accounting-accouts.service';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { MatSnackBar, MatDialog } from '@angular/material';
import { SnackBarSavedChangesComponent } from '../shared/snack-bar-saved-changes/snack-bar-saved-changes.component';
import { JournalSeatsService } from '../../services/journal-seats.service';
import { JournalMovementsService } from '../../services/journal-movements.service';
import { ConfirmationMessageComponent } from '../shared/confirmation-message/confirmation-message.component';
import { AccountAffectationsService } from '../../services/account-affectations.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css'],
  providers: [AccountingAccoutsService, JournalSeatsService, AccountAffectationsService]
})
export class ConfigurationComponent implements OnInit, DoCheck {

  displayedColumns: string[] = ['code', 'accountName', 'amount'];
  dataSource: any = [];
  public idCompany;
  public companyName;
  public openingSeatForm: FormGroup;
  public debitAmount: number = 0;
  public creditAmount: number = 0;
  public seat = {};
  public journalMovements = {};
  public accountAffectations = [];
  public progressBar;
  public objectSeat = {};
  public arraySeats = [];
  public existsOpeningSeat;
  public updatingOpeningSeat: boolean = false;
  public openingSeatjournalMovements: any = [];
  public creatingOpeningSeat;
  public labelExistsOpeningSeat: boolean = false;
  public labelCreateOpeningSeat: boolean = false;
  public idJournalSeat;
  public date;
  public spinner: boolean = true;
  public openingSeatBelongsToClosing: boolean;



  constructor(private accountAffectationsService: AccountAffectationsService,
    private accountingAccountsService: AccountingAccoutsService,
    private journalSeatsService: JournalSeatsService,
    private journalMovementsService: JournalMovementsService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    public dialog: MatDialog) {
    if (localStorage.getItem('step') === '1') {
      window.location.reload();
      localStorage.setItem('step', '2');
    }
    this.idCompany = localStorage.getItem('idCompany');
    this.companyName = localStorage.getItem('companyName');
    this.progressBar = false;
    this.existsOpeningSeat = false;
    this.creatingOpeningSeat = false;
    this.getOpeningJournalMovements();
  }

  ngOnInit() {
    this.selectAccountAffectations();
  }
  selectAccountAffectations() {
    this.accountAffectationsService.getAccountAffectations().subscribe((res: any) => {
      this.accountAffectations = res;
    });
  }
  getOpeningJournalMovements() {
    this.journalMovementsService.getOpeningSeatJournalMovements(this.idCompany).subscribe((res: any) => {
      this.openingSeatjournalMovements = res;
      console.log(this.openingSeatjournalMovements.length);
      this.spinner = false;
      if (res.length > 0) {
        localStorage.setItem('opseat', JSON.stringify(this.openingSeatjournalMovements));
        if(this.openingSeatjournalMovements[0].idMonthlyClosing !== null) {
              this.openingSeatBelongsToClosing = true;
        }
        this.date = this.openingSeatjournalMovements[0].date;
        console.log(this.openingSeatjournalMovements);
        this.updatingOpeningSeat = true;
        this.existsOpeningSeat = true;
        this.openingSeatjournalMovements = res;
        this.idJournalSeat = this.openingSeatjournalMovements[0].idJournalSeat;
        this.displayExistingSeatForm();
        this.labelExistsOpeningSeat = true;
        this.labelCreateOpeningSeat = false;
      } else {
        this.labelExistsOpeningSeat = false;
        this.labelCreateOpeningSeat = true;
        this.spinner = false;
      }
    });
  }

  displayCreateSeatForm() {
    this.spinner = true;
    this.existsOpeningSeat = true;
    this.creatingOpeningSeat = true;
    this.formOpeningSeat(this.dataSource);
    this.accountingAccountsService.getDefaultAccounts().subscribe((res: any) => {
      this.spinner = false;
      this.dataSource = res;
      this.formOpeningSeat(this.dataSource);
    });
  }

  displayExistingSeatForm() {
    this.formOpeningSeat(this.openingSeatjournalMovements);
    this.accountingAccountsService.getDefaultAccounts().subscribe((res: any) => {
      this.dataSource = res;
      this.formOpeningSeat(this.dataSource);
    });
  }

  formOpeningSeat(dataSource) {
    let arr = [];
    for (var i = 0; i < dataSource.length; i++) {
      arr.push(this.getJournalMovements(dataSource[i], this.openingSeatjournalMovements[i]));
    }
    this.openingSeatForm = this.formBuilder.group({
      date: new FormControl ({value: this.date, disabled: this.openingSeatBelongsToClosing}, [Validators.required]),
      journalMovements: this.formBuilder.array(arr)
    });
  }

  getJournalMovements(account, openingSeatJournalMovement): FormGroup {
    let totalAmount;

    if (this.creatingOpeningSeat) {
      totalAmount = '';
    } else {
      totalAmount = openingSeatJournalMovement.totalAmount;
    }


    if (this.updatingOpeningSeat) {
      return this.formBuilder.group({
        idJounalMovement: [openingSeatJournalMovement.idJounalMovement],
        idAccountingAccount: [account.idAccountingAccount],
        idAccountAffectation: [account.idAccountAffectation],
        code: [account.code],
        accountName: [account.accountName],
        totalAmount: new FormControl({value: totalAmount, disabled: this.openingSeatBelongsToClosing})
      });
    } else {
      return this.formBuilder.group({
        idAccountingAccount: [account.idAccountingAccount],
        idAccountAffectation: [account.idAccountAffectation],
        code: [account.code],
        accountName: [account.accountName],
        totalAmount: [totalAmount]
      });
    }


  }

  detectChanges() {
    const numAccounts = this.openingSeatForm.value.journalMovements.length;
    let accountAmount: number = 0;
    let idAccountAffectation = 0;
    const idDebitAccountAffectation = this.accountAffectations[this.accountAffectations.findIndex(res => res.name === 'Débito')].idAccountAffectation;
    const idCreditAccountAffectation = this.accountAffectations[this.accountAffectations.findIndex(res => res.name === 'Crédito')].idAccountAffectation;

    this.debitAmount = 0;
    this.creditAmount = 0;
    for (let i = 0; i < numAccounts; i++) {
      idAccountAffectation = this.openingSeatForm.value.journalMovements[i].idAccountAffectation;
      accountAmount = this.openingSeatForm.value.journalMovements[i].totalAmount;

      if (idAccountAffectation === idDebitAccountAffectation) {
        this.debitAmount = Number(this.debitAmount) + Number(accountAmount);
      } else if (idAccountAffectation === idCreditAccountAffectation) {
        this.creditAmount = Number(this.creditAmount) + Number(accountAmount);
      }
    }
  }

  ngDoCheck() {
    if (this.creatingOpeningSeat) {
      this.detectChanges();
    }
    if (this.existsOpeningSeat) {
      this.detectChanges();
    }
  }

  onSubmit() {

    if (this.openingSeatForm.valid) {
      const numAccounts = this.openingSeatForm.value.journalMovements.length;
      let totalAmount: number = 0;
      let accountAmount: number = 0;
      let idAccountAffectation: number = 0;
      let accountAmountForm: number = 0;
      this.debitAmount = 0;
      this.creditAmount = 0;
      this.arraySeats = [];

      for (let i = 0; i < numAccounts; i++) {

        if (this.openingSeatForm.value.journalMovements[i].totalAmount === null || this.openingSeatForm.value.journalMovements[i].totalAmount === '') {
          accountAmountForm = 0;
        } else {
          accountAmountForm = this.openingSeatForm.value.journalMovements[i].totalAmount;
        }
        if (this.updatingOpeningSeat) {
          this.objectSeat = {
            IdJounalMovement: this.openingSeatForm.value.journalMovements[i].idJounalMovement,
            TotalAmount: accountAmountForm
          };
        } else {

          this.objectSeat = {
            IdAccountingAccount: this.openingSeatForm.value.journalMovements[i].idAccountingAccount,
            IdAccountAffectation: this.openingSeatForm.value.journalMovements[i].idAccountAffectation,
            Date: this.date,
            TotalAmount: accountAmountForm,
            Description: 'Asiento de Apertura',
            IdOrigin: 1
          };
        }
        this.arraySeats.push(this.objectSeat);
      }

      for (let i = 0; i < numAccounts; i++) {
        idAccountAffectation = this.openingSeatForm.value.journalMovements[i].idAccountAffectation;
        accountAmount = this.openingSeatForm.value.journalMovements[i].totalAmount;

        if (idAccountAffectation === 1) {
          this.debitAmount = Number(this.debitAmount) + Number(accountAmount);
        } else if (idAccountAffectation === 2) {
          this.creditAmount = Number(this.creditAmount) + Number(accountAmount);
        }
      }

      if (this.debitAmount === this.creditAmount) {
        totalAmount = Number(this.debitAmount) + Number(this.creditAmount);

        this.openConfirmationMessage();

      } else {
        this.openSnackBar('¡Débitos y Créditos no son iguales!');
      }
    } else {
      this.openSnackBar('Por favor selecciona la fecha');
    }
  }

  createOpeningSeat(arraySeats) {
    this.progressBar = true;
    if (this.updatingOpeningSeat) {
      this.seat = {
        IdJournalSeat: this.idJournalSeat,
        Amount: this.debitAmount,
        Date: this.date,
        JournalMovements: arraySeats
      };
      console.log(this.seat);
      this.journalSeatsService.updateOpeningJournalSeat(this.seat).subscribe((response) => {
        this.progressBar = false;
        this.existsOpeningSeat = false;
        this.creatingOpeningSeat = false;
        this.getOpeningJournalMovements();
        this.openSnackBar('¡Asiento Actualizado!');
        this.progressBar = false;
      }, err => {
        this.openSnackBar('¡Error de servidor!');
        console.log(err);
      });
    } else {

      this.seat = {
        IdOrigin: 1,
        IdCompany: this.idCompany,
        Date: this.date,
        Description: 'Asiento de Apertura',
        Amount: this.debitAmount,
        JournalMovements: arraySeats
      };
      ;
      this.journalSeatsService.createJournalSeat(this.seat).subscribe((response) => {
        this.progressBar = false;
        this.existsOpeningSeat = false;
        this.creatingOpeningSeat = false;
        localStorage.setItem('openingSeat', 'true');
        this.getOpeningJournalMovements();
        localStorage.setItem('openingSeat', 'true');
        this.openSnackBar('¡Asiento Creado!');
        this.progressBar = false;
      }, err => {
        this.openSnackBar('¡Error de servidor!');
        console.log(err);
      });
    }
  }

  updateOpeningSeat() {
    this.progressBar = true;
  }

  openConfirmationMessage(): void {

    if (this.updatingOpeningSeat) {
      const dialogRef = this.dialog.open(ConfirmationMessageComponent, {
        data: { 'title': 'Editar asiento de apertura', 'description': '¿Deseas guardar los cambios?' }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.createOpeningSeat(this.arraySeats);
        }
      });
    } else {
      const dialogRef = this.dialog.open(ConfirmationMessageComponent, {
        data: { 'title': 'Crear asiento de apertura', 'description': '¿Deseas crear el asiento?' }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.createOpeningSeat(this.arraySeats);
        }
      });
    }
  }

  openSnackBar(message) {
    this.snackBar.openFromComponent(SnackBarSavedChangesComponent, {
      data: { message: message }, duration: 2000,
    });
  }

}
