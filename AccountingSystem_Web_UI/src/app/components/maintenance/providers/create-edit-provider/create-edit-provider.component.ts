import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { ProvidersService } from '../../../../services/providers.service';
import { SnackBarSavedChangesComponent } from 'src/app/components/shared/snack-bar-saved-changes/snack-bar-saved-changes.component';

@Component({
  selector: 'app-create-edit-provider',
  templateUrl: './create-edit-provider.component.html'
})
export class CreateEditProviderComponent implements OnInit {

  public progressBar;
  public title;
  public providerForm: FormGroup;
  public provider = {};
  public idCompany;

  constructor(private providerService: ProvidersService, private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialogRef<CreateEditProviderComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {

    this.progressBar = false;
    this.title = data.title;
    this.formProvider();
    this.idCompany = localStorage.getItem('idCompany');
  }

  formProvider() {
    this.providerForm = this.formBuilder.group({
      name: ['', Validators.required],
      identification: [''],
      email: ['', Validators.email],
      telephone: [''],
      address: ['']

    });
  }

  ngOnInit() {
  }

  onSubmit() {
    console.log('TITLE: ' + this.title);
    if (this.title === 'Ingresar Nuevo Proveedor') {
      this.createProvider();
    } else {
      this.updateProvider();
    }
  }

  createProvider() {
    this.provider = {
      Identification: this.providerForm.value.identification,
      Name: this.providerForm.value.name,
      IdCompany: this.idCompany,
      Telephone: this.providerForm.value.telephone,
      Email: this.providerForm.value.email,
      Address: this.providerForm.value.address
    };
    if (this.providerForm.valid) {
      this.progressBar = true;
      console.log(this.provider);
      this.providerService.createProvider(this.provider).subscribe((response) => {
        this.openSnackBar('¡Proveedor Ingresado!');
        this.closeDialog();
      }, err => {
        this.closeDialog();
        this.openSnackBar('¡Error de servidor!');
        console.log(err);
      });
    }
  }

  updateProvider() {
    this.provider = {
      IdProvider: this.data.idProvider,
      Name: this.providerForm.value.name,
      Identification: this.providerForm.value.identification,
      Email: this.providerForm.value.email,
      Telephone: this.providerForm.value.telephone,
      Address: this.providerForm.value.address
    };

    if (this.providerForm.valid) {
      this.progressBar = true;
      this.providerService.updateProvider(this.provider).subscribe((response) => {
        this.openSnackBar('¡Proveedor Actualizado!');
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
