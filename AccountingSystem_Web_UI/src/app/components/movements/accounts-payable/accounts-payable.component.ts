import { Component, OnInit } from '@angular/core';
import { AccountsPayableService } from '../../../services/accounts-payable.service';

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
  public spinner: boolean = true;
  public companyName: string;
  displayedColumns: string[] = ['providerName', 'accountingDate', 'expirationDate', 'creditDays', 'daysToExpire', 'totalAmount', 'balanceAmount', 'details', 'accountStatus', 'icons'];

  constructor(private accountsPayableService: AccountsPayableService) { }

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
  getAccountsPayable(skipNumber, numberRegisters) {
    this.accountsPayableService.selectAccountsPayable(skipNumber, numberRegisters).subscribe((res: any) => {
      this.accountsPayableData = res;
      this.spinner = false;
    });
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
    this.getNumberOfRegisters();
    this.skipNumber = 0;
    this.getAccountsPayable(this.skipNumber, this.defaultNumRegistersPerPage);
  }


}
