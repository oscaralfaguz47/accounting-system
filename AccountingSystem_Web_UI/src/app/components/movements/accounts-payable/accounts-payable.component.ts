import { Component, OnInit } from '@angular/core';
import { AccountsPayableService } from '../../../services/accounts-payable.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { SnackBarSavedChangesComponent } from '../../shared/snack-bar-saved-changes/snack-bar-saved-changes.component';
import { AccountingAccoutsService } from 'src/app/services/accounting-accouts.service';
import { ConfirmationMessageComponent } from '../../shared/confirmation-message/confirmation-message.component';
import { element } from 'protractor';

declare  function closeModal(): any;

@Component({
  selector: 'app-accounts-payable',
  templateUrl: './accounts-payable.component.html',
  styleUrls: ['./accounts-payable.component.css']
})
export class AccountsPayableComponent implements OnInit {

  accountsPayableData: any;
  numberOfRegisters: number;
  paginationFirstNumber: number;
  paginationSecondNumber: number;
  defaultNumRegistersPerPage: number;
  skipNumber: number;
  filterInput: string = '';
  loadData: boolean;
  public spinner: boolean = true;
  public companyName: string;
  displayedColumns: string[] = ['providerName', 'accountingDate', 'expirationDate', 'creditDays', 'daysToExpire', 'totalAmount', 'balanceAmount', 'details', 'accountStatus', 'icons'];

  appliedDate: Date;
  selectedAccount: any = {};
  txtAmountToPay: number;
  accountPayableDetails: string;
  creditedAccount: number;
  allAccounts: any = [];
  validationMessage: boolean;
  validationAmountGreater: boolean;
  submitingData: boolean;
  accountsPayableMovementsData: any;
  viewAccountsPayableMovements: boolean;
  modalTitle: string;

  constructor(
    private accountsPayableService: AccountsPayableService,
    private snackBar: MatSnackBar,
    private accountingAccountService: AccountingAccoutsService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.companyName = localStorage.getItem('companyName');
    this.getNumberOfRegisters();
    this.skipNumber = 0;
    this.defaultNumRegistersPerPage = 30;
    this.getAccountsPayable(this.skipNumber, this.defaultNumRegistersPerPage, '');
    console.log('Today is: ' + this.appliedDate);
  }
  getNumberOfRegisters() {
    this.accountsPayableService.selectNumberOfRegisters().subscribe((res: any) => {
      this.numberOfRegisters = null;
      this.numberOfRegisters = res;
      this.initializePaginator();
    });
  }
  getNumberOfRegistersWhenFilter(criteria) {
    this.accountsPayableService.selectNumberOfRegistersWhenFilter(criteria).subscribe((res: any) => {
      this.numberOfRegisters = res;
      this.initializePaginator();
    });
  }
  selectAllAccounts() {
    this.accountingAccountService.selectAllAccountingAccounts().subscribe((res: any) => {
      this.allAccounts = res;
      var bankIndex = this.allAccounts.findIndex(account => account.accountName === 'Bancos');
      this.creditedAccount = this.allAccounts[bankIndex].idAccountingAccount;
    });
  }
  getAccountsPayableMovements(element) {
    document.getElementById('modalDialog').classList.add('modal-lg');
    this.viewAccountsPayableMovements = false;
    this.selectedAccount = element;
    this.modalTitle = 'Movimientos de pagos a:';
    this.allAccounts = [];
    this.accountsPayableService.selectAccountsPayableMovements(element.idAccountPayable).subscribe((res: any) => {
      this.accountsPayableMovementsData = res;
      this.viewAccountsPayableMovements = true;
    });
  }
  getAccountsPayable(skipNumber, numberRegisters, criteria) {
    this.accountsPayableService.selectAccountsPayable(skipNumber, numberRegisters, criteria).subscribe((res: any) => {
      this.accountsPayableData = res;
      this.loadData = true;
      this.spinner = false;
    });
  }
  getAccountsPayableWhenFilter() {
    this.accountsPayableService.filterAccountsPayable(this.defaultNumRegistersPerPage, this.filterInput).subscribe((res: any) => {
      this.accountsPayableData = [];
      this.accountsPayableData = res;
      this.loadData = true;
      this.spinner = false;
    });
  }
  filterAccountsPayable() {
    this.skipNumber = 0;
    this.spinner = true;
    this.loadData = false;
    if (this.filterInput.trim() === '') {
      this.changeItemPerPage();
    } else {
      this.getNumberOfRegistersWhenFilter(this.filterInput.trim());
      this.getAccountsPayable(0, this.defaultNumRegistersPerPage, this.filterInput.trim());
    }
  }
  pagination(button) {
    this.spinner = true;
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
        this.getAccountsPayable(this.skipNumber, this.defaultNumRegistersPerPage, '');
      } else {
        this.getAccountsPayable(this.skipNumber, this.defaultNumRegistersPerPage, this.filterInput);
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
        this.getAccountsPayable(this.skipNumber, this.defaultNumRegistersPerPage, '');
      } else {
        this.getAccountsPayable(this.skipNumber, this.defaultNumRegistersPerPage, this.filterInput);
      }
    }
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
  changeItemPerPage() {
    this.loadData = false;
      this.spinner = true;
    if (this.filterInput.trim() === '' || this.filterInput.trim() === undefined) {
      this.getNumberOfRegisters();
    this.skipNumber = 0;
      this.getAccountsPayable(this.skipNumber, this.defaultNumRegistersPerPage, '');
    } else {
      this.getNumberOfRegistersWhenFilter(this.filterInput.trim());
    this.skipNumber = 0;
      this.getAccountsPayable(this.skipNumber, this.defaultNumRegistersPerPage, this.filterInput);
    }
  }
  openModal(element) {
    document.getElementById('modalDialog').classList.remove('modal-lg');
    this.modalTitle = 'Saldar cuenta a:';
    this.viewAccountsPayableMovements = false;
    this.allAccounts = [];
    this.validationMessage = false;
    this.validationAmountGreater = false;
    this.selectAllAccounts();
    this.selectedAccount = element;
    this.txtAmountToPay = element.balanceAmount;
    this.accountPayableDetails = element.details;
  }

  payAccountPayable() {
    console.log(this.appliedDate);
    var dataToSend = {
      'IdAccountPayable': this.selectedAccount.idAccountPayable,
      'AppliedAmount': this.txtAmountToPay,
      'Details': this.accountPayableDetails,
      'IdCreditedAccount': this.creditedAccount,
      'appliedDate': this.appliedDate
    };
    if(this.txtAmountToPay === 0 || this.txtAmountToPay === null || this.accountPayableDetails === '' || this.appliedDate === null || this.appliedDate === undefined){
      this.validationMessage = true;
      this.validationAmountGreater = false;
    } else {
      this.validationMessage = false;
      if(this.selectedAccount.balanceAmount >= this.txtAmountToPay){
      this.openConfirmationMessage(dataToSend);
      } else {
        this.validationAmountGreater = true;
        this.validationMessage = false;
      }
    }
  }
completePayment(dataToSend){
  this.submitingData = true;
  this.validationAmountGreater = false;
  this.accountsPayableService.payAccountPayable(dataToSend).subscribe((response) => {
    this.getAccountsPayable(this.skipNumber, this.defaultNumRegistersPerPage, this.filterInput);
    this.submitingData = false;
    closeModal();
    this.appliedDate = undefined;
    this.openSnackBar('¡Movimiento realizado correctamente!');
  }, err => {
    this.openSnackBar('¡Error de servidor!');
    console.log(err);
  });
}
  openSnackBar(message) {
    this.snackBar.openFromComponent(SnackBarSavedChangesComponent, {
      data: { message: message }, duration: 2000,
    });
  }

  openConfirmationMessage(dataToSend): void {
    const dialogRef = this.dialog.open(ConfirmationMessageComponent, {
      data: { 'title': 'Realizar Pago', 'description': '¿Deseas realizar el pago?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.completePayment(dataToSend);
      }
    });
  }

}
