import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CompaniesService } from '../../../services/companies.service';
import { MatDialog, MatSnackBar, MatTableDataSource } from '@angular/material';
import { CreateCompanyComponent } from './create-company/create-company.component';
import { ConfirmationMessageComponent } from '../../shared/confirmation-message/confirmation-message.component';
import { SnackBarSavedChangesComponent } from '../../shared/snack-bar-saved-changes/snack-bar-saved-changes.component';
import { UserService } from '../../../services/user.service';
import { Overlay } from '@angular/cdk/overlay';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';

export interface PeriodicElement {
  id: number;
  name: string;
  identification: string;
  email: string;
  phone: string;
}

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  providers: [CompaniesService]
})
export class CompaniesComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['name', 'identification', 'email', 'phone', 'icons'];
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
  public iduser;
  public parameters = {};
  public token;
  public companyObject: any = {};
  public idCompany;
  public companyName;
  public lastCompany;
  public spinner: boolean = true;

  constructor(private overlay: Overlay,
              private userService: UserService,
              private companiesService: CompaniesService, public dialog: MatDialog, private snackBar: MatSnackBar) {
    this.iduser = JSON.parse(localStorage.getItem('identity')).IdUser;
    this.token = localStorage.getItem('token');
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit() {
    this.getCompanies();
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getCompanies() {
    this.companiesService.getCompanies(this.iduser).subscribe((res: any) => {
      this.dataSource = new MatTableDataSource(res);
      this.spinner = false;
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CreateCompanyComponent, {
      data: this.parameters,
      maxWidth: '100%',
      scrollStrategy: this.overlay.scrollStrategies.noop()
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getCompanies();
    });
  }

  createCompany() {
    this.parameters = {
      'title': 'Crear Nueva Empresa'
    };
    this.openDialog();
  }
  updateCompany(element) {
    this.parameters = {
      'title': 'Editar Empresa',
      'idCompany': element.idCompany,
      'name': element.companyName,
      'identification': element.companyIdentification,
      'email': element.companyEmail,
      'phone': element.companyPhone
    };
    this.openDialog();
  }
  deleteCompany(idCompany) {
    this.companiesService.getCompanies(this.iduser).subscribe(res => {
      this.lastCompany = res[1];
      if (this.lastCompany === undefined) {
        this.openSnackBar('¡No puedes eliminar la primer empresa!');
      } else {
        this.openConfirmationMessage(idCompany);
      }
    });

  }

  openConfirmationMessage(idCompany): void {
    const dialogRef = this.dialog.open(ConfirmationMessageComponent, {
      data: { 'title': 'Eliminar Empresa', 'description': '¿Deseas eliminar la empresa?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.companiesService.deleteCompany(idCompany).subscribe((response) => {

          console.log(idCompany);
          console.log(localStorage.getItem('idCompany'));
          if (idCompany.toString() === localStorage.getItem('idCompany')) {

            this.userService.selectFirstCompany(this.iduser, this.token).subscribe((res: any) => {
              this.companyObject = res[0];
              this.idCompany = this.companyObject.idCompany;
              this.companyName = this.companyObject.companyName;
              localStorage.setItem('idCompany', this.idCompany);
              localStorage.setItem('companyName', this.companyName);
              window.location.reload();

            });
          }
          this.getCompanies();
          this.openSnackBar('¡Empresa eliminada!');
        }, err => {
          this.openSnackBar('¡Error de servidor!');
          console.log(err);
        });
      }
    });
  }
  openSnackBar(message): void {
    this.snackBar.openFromComponent(SnackBarSavedChangesComponent, {
      data: { message: message }, duration: 2000
    });
  }


}
