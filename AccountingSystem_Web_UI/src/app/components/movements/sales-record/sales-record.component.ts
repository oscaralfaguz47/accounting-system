import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationMessageComponent } from '../../shared/confirmation-message/confirmation-message.component';
import { IncomesService } from '../../../services/incomes.service';
import { MatDialog, MatSnackBar, MatTableDataSource } from '@angular/material';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AccountingAccoutsService } from '../../../services/accounting-accouts.service';
import { D151Service } from '../../../services/d151.service';
import { CustomerService } from '../../../services/customers.service';
import { MovementTypesService } from '../../../services/movement-types.service';
import { AccountAffectationsService } from '../../../services/account-affectations.service';
import { SnackBarSavedChangesComponent } from '../../shared/snack-bar-saved-changes/snack-bar-saved-changes.component';
import { JournalMovementsService } from '../../../services/journal-movements.service';
import { AlertMessageComponent } from '../../shared/alert-message/alert-message.component';
import { Router } from '@angular/router';
import { DataGlobalService } from '../../../services/data-global.service';


declare var myExtObject: any;


@Component({
  selector: 'app-sales-record',
  templateUrl: './sales-record.component.html',
  styles: [],
  providers: [IncomesService, D151Service, CustomerService, MovementTypesService, AccountingAccoutsService, DataGlobalService,
    AccountAffectationsService, JournalMovementsService]
})
export class SalesRecordComponent implements OnInit, AfterViewInit {

  // Table

  displayedColumns: string[] = ['voucher', 'customerName', 'accountName', 'date', 'totalAmount', 'd151Name', 'movementTypeName', 'icons'];
  salesDataSource: any = [];
  public data = [];

  @ViewChild(MatPaginator, {static: false})
  set paginator(value: MatPaginator) {
    if (this.salesDataSource){
      this.salesDataSource.paginator = value;
    }
  }
  @ViewChild(MatSort, {static: false})
  set sort(value: MatSort) {
    if (this.salesDataSource){
      this.salesDataSource.sort = value;
    }
  }

  public idCompany;
  public title: string;
  public progressBar: boolean = false;
  public companyName: string;
  public isCreatingSale: boolean = false;
  public isEditingSale: boolean = false;
  public salesForm: FormGroup;
  public incomesAccountingAccounts = [];
  public d151Options = {};
  public customersList = [];
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
  public incomeType: number;
  public d151Option: number;
  public condition: number;
  public invoiceNumber: string;
  public customerId: number;
  public invoiceDetail: string;
  public invoiceAmount: number;
  public invoiceIva: number;
  public debitAccountId: number;
  public enabledDebitAccount: boolean = false;
  public banksIndex;
  public accountsReceivableIndex;
  public ivaFiscalDebitIndex;
  public debitAffectationIndex: number;
  public creditAffectationIndex: number;
  public idIncome;
  public spinner: boolean = true;

  constructor(private dataGlobaService: DataGlobalService, private router: Router, private journalMovementsService: JournalMovementsService,
    private accountAffectationsService: AccountAffectationsService,
    private snackBar: MatSnackBar,
    private accountingAccountService: AccountingAccoutsService,
    private movementTypesService: MovementTypesService, private customersService: CustomerService,
    private d151Service: D151Service, private accountingAccountsService: AccountingAccoutsService,
    private incomesService: IncomesService, public dialog: MatDialog, private formBuilder: FormBuilder) {
  }
  ngAfterViewInit() {
    this.salesDataSource.paginator = this.paginator;
    this.salesDataSource.sort = this.sort;
  }

  ngOnInit() {
    this.salesFormGroup();
    this.idCompany = localStorage.getItem('idCompany');
    this.companyName = localStorage.getItem('companyName');
    this.invoiceIva = 0;
    this.invoiceNumber = '';
    this.invoiceDetail = '';
    this.getIncomes();
    this.selectMovementTypes();
    this.selectAllAccounts();
    this.selectIncomesAccountingAccount();
    this.selectD151Options();
    this.selectCustomers();
    this.selectAccountAffectations();

  }
  getIncomes() {
    this.incomesService.SelectIncomes().subscribe((res: any) => {
      this.data = res;
      this.salesDataSource = new MatTableDataSource(res);
      this.spinner = false;
      this.progressBar = false;
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.salesDataSource.filter = filterValue.trim().toLowerCase();
    if (this.salesDataSource.paginator) {
      this.salesDataSource.paginator.firstPage();
    }
  }
  exportExcelFile(): void {
    this.dataGlobaService.exportToExcel(this.salesDataSource.filteredData, 'Ventas');
  }
  exportPdfFile(): void {
    myExtObject.exportPdfFile('table-data', 'REPORTE DE VENTAS', this.salesDataSource.filteredData);

  }
  inicialize() {
    this.invoiceIva = 0;
    this.invoiceNumber = null;
    this.invoiceDetail = null;
    this.registrationDate = null;
    this.incomeType = null;
    this.d151Option = null;
    this.condition = null;
    this.invoiceNumber = null;
    this.customerId = null;
    this.invoiceDetail = null;
    this.invoiceAmount = null;
    this.invoiceIva = null;
    this.firstJournalMovement = {};
    this.secondJournalMovement = {};
    this.selectAllAccounts();
    this.salesFormGroup();
  }
  selectIncomesAccountingAccount() {
    this.accountingAccountsService.selectIncomesAccountingAccounts().subscribe((res: any) => {
      this.incomesAccountingAccounts = res;
    });
  }
  validateExistsIncomesAccounts() {
    if (this.incomesAccountingAccounts.length === 0) {
      this.openAlertMessage('No tienes cuentas de ingresos agregados, por favor agrega las cuentas que necesites.',
        'Ok, ir a crear', 'mantenimiento/cuentas-contables');
    }
  }
  selectD151Options() {
    this.d151Service.selectD151OptionsIncomes().subscribe((res: any) => {
      this.d151Options = res;
      console.log(res);
    });
  }
  selectCustomers() {
    this.customersService.getCustomersList(this.idCompany).subscribe((res: any) => {
      this.customersList = res;
    });
  }
  validateExistsCustomers() {
    if (this.customersList.length === 0) {
      this.openAlertMessage('No tienes clientes agregados, por favor agrega los clientes que necesites.',
        'Ok, ir a crear', 'mantenimiento/clientes');
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
      this.accountsReceivableIndex = this.allAccounts.findIndex(account => account.code === '1.1.3');
      this.ivaFiscalDebitIndex = this.allAccounts.findIndex(account => account.code === '2.1.3');
      this.debitAccountId = this.allAccounts[this.banksIndex].idAccountingAccount;
    });
  }
  selectAccountAffectations() {
    this.accountAffectationsService.getAccountAffectations().subscribe((res: any) => {
      this.affectations = res;
      this.debitAffectationIndex = this.affectations.findIndex(a => a.name === 'Débito');
      this.creditAffectationIndex = this.affectations.findIndex(a => a.name === 'Crédito');
    });
  }
  salesFormGroup() {
    this.salesForm = this.formBuilder.group({
      idAccountingAccount: [this.incomeType, Validators.required],
      voucher: [this.invoiceNumber],
      registrationDate: [this.registrationDate, Validators.required],
      idCustomer: [this.customerId, Validators.required],
      details: [this.invoiceDetail],
      iva: [this.invoiceIva],
      totaAmount: [this.invoiceAmount, Validators.required],
      idD151: [this.invoiceIva, Validators.required],
      idMovementType: [this.condition, Validators.required],
      debitAccount: [this.debitAccountId, Validators.required]
    });
  }
  enableDebitAccount() {
    if (this.enabledDebitAccount === false) {
      this.enabledDebitAccount = true;
    } else {
      this.enabledDebitAccount = false;
    }
  }
  changeDebitAccountToCash() {
    const banksId = this.allAccounts[this.banksIndex].idAccountingAccount;
    const accountsReceivable = this.allAccounts[this.accountsReceivableIndex].idAccountingAccount;
    if (this.debitAccountId === banksId || this.debitAccountId === accountsReceivable) {
      this.debitAccountId = this.allAccounts[this.banksIndex].idAccountingAccount;
    }
  }
  changeDebitAccountToCredit() {
    const banksId = this.allAccounts[this.banksIndex].idAccountingAccount;
    const accountsReceivable = this.allAccounts[this.accountsReceivableIndex].idAccountingAccount;
    if (this.debitAccountId === banksId || this.debitAccountId === accountsReceivable) {
      this.debitAccountId = this.allAccounts[this.accountsReceivableIndex].idAccountingAccount;
    }
  }
  onSubmit() {
    if (this.salesForm.valid) {
      this.progressBar = true;
      if (!this.isEditingSale) {
        this.createSale();
      } else {
        this.editSale();
      }
    }
  }
  displayCreateSale() {
    this.title = 'Ingresar nueva venta';
    this.condition = this.movementTypes[this.movementTypes.findIndex(res => res.name === 'Contado')].idMovementType;
    this.selectAccountAffectations();
    this.isCreatingSale = true;
  }
  generateDataToSend() {
    this.firstJournalMovement = {
      IdAccountingAccount: this.debitAccountId,
      IdAccountAffectation: this.affectations[this.debitAffectationIndex].idAccountAffectation,
      TotalAmount: this.invoiceAmount
    };
    this.JournalMovements.push(this.firstJournalMovement);

    if (this.invoiceIva > 0) {
      this.ivaJournalMovement = {
        IdAccountingAccount: this.allAccounts[this.ivaFiscalDebitIndex].idAccountingAccount,
        IdAccountAffectation: this.affectations[this.creditAffectationIndex].idAccountAffectation,
        TotalAmount: this.invoiceIva,
      };
      this.JournalMovements.push(this.ivaJournalMovement);

      this.secondJournalMovement = {
        IdAccountingAccount: this.incomeType,
        IdAccountAffectation: this.affectations[this.creditAffectationIndex].idAccountAffectation,
        TotalAmount: Number(this.invoiceAmount) - Number(this.invoiceIva)
      };
      this.JournalMovements.push(this.secondJournalMovement);

    } else {

      this.secondJournalMovement = {
        IdAccountingAccount: this.incomeType,
        IdAccountAffectation: this.affectations[this.creditAffectationIndex].idAccountAffectation,
        TotalAmount: this.invoiceAmount
      };
      this.JournalMovements.push(this.secondJournalMovement);
    }
    if (this.invoiceIva === null) {
      this.invoiceIva = 0;
    }
    if (!this.isEditingSale) {
      this.dataToSend = {
        IdCompany: this.idCompany,
        RegistrationDate: this.registrationDate,
        TotalAmount: this.invoiceAmount,
        IdAccountingAccount: this.incomeType,
        Voucher: this.invoiceNumber,
        IdCustomer: this.customerId,
        Details: this.invoiceDetail,
        IVA: this.invoiceIva,
        IdD151: this.d151Option,
        IdMovementType: this.condition,
        JournalMovements: this.JournalMovements
      }
    } else {
      this.dataToSend = {
        IdIncome: this.idIncome,
        RegistrationDate: this.registrationDate,
        TotalAmount: this.invoiceAmount,
        IdAccountingAccount: this.incomeType,
        Voucher: this.invoiceNumber,
        IdCustomer: this.customerId,
        Details: this.invoiceDetail,
        IVA: this.invoiceIva,
        IdD151: this.d151Option,
        IdMovementType: this.condition,
        JournalMovements: this.JournalMovements
      };

    }
  }
  createSale() {
    this.progressBar = true;
    const today = this.registrationDate;
    const time = today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
    this.registrationDate = (today.getMonth() + 1) + '-' + today.getDate() + '-' + today.getFullYear() + ' ' + time;
    this.generateDataToSend();

    this.incomesService.createSale(this.dataToSend).subscribe((response) => {
      this.isCreatingSale = false;
      this.inicialize();
      this.getIncomes();
      this.dataToSend = {};
      this.JournalMovements = [];
      this.openSnackBar('¡Venta Registrada!');
    }, err => {
      this.openSnackBar('¡Error de servidor!');
      console.log(err);
    });
  }
  cancelCreateIncome() {
    this.progressBar = true;
    this.getIncomes();
    this.isCreatingSale = false;
    this.inicialize();
  }
  editSale() {
    this.generateDataToSend();
    this.incomesService.editSale(this.dataToSend).subscribe((response) => {
      this.isCreatingSale = false;
      this.isEditingSale = false;
      this.inicialize();
      this.getIncomes();
      this.dataToSend = {};
      this.JournalMovements = [];
      this.progressBar = false;
      this.openSnackBar('¡Venta Actualizada!');
      this.progressBar = false;
    }, err => {
      this.openSnackBar('¡Error de servidor!');
      console.log(err);
    });
  }
  displayeEditPage(element) {
    this.title = 'Editar venta';
    let idDebitAccount;
    this.idIncome = element.idIncome;
    this.condition = element.idMovementType;
    this.journalMovementsService.getJournalMovements(element.idJournalSeat).subscribe((res: any) => {
      idDebitAccount = res[res.findIndex(resp => resp.idAccountAffectation === this.affectations[this.debitAffectationIndex].idAccountAffectation)].idAccountingAccount;
      this.registrationDate = element.registrationDate;
      this.incomeType = element.idAccountingAccount;
      this.d151Option = element.idD151;
      this.debitAccountId = idDebitAccount;
      this.invoiceNumber = element.voucher;
      this.customerId = element.idCustomer;
      this.invoiceDetail = element.details;
      this.invoiceAmount = element.totalAmount;
      this.invoiceIva = element.iva;
      this.isCreatingSale = true;
      this.isEditingSale = true;
    });
  }
  deleteIncome(idIncome) {
    this.openConfirmationMessage(idIncome);
  }
  openConfirmationMessage(idIncome): void {
    const dialogRef = this.dialog.open(ConfirmationMessageComponent, {
      data: { 'title': 'Eliminar Venta', 'description': '¿Deseas eliminar la venta?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.incomesService.deleteIncome(idIncome).subscribe((response) => {
          this.getIncomes();
          this.openSnackBar('¡Venta eliminada!');
        }, err => {
          this.openSnackBar('¡Error de servidor!');
          console.log(err);
        });
      }
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
  openSnackBar(message) {
    this.snackBar.openFromComponent(SnackBarSavedChangesComponent, {
      data: { message: message }, duration: 2000,
    });
  }

}
