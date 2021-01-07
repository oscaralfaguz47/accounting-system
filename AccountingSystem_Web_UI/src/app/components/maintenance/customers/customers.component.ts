import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CustomerService } from '../../../services/customers.service';
import { CreateEditCustomerComponent } from './create-edit-customer/create-edit-customer.component';
import { MatDialog, MatSnackBar, MatTableDataSource } from '@angular/material';
import { ConfirmationMessageComponent } from '../../shared/confirmation-message/confirmation-message.component';
import { SnackBarSavedChangesComponent } from '../../shared/snack-bar-saved-changes/snack-bar-saved-changes.component';
import { Overlay } from '@angular/cdk/overlay';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';


@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styles: []
})
export class CustomersComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['name', 'identification', 'email', 'telephone', 'icons'];
  customersDataSource: any = [];

  @ViewChild(MatPaginator, {static: false})
  set paginator(value: MatPaginator) {
    if (this.customersDataSource){
      this.customersDataSource.paginator = value;
    }
  }
  @ViewChild(MatSort, {static: false})
  set sort(value: MatSort) {
    if (this.customersDataSource){
      this.customersDataSource.sort = value;
    }
  }

  public idCompany;
  public companyName;
  public parameters = {};
  public spinner: boolean = true;
  public data = [];

  constructor(private customerService: CustomerService,
              public dialog: MatDialog,
              private snackBar: MatSnackBar, private overlay: Overlay) {
    this.companyName = localStorage.getItem('companyName');
    this.idCompany = localStorage.getItem('idCompany');
    this.getCustomers();
   }
   ngAfterViewInit() {
    this.customersDataSource.paginator = this.paginator;
    this.customersDataSource.sort = this.sort;
  }

  ngOnInit() {
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.customersDataSource.filter = filterValue.trim().toLowerCase();
  }

  getCustomers() {
    this.customerService.SelectCustomers(this.idCompany).subscribe((res: any) => {
      this.data = res;
      this.customersDataSource = new MatTableDataSource(res);
      this.spinner = false;
    });
  }

  createCustomer() {
    this.parameters = {
      title: 'Ingresar Nuevo Cliente'
    };
    this.openDialog();
  }

  updateCustomer(element) {
    this.parameters = {
      idCustomer: element.idCustomer,
      name: element.name,
      identification: element.identification,
      email: element.email,
      telephone: element.telephone,
      address: element.address,
      title: 'Editar Cliente'
    };
    this.openDialog();
  }

  deleteCustomer(idCustomer) {
    this.openConfirmationMessage(idCustomer);
  }

  openConfirmationMessage(idCustomer): void {
    const dialogRef = this.dialog.open(ConfirmationMessageComponent, {
      data: { 'title': 'Eliminar Cliente', 'description': '¿Deseas eliminar el cliente?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.customerService.deleteCustomer(idCustomer).subscribe((response) => {
          this.getCustomers();
          this.openSnackBar('¡Cliente eliminado!');
        }, err => {
          this.openSnackBar('¡Error de servidor!');
          console.log(err);
        });
      }
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CreateEditCustomerComponent, {
      data: this.parameters,
      maxWidth: '100%',
      scrollStrategy: this.overlay.scrollStrategies.noop()
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getCustomers();
    });
  }

  openSnackBar(message):void {
    this.snackBar.openFromComponent(SnackBarSavedChangesComponent, {
      data: { message: message }, duration: 2000
    });
  }

}
