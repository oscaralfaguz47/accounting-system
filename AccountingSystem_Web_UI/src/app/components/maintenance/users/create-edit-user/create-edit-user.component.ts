import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../../../services/user.service';
import { SnackBarSavedChangesComponent } from 'src/app/components/shared/snack-bar-saved-changes/snack-bar-saved-changes.component';
import { RolesService } from '../../../../services/roles.service';

export class Roles {
  public idRoll;
  public name;
}

@Component({
  selector: 'app-create-edit-user',
  templateUrl: './create-edit-user.component.html',
  styles: [],
  providers: [UserService]
})
export class CreateEditUserComponent implements OnInit {

  public progressBar;
  public UserForm: FormGroup;
  public idUser;
  public roles: Roles;
  public user = {};
  public actPassword;

  constructor(private rolesService: RolesService,
              private snackBar: MatSnackBar,
              private formBuilder: FormBuilder,
              private userService: UserService,
              private dialog: MatDialogRef<CreateEditUserComponent>, @Inject(MAT_DIALOG_DATA) public data) {
    if (data.title === 'Crear Nuevo Usuario') {
      this.formCreateUser();
    } else {
      this.formUpdateUser();
    }

    this.rolesService.getRoles().subscribe((res: any) => {
      this.roles = res;
    });

  }

  ngOnInit() {
    this.idUser = JSON.parse(localStorage.getItem('identity')).IdUser;
    this.progressBar = false;

  }

  formCreateUser() {
    this.UserForm = this.formBuilder.group({
      idRoll: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      ocupation: [''],
      password: ['', Validators.required]
    });
  }

  formUpdateUser() {
    this.UserForm = this.formBuilder.group({
      idRoll: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      ocupation: [''],
      password: ['']

    });
  }

  onSubmit() {
    if (this.data.title === 'Crear Nuevo Usuario') {
      this.createUser();
    } else {
      this.updateUser();
    }
  }

  closeDialog() {
    this.dialog.close();
  }

  createUser() {
    if (this.UserForm.valid) {
      this.progressBar = true;

      this.userService.createUserFromUser(this.idUser, this.UserForm.value).subscribe((response) => {
        this.openSnackBar('¡Usuario Creado!');
        this.closeDialog();
      }, err => {
        this.closeDialog();
        this.openSnackBar(err.error);
        console.log(err);
      });
    }
  }

  updateUser() {
    if (this.UserForm.value.password === '') {
      this.actPassword = false;
    } else {
      this.actPassword = true;
    }
    this.idUser = this.data.idUser;
    this.user = {
      idUser: this.idUser,
      IdRoll: this.UserForm.value.idRoll,
      FirstName: this.UserForm.value.firstName,
      LastName: this.UserForm.value.lastName,
      Email: this.UserForm.value.email,
      Ocupation: this.UserForm.value.ocupation,
      Password: this.UserForm.value.password,
      act_password: this.actPassword,
    };

    if (this.UserForm.valid) {
      this.progressBar = true;
      this.userService.updateUser(this.user).subscribe((response) => {
        this.openSnackBar('¡Usuario Actualizado!');
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
      data: { message: message }, duration: 4000,
    });
  }
}
