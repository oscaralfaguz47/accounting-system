import { Component, OnInit } from '@angular/core';
import { AccountsPayableService } from '../../../services/accounts-payable.service';
import { element } from 'protractor';
import * as internal from 'assert';
import { MatSnackBar } from '@angular/material';
import { SnackBarSavedChangesComponent } from '../../shared/snack-bar-saved-changes/snack-bar-saved-changes.component';
import { AccountingAccoutsService } from 'src/app/services/accounting-accouts.service';

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
  filterInput: string;
  loadData: boolean;
  public spinner: boolean = true;
  public companyName: string;
  displayedColumns: string[] = ['providerName', 'accountingDate', 'expirationDate', 'creditDays', 'daysToExpire', 'totalAmount', 'balanceAmount', 'details', 'accountStatus', 'icons'];

  selectedAccount: any = {};
  txtAmountToPay: number;
  accountPayableDetails: string;
  creditedAccount: number;
  allAccounts: any = [];
  validationMessage: boolean;
  validationAmountGreater: boolean;
  submitingData: boolean;

  constructor(
    private accountsPayableService: AccountsPayableService,
    private snackBar: MatSnackBar,
    private accountingAccountService: AccountingAccoutsService) { }

  ngOnInit() {
    this.companyName = localStorage.getItem('companyName');
    this.getNumberOfRegisters();
    this.skipNumber = 0;
    this.defaultNumRegistersPerPage = 15;
    this.getAccountsPayable(this.skipNumber, this.defaultNumRegistersPerPage);
  }
  getNumberOfRegisters() {
    this.accountsPayableService.selectNumberOfRegisters().subscribe((res: any) => {
      this.numberOfRegisters = null;
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
  getAccountsPayable(skipNumber, numberRegisters) {
    this.accountsPayableService.selectAccountsPayable(skipNumber, numberRegisters).subscribe((res: any) => {
      this.accountsPayableData = res;
      this.loadData = true;
      this.spinner = false;
    });
  }
  getAccountsPayableWhenFilter(skipNumber, numberRegisters, criteria) {
    this.accountsPayableService.filterAccountsPayable(skipNumber, numberRegisters, criteria).subscribe((res: any) => {
      this.accountsPayableData = res;
      this.numberOfRegisters = this.accountsPayableData.length;
      this.initializePaginator();

    });
  }
  filterAccountsPayable() {
    this.spinner = true;
    if (this.filterInput.trim() === '') {
      this.changeItemPerPage();
    } else {
      this.skipNumber = 0;
      this.getAccountsPayableWhenFilter(this.skipNumber, this.defaultNumRegistersPerPage, this.filterInput);
      this.spinner = false;
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
      this.getAccountsPayable(this.skipNumber, this.defaultNumRegistersPerPage);
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
      this.getAccountsPayable(this.skipNumber, this.defaultNumRegistersPerPage);
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
    if (this.filterInput === '' || this.filterInput === undefined) {
      this.getNumberOfRegisters();
      this.skipNumber = 0;
      this.getAccountsPayable(this.skipNumber, this.defaultNumRegistersPerPage);
    } else {
      this.skipNumber = 0;
      this.getAccountsPayable(this.skipNumber, this.defaultNumRegistersPerPage);
    }
  }
  openModal(element) {
    this.allAccounts = [];
    this.validationMessage = false;
    this.validationAmountGreater = false;
    this.selectAllAccounts();
    this.selectedAccount = element;
    this.txtAmountToPay = element.balanceAmount;
    this.accountPayableDetails = element.details;
  }
  payAccountPayable() {
    var dataToSend = {
      'IdAccountPayable': this.selectedAccount.idAccountPayable,
      'AppliedAmount': this.txtAmountToPay,
      'Details': this.accountPayableDetails,
      'IdCreditedAccount': this.creditedAccount
    };
    if(this.txtAmountToPay === 0 || this.txtAmountToPay === null || this.accountPayableDetails === ''){
      this.validationMessage = true;
      this.validationAmountGreater = false;
    } else {
      this.validationMessage = false;
      if(this.selectedAccount.balanceAmount >= this.txtAmountToPay){
        this.submitingData = true;
        this.validationAmountGreater = false;
        this.accountsPayableService.payAccountPayable(dataToSend).subscribe((response) => {
          this.getAccountsPayable(this.skipNumber, this.defaultNumRegistersPerPage);
          this.submitingData = false;
          closeModal();
          this.openSnackBar('¡Movimiento realizado correctamente!');
        }, err => {
          this.openSnackBar('¡Error de servidor!');
          console.log(err);
        });
      } else {
        this.validationAmountGreater = true;
        this.validationMessage = false;
      }
    }
  }

  openSnackBar(message) {
    this.snackBar.openFromComponent(SnackBarSavedChangesComponent, {
      data: { message: message }, duration: 2000,
    });
  }

}
