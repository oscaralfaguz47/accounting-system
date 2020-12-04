import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CustomerService } from '../../../../services/customers.service';
import { MatSnackBar, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SnackBarSavedChangesComponent } from 'src/app/components/shared/snack-bar-saved-changes/snack-bar-saved-changes.component';

@Component({
  selector: 'app-create-edit-customer',
  templateUrl: './create-edit-customer.component.html',
  styles: [],
  providers: [CustomerService]
})
export class CreateEditCustomerComponent implements OnInit {

  public progressBar;
  public title;
  public customerForm: FormGroup;
  public customer = {};
  public idCompany;

  constructor(private formBuilder: FormBuilder,
              private customerService: CustomerService,
              private snackBar: MatSnackBar,
              private dialog: MatDialogRef<CreateEditCustomerComponent>,
              @Inject(MAT_DIALOG_DATA) public data) {
    this.progressBar = false;
    this.title = data.title;
    this.idCompany = localStorage.getItem('idCompany');
    this.formCustomer();
  }

  ngOnInit() {
  }

  formCustomer() {
    this.customerForm = this.formBuilder.group({
      name: ['', Validators.required],
      identification: [''],
      email: ['', Validators.email],
      telephone: [''],
      address: ['']
    });
  }

  onSubmit() {
    if (this.title === 'Ingresar Nuevo Cliente') {
      this.createCustomer();
    } else {
       this.updateCustomer();
    }
  }

  createCustomer() {
    this.customer = {
      Identification: this.customerForm.value.identification,
      Name: this.customerForm.value.name,
      IdCompany: this.idCompany,
      Telephone: this.customerForm.value.telephone,
      Email: this.customerForm.value.email,
      Address: this.customerForm.value.address
    };
    if (this.customerForm.valid) {
      this.progressBar = true;
      this.customerService.createCustomer(this.customer).subscribe((response) => {
        this.openSnackBar('¡Cliente Ingresado!');
        this.closeDialog();
      }, err => {
        this.closeDialog();
        this.openSnackBar('¡Error de servidor!');
        console.log(err);
      });
    }
  }

  updateCustomer() {
    this.customer = {
      IdCustomer: this.data.idCustomer,
      Name: this.customerForm.value.name,
      Identification: this.customerForm.value.identification,
      Email: this.customerForm.value.email,
      Telephone: this.customerForm.value.telephone,
      Address: this.customerForm.value.address
    };

    if (this.customerForm.valid) {
      this.progressBar = true;
      this.customerService.updateCustomer(this.customer).subscribe((response) => {
        this.openSnackBar('¡Cliente Actualizado!');
        this.closeDialog();
      }, err => {
        this.closeDialog();
        this.openSnackBar('¡Error de servidor!');
        console.log(err);
      });
    }
  }

  closeDialog() {
    this.dialog.close();
  }

  openSnackBar(message) {
    this.snackBar.openFromComponent(SnackBarSavedChangesComponent, {
      data: { message: message }, duration: 2000,
    });
  }

}
