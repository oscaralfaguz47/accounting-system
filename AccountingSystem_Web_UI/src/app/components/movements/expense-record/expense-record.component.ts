import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { ExpensesService } from '../../../services/expenses.service';
import { D151Service } from 'src/app/services/d151.service';
import { ProvidersService } from '../../../services/providers.service';
import { MovementTypesService } from 'src/app/services/movement-types.service';
import { AccountingAccoutsService } from 'src/app/services/accounting-accouts.service';
import { AccountAffectationsService } from 'src/app/services/account-affectations.service';
import { JournalMovementsService } from 'src/app/services/journal-movements.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar, MatDialog, MatTableDataSource } from '@angular/material';
import { ConfirmationMessageComponent } from '../../shared/confirmation-message/confirmation-message.component';
import { SnackBarSavedChangesComponent } from '../../shared/snack-bar-saved-changes/snack-bar-saved-changes.component';
import { AlertMessageComponent } from '../../shared/alert-message/alert-message.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-expense-record',
  templateUrl: './expense-record.component.html',
  styles: [],
  providers: [ExpensesService, D151Service, ProvidersService, MovementTypesService, AccountingAccoutsService,
    AccountAffectationsService, JournalMovementsService]
})
export class ExpenseRecordComponent implements OnInit {

  //Table
  displayedColumns: string[] = ['voucher', 'providerName', 'accountName', 'date', 'totalAmount', 'details', 'd151Name', 'movementTypeName', 'icons'];
  expensesDataSource: any = [];
  public data = [];

  test: boolean;
  public title: string;
  public idCompany;
  public progressBar: boolean = false;
  public companyName: string;
  public isCreatingExpense: boolean = false;
  public isEditingExpense: boolean = false;
  public expensesForm: FormGroup;
  public expensesAccountingAccounts = [];
  public d151Options = {};
  public providersList = [];
  public movementTypes = [];
  public indexDebitMovementType: number;
  public indexCreditMovementType: number;
  public dataToSend = {};
  public allAccounts = [];
  public affectations = [];
  public JournalMovements = [];
  public firstJournalMovement = {};
  public secondJournalMovement = {};
  public ivaJournalMovement = {};
  public registrationDate;
  public expenseType: number;
  public d151Option: number;
  public condition: number;
  public invoiceNumber: string;
  public providerId: number;
  public invoiceDetail: string;
  public invoiceAmount: number;
  public invoiceIva: number;
  public creditAccountId: number;
  public creditDays: number = 10;
  public enabledDebitAccount: boolean = false;
  public banksIndex;
  public accountsReceivableIndex;
  public ivaFiscalCreditIndex;
  public debitAffectationIndex: number;
  public creditAffectationIndex: number;
  public idExpense;
  public spinner: boolean = true;
  public isCreditExpense: boolean;
  numberOfRegisters: number;
  paginationFirstNumber: number;
  paginationSecondNumber: number;
  defaultNumRegistersPerPage: number;
  skipNumber: number;
  filterInput: string = '';
  loadData: boolean;

  constructor(private router: Router, private journalMovementsService: JournalMovementsService,
    private accountAffectationsService: AccountAffectationsService,
    private snackBar: MatSnackBar,
    private accountingAccountService: AccountingAccoutsService,
    private movementTypesService: MovementTypesService, private providersService: ProvidersService,
    private d151Service: D151Service, private accountingAccountsService: AccountingAccoutsService,
    private expensesService: ExpensesService, public dialog: MatDialog, private formBuilder: FormBuilder) { }

  ngOnInit() {

    this.expensesFormGroup();
    this.idCompany = localStorage.getItem('idCompany');
    this.companyName = localStorage.getItem('companyName');
    this.invoiceIva = 0;
    this.invoiceNumber = '';
    this.invoiceDetail = '';
    this.getNumberOfRegisters('');
    this.skipNumber = 0;
    this.defaultNumRegistersPerPage = 20;
    this.getExpenses(this.skipNumber, this.defaultNumRegistersPerPage, '');
    this.selectMovementTypes();
    this.selectAllAccounts();
    this.selectExpensesAccountingAccount();
    this.selectD151Options();
    this.selectProviders();
    this.selectAccountAffectations();
  }

  getNumberOfRegisters(criteria) {
    this.expensesService.selectNumberOfRegisters(criteria).subscribe((res: any) => {
      console.log(res);
      this.numberOfRegisters = null;
      this.numberOfRegisters = res;
      this.initializePaginator();
    });
  }
  initializePaginator() {
    this.paginationFirstNumber = 1;
    if (this.numberOfRegisters / this.defaultNumRegistersPerPage < 1) {
      this.paginationSecondNumber = this.numberOfRegisters;
    } else {
      this.paginationSecondNumber = this.defaultNumRegistersPerPage;
      if (this.numberOfRegisters % this.defaultNumRegistersPerPage === 0) {
      }
    }
  }
  getExpenses(skipNumber, numberRegisters, criteria) {
    this.expensesService.selectExpenses(skipNumber, numberRegisters, criteria).subscribe((res: any) => {
      this.data = res;
      this.expensesDataSource = res;
      this.spinner = false;
      this.progressBar = false;
      this.loadData = true;
    });
  }

  inicialize() {
    this.invoiceIva = 0;
    this.invoiceNumber = null;
    this.invoiceDetail = null;
    this.registrationDate = null;
    this.expenseType = null;
    this.d151Option = null;
    this.condition = null;
    this.invoiceNumber = null;
    this.providerId = null;
    this.invoiceDetail = null;
    this.invoiceAmount = null;
    this.invoiceIva = null;
    this.selectAllAccounts();
    this.expensesFormGroup();
  }
  selectExpensesAccountingAccount() {
    this.accountingAccountsService.selectExpensesAccountingAccounts().subscribe((res: any) => {
      this.expensesAccountingAccounts = res;
    });
  }
  validateExistsExpensesAccounts() {
    if (this.expensesAccountingAccounts.length === 0) {
      this.openAlertMessage('No tienes cuentas de gastos agregados, por favor agrega las cuentas que necesites.',
        'Ok, ir a crear', 'mantenimiento/cuentas-contables');
    }
  }
  selectD151Options() {
    this.d151Service.selectD151OptionsExpenses().subscribe((res: any) => {
      this.d151Options = res;
    });
  }
  selectProviders() {
    this.providersService.getProvidersList(this.idCompany).subscribe((res: any) => {
      this.providersList = res;
    });
  }
  validateExistsProviders() {
    if (this.providersList.length === 0) {
      this.openAlertMessage('No tienes proveedores agregados, por favor agrega los proveedores que necesites.',
        'Ok, ir a crear', 'mantenimiento/proveedores');
    }
  }
  selectMovementTypes() {
    this.movementTypesService.selectMovementTypes().subscribe((res: any) => {
      this.movementTypes = res;
      this.indexDebitMovementType = this.movementTypes.findIndex(res => res.name === 'Contado');
      this.indexCreditMovementType = this.movementTypes.findIndex(res => res.name === 'Crédito');
    });
  }
  selectAllAccounts() {
    this.accountingAccountService.selectAllAccountingAccounts().subscribe((res: any) => {
      this.allAccounts = res;
      this.banksIndex = this.allAccounts.findIndex(account => account.code === '1.1.2');
      this.accountsReceivableIndex = this.allAccounts.findIndex(account => account.code === '2.1.1');
      this.ivaFiscalCreditIndex = this.allAccounts.findIndex(account => account.code === '1.1.6');
      this.creditAccountId = this.allAccounts[this.banksIndex].idAccountingAccount;
    });
  }
  selectAccountAffectations() {
    this.accountAffectationsService.getAccountAffectations().subscribe((res: any) => {
      this.affectations = res;
      this.debitAffectationIndex = this.affectations.findIndex(a => a.name === 'Débito');
      this.creditAffectationIndex = this.affectations.findIndex(a => a.name === 'Crédito');
    });
  }
  expensesFormGroup() {
    this.expensesForm = this.formBuilder.group({
      idAccountingAccount: [this.expenseType, Validators.required],
      voucher: [this.invoiceNumber],
      registrationDate: [this.registrationDate, Validators.required],
      idProvider: [this.providerId, Validators.required],
      details: [this.invoiceDetail],
      iva: [this.invoiceIva],
      totaAmount: [this.invoiceAmount, Validators.required],
      idD151: [this.invoiceIva, Validators.required],
      idMovementType: [this.condition, Validators.required],
      creditAccount: [this.creditAccountId, Validators.required],
      creditDays: []
    });
  }
  enableDebitAccount() {
    if (this.enabledDebitAccount === false) {
      this.enabledDebitAccount = true;
    } else {
      this.enabledDebitAccount = false;
    }
  }
  changeDebitAccountToCash(condition) {
    this.condition = condition;
    this.isCreditExpense = false;
    const banksId = this.allAccounts[this.banksIndex].idAccountingAccount;
    const accountsReceivable = this.allAccounts[this.accountsReceivableIndex].idAccountingAccount;
    if (this.creditAccountId === banksId || this.creditAccountId === accountsReceivable) {
      this.creditAccountId = this.allAccounts[this.banksIndex].idAccountingAccount;
    }
  }
  changeDebitAccountToCredit(condition) {
    this.condition = condition;
    this.isCreditExpense = true;
    const banksId = this.allAccounts[this.banksIndex].idAccountingAccount;
    const accountsReceivable = this.allAccounts[this.accountsReceivableIndex].idAccountingAccount;
    if (this.creditAccountId === banksId || this.creditAccountId === accountsReceivable) {
      this.creditAccountId = this.allAccounts[this.accountsReceivableIndex].idAccountingAccount;
    }
  }
  onSubmit() {

    if (this.expensesForm.valid) {
      this.progressBar = true;
      if (!this.isEditingExpense) {
        this.createExpense();
      } else {
        this.editExpense();
      }
    }
  }
  displayCreateExpense() {
    this.title = 'Ingresar nuevo gasto';
    this.condition = this.movementTypes[this.movementTypes.findIndex(res => res.name === 'Contado')].idMovementType;
    this.selectAccountAffectations();
    this.isCreatingExpense = true;
  }
  generateDataToSend() {
    this.firstJournalMovement = {
      IdAccountingAccount: this.creditAccountId,
      IdAccountAffectation: this.affectations[this.creditAffectationIndex].idAccountAffectation,
      TotalAmount: this.invoiceAmount
    };
    this.JournalMovements.push(this.firstJournalMovement);

    if (this.invoiceIva > 0) {
      this.ivaJournalMovement = {
        IdAccountingAccount: this.allAccounts[this.ivaFiscalCreditIndex].idAccountingAccount,
        IdAccountAffectation: this.affectations[this.debitAffectationIndex].idAccountAffectation,
        TotalAmount: this.invoiceIva,
      };
      this.JournalMovements.push(this.ivaJournalMovement);

      this.secondJournalMovement = {
        IdAccountingAccount: this.expenseType,
        IdAccountAffectation: this.affectations[this.debitAffectationIndex].idAccountAffectation,
        TotalAmount: Number(this.invoiceAmount) - Number(this.invoiceIva)
      };
      this.JournalMovements.push(this.secondJournalMovement);

    } else {

      this.secondJournalMovement = {
        IdAccountingAccount: this.expenseType,
        IdAccountAffectation: this.affectations[this.debitAffectationIndex].idAccountAffectation,
        TotalAmount: this.invoiceAmount
      };
      this.JournalMovements.push(this.secondJournalMovement);
    }
    if (this.invoiceIva === null) {
      this.invoiceIva = 0;
    }
    if (!this.isEditingExpense) {
      this.dataToSend = {
        IdCompany: this.idCompany,
        RegistrationDate: this.registrationDate,
        TotalAmount: this.invoiceAmount,
        IdAccountingAccount: this.expenseType,
        Voucher: this.invoiceNumber,
        IdProvider: this.providerId,
        Details: this.invoiceDetail,
        IVA: this.invoiceIva,
        IdD151: this.d151Option,
        IdMovementType: this.condition,
        CreditDays : this.creditDays,
        JournalMovements: this.JournalMovements
      }
    } else {
      this.dataToSend = {
        IdExpense: this.idExpense,
        RegistrationDate: this.registrationDate,
        TotalAmount: this.invoiceAmount,
        IdAccountingAccount: this.expenseType,
        Voucher: this.invoiceNumber,
        IdProvider: this.providerId,
        Details: this.invoiceDetail,
        IVA: this.invoiceIva,
        IdD151: this.d151Option,
        IdMovementType: this.condition,
        CreditDays : this.creditDays,
        JournalMovements: this.JournalMovements
      };

    }
  }
  createExpense() {
    const today = this.registrationDate;
    const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    this.registrationDate = (today.getMonth() + 1) + '-' + today.getDate() + '-' + today.getFullYear() + ' ' + time;
    this.generateDataToSend();
    this.expensesService.createExpense(this.dataToSend).subscribe((response) => {
      this.isCreatingExpense = false;
      this.inicialize();
      this.filterAccountsPayable();
      this.dataToSend = {};
      this.JournalMovements = [];
      this.progressBar = false;
      this.openSnackBar('¡Gasto Registrado!');
      this.progressBar = false;
    }, err => {
      this.openSnackBar('¡Error de servidor!');
      console.log(err);
    });
  }
  cancelCreateExpense() {
    this.progressBar = true;
    this.isCreatingExpense = false;
    this.inicialize();
    this.getExpenses(this.skipNumber, this.defaultNumRegistersPerPage, '');
  }

  editExpense() {
    this.generateDataToSend();
    this.expensesService.editExpense(this.dataToSend).subscribe((response) => {
      this.isEditingExpense = false;
      this.isCreatingExpense = false;
      this.inicialize();
      this.filterAccountsPayable();
      this.dataToSend = {};
      this.JournalMovements = [];
      this.progressBar = false;
      this.openSnackBar('¡Gasto Actualizado!');
      this.progressBar = false;
    }, err => {
      this.openSnackBar('¡Error de servidor!');
      console.log(err);
    });
  }
  displayeEditPage(element) {
    this.title = 'Editar gasto';
    let idCreditAccount;
    this.idExpense = element.idExpense;
    this.condition = element.idMovementType;
    this.journalMovementsService.getJournalMovements(element.idJournalSeat).subscribe((res: any) => {
      idCreditAccount = res[res.findIndex(resp => resp.idAccountAffectation === this.affectations[this.creditAffectationIndex].idAccountAffectation)].idAccountingAccount;
      this.registrationDate = element.registrationDate;
      this.expenseType = element.idAccountingAccount;
      this.d151Option = element.idD151;
      this.creditAccountId = idCreditAccount;
      this.invoiceNumber = element.voucher;
      this.providerId = element.idProvider;
      this.invoiceDetail = element.details;
      this.invoiceAmount = element.totalAmount;
      this.invoiceIva = element.iva;
      this.isCreatingExpense = true;
      this.isEditingExpense = true;
    });

  }
  deleteExpense(idExpense) {
    this.openConfirmationMessage(idExpense);
  }
  openConfirmationMessage(idExpense): void {
    const dialogRef = this.dialog.open(ConfirmationMessageComponent, {
      data: { 'title': 'Eliminar Gasto', 'description': '¿Deseas eliminar el gasto?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.expensesService.deleteExpense(idExpense).subscribe((response) => {
          this.getExpenses(this.skipNumber, this.defaultNumRegistersPerPage, '');
          this.openSnackBar('¡Gasto eliminado!');
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
  openAlertMessage(description, buttonText, url): void {
    const dialogRef = this.dialog.open(AlertMessageComponent, {
      data: { 'description': description, 'buttonText': buttonText }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.router.navigate([url]);
      }
    });
  }
  filterAccountsPayable() {
    this.skipNumber = 0;
    this.spinner = true;
    this.loadData = false;
    if (this.filterInput.trim() === '') {
      this.changeItemPerPage();
    } else {
      this.getNumberOfRegisters(this.filterInput.trim());
      this.getExpenses(0, this.defaultNumRegistersPerPage, this.filterInput.trim());
    }
  }
  changeItemPerPage() {
    this.loadData = false;
      this.spinner = true;
    if (this.filterInput.trim() === '' || this.filterInput.trim() === undefined) {
      this.getNumberOfRegisters('');
    this.skipNumber = 0;
      this.getExpenses(this.skipNumber, this.defaultNumRegistersPerPage, '');
    } else {
      this.getNumberOfRegisters(this.filterInput.trim());
    this.skipNumber = 0;
      this.getExpenses(this.skipNumber, this.defaultNumRegistersPerPage, this.filterInput);
    }
  }
  pagination(button) {
    this.spinner = true;
    this.loadData = false;
    if (button === 'left') {
      if (this.numberOfRegisters % this.defaultNumRegistersPerPage === 0) {
        this.paginationFirstNumber = Number(this.paginationFirstNumber) - Number(this.defaultNumRegistersPerPage);
        this.paginationSecondNumber = Number(this.paginationSecondNumber) - Number(this.defaultNumRegistersPerPage);
      } else {
        if (this.paginationSecondNumber === this.numberOfRegisters) {
          this.paginationSecondNumber = Number(this.paginationFirstNumber) - 1;
          this.paginationFirstNumber = Number(this.paginationFirstNumber) - Number(this.defaultNumRegistersPerPage);
        } else {
          this.paginationFirstNumber = Number(this.paginationFirstNumber) - Number(this.defaultNumRegistersPerPage);
          this.paginationSecondNumber = Number(this.paginationSecondNumber) - Number(this.defaultNumRegistersPerPage);
        }
      }
      this.skipNumber = Number(this.skipNumber) - Number(this.defaultNumRegistersPerPage);
      if (this.filterInput === '' || this.filterInput === undefined) {
        this.getExpenses(this.skipNumber, this.defaultNumRegistersPerPage, '');
      } else {
        this.getExpenses(this.skipNumber, this.defaultNumRegistersPerPage, this.filterInput);
      }

    } else {
      if (this.numberOfRegisters % this.defaultNumRegistersPerPage === 0) {
        this.paginationFirstNumber = Number(this.paginationFirstNumber) + Number(this.defaultNumRegistersPerPage);
        this.paginationSecondNumber = Number(this.paginationSecondNumber) + Number(this.defaultNumRegistersPerPage);
      } else {
        if ((this.numberOfRegisters - this.paginationSecondNumber) >= (this.defaultNumRegistersPerPage)) {
          this.paginationFirstNumber = Number(this.paginationFirstNumber) + Number(this.defaultNumRegistersPerPage);
          this.paginationSecondNumber = Number(this.paginationSecondNumber) + Number(this.defaultNumRegistersPerPage);
        } else {
          this.paginationFirstNumber = Number(this.paginationFirstNumber) + Number(this.defaultNumRegistersPerPage);
          this.paginationSecondNumber = this.numberOfRegisters;
        }
      }
      this.skipNumber = Number(this.skipNumber) + Number(this.defaultNumRegistersPerPage);
      if (this.filterInput === '' || this.filterInput === undefined) {
        this.getExpenses(this.skipNumber, this.defaultNumRegistersPerPage, '');
      } else {
        this.getExpenses(this.skipNumber, this.defaultNumRegistersPerPage, this.filterInput);
      }
    }
  }
}
