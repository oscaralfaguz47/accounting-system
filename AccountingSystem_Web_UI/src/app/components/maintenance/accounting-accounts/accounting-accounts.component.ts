import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { AccountingAccoutsService } from '../../../services/accounting-accouts.service';
import { CreateEditAccountingAccountsComponent } from './create-edit-accounting-accounts/create-edit-accounting-accounts.component';
import { Overlay } from '@angular/cdk/overlay';
import { MatDialog, MatSnackBar, MatTableDataSource } from '@angular/material';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-accounting-accounts',
  templateUrl: './accounting-accounts.component.html',
  styles: [],
  providers: [AccountingAccoutsService]
})
export class AccountingAccountsComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['code', 'accountName', 'accountAffectationName', 'firstCategoryName', 'secondCategoryName',
    'description', 'icons'];
  public companyName;
  public accountsDataSource: any = [];

  @ViewChild(MatPaginator, {static: false})
  set paginator(value: MatPaginator) {
    if (this.accountsDataSource){
      this.accountsDataSource.paginator = value;
    }
  }
  @ViewChild(MatSort, {static: false})
  set sort(value: MatSort) {
    if (this.accountsDataSource){
      this.accountsDataSource.sort = value;
    }
  }
  public parameters = {};
  public spinner: boolean = true;
  public data = [];

  constructor(private accountingAccountsService: AccountingAccoutsService, public dialog: MatDialog, private overlay: Overlay) {
    this.companyName = localStorage.getItem('companyName');
    this.getAccountingAccounts();
  }
  ngAfterViewInit() {
    this.accountsDataSource.paginator = this.paginator;
    this.accountsDataSource.sort = this.sort;
  }
  ngOnInit() {
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.accountsDataSource.filter = filterValue.trim().toLowerCase();
  }
  getAccountingAccounts() {
    this.accountingAccountsService.getAccountingAccounts().subscribe((res: any) => {
      this.data = res;
      this.accountsDataSource = new MatTableDataSource(res);
      this.spinner = false;
    });
  }

  createAccount() {
    this.parameters = {
      title: 'Ingresar Nueva Cuenta'
    };
    this.openDialog();
  }
  updateAccountingAccount(element) {
    this.parameters = {
      idAccountingAccount: element.idAccountingAccount,
      accountName: element.accountName,
      description: element.description,
      title: 'Editar Cuenta'
    };
    this.openDialog();
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(CreateEditAccountingAccountsComponent, {
      data: this.parameters,
      maxWidth: '100%',
      scrollStrategy: this.overlay.scrollStrategies.noop()
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getAccountingAccounts();
    });
  }

}
