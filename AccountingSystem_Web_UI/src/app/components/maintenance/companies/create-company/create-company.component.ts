import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { CompaniesService } from '../../../../services/companies.service';
import { SnackBarSavedChangesComponent } from '../../../shared/snack-bar-saved-changes/snack-bar-saved-changes.component';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { UserService } from '../../../../services/user.service';
import { Router } from '@angular/router';

declare var myExtObject: any;

@Component({
  selector: 'app-create-company',
  templateUrl: './create-company.component.html',
  providers: [CompaniesService, UserService]

})
export class CreateCompanyComponent implements OnInit, OnDestroy {

  public progressBar;
  public createCompanyForm: FormGroup;
  public title;
  public idCompany: number;
  public company = {};
  public idUser;
  public token;
  public redirectToConfiguration;

  constructor(private snackBar: MatSnackBar,
    private companiesService: CompaniesService,
    private router: Router,
    private userService: UserService,
    private dialog: MatDialogRef<CreateCompanyComponent>, @Inject(MAT_DIALOG_DATA) public data) {
    this.formCreateCompany();
    this.title = data.title;
    this.idUser = JSON.parse(localStorage.getItem('identity')).IdUser;
    this.token = localStorage.getItem('token');
    this.redirectToConfiguration = false;
    console.log(data);
  }

  ngOnInit() {
    this.progressBar = false;
    myExtObject.openDialog();
  }
ngOnDestroy(){
  myExtObject.closeDialog();
}
  formCreateCompany() {
    this.createCompanyForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      identification: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email]),
      companyPhone: new FormControl(''),
    });
  }

  closeDialog() {
    this.dialog.close();
  }
  onSubmit() {
    if (this.title === 'Crear Nueva Empresa') {
      if (localStorage.getItem('idCompany') === 'not-defined') {
        this.createFirstCompany();
      } else {
        this.createCompany();
      }
    } else {
      this.updateCompany();
    }
  }

  createFirstCompany() {
    if (this.createCompanyForm.valid) {
      this.progressBar = true;
      console.log(this.createCompanyForm.value);
      this.companiesService.createFirstCompany(this.createCompanyForm.value).subscribe((response) => {
        this.openSnackBar('¡Empresa Creada!');
        this.closeDialog();
        if (localStorage.getItem('idCompany') === 'not-defined') {
          this.redirectToConfiguration = true;
        }
        this.userService.selectFirstCompany(this.idUser, this.token).subscribe((res: any) => {
          this.idCompany = res[0].idCompany;
          localStorage.setItem('idCompany', this.idCompany.toString());
          localStorage.setItem('companyName', res[0].companyName);
          if (this.redirectToConfiguration) {
            this.router.navigate(['configuracion/asiento-apertura']);
            localStorage.setItem('step', '1');
          }

        });

      }, err => {
        this.closeDialog();
        this.openSnackBar('¡Error de servidor!');
        console.log(err);
      });
    }
  }

  createCompany() {
    if (this.createCompanyForm.valid) {
      this.progressBar = true;
      this.companiesService.createCompany(this.createCompanyForm.value).subscribe((response) => {
        this.openSnackBar('¡Empresa Creada!');
        this.closeDialog();
      }, err => {
        this.closeDialog();
        this.openSnackBar('¡Error de servidor!');
        console.log(err);
      });
    }
  }

  updateCompany() {
    this.idCompany = this.data.idCompany;
    this.company = {
      'idCompany': this.idCompany,
      'Name': this.createCompanyForm.value.name,
      'Identification': this.createCompanyForm.value.identification,
      'Email': this.createCompanyForm.value.email,
      'CompanyPhone': this.createCompanyForm.value.companyPhone
    };

    if (this.createCompanyForm.valid) {
      this.progressBar = true;
      this.companiesService.updateCompany(this.company).subscribe((response) => {
        this.openSnackBar('¡Empresa Actualizada!');
        this.closeDialog();
      }, err => {
        this.closeDialog();
        this.openSnackBar('¡Error de servidor!');
        console.log(err);
      });
    }
  }

  openSnackBar(message) {
    this.snackBar.openFromComponent(SnackBarSavedChangesComponent, {
      data: { message: message }, duration: 2000,
    });
  }

}
