import { Component, OnInit } from '@angular/core';
import { User } from '../models/user';
import { UserService } from '../../services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RolesService } from '../../services/roles.service';
import { MatSnackBar } from '@angular/material';
import { SnackBarSavedChangesComponent } from '../shared/snack-bar-saved-changes/snack-bar-saved-changes.component';
import { Router } from '@angular/router';
import * as jwt_decode from 'jwt-decode';
import { NgxSpinnerService } from 'ngx-spinner';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [UserService]
})
export class RegisterComponent implements OnInit {
  public message: string;
  public registered: boolean;
  public registerForm: FormGroup;
  public dataToSend = {};
  public idRoll: number;
  public progressBar;
  public identity;
  public token: string;
  public idUser;
  public companyObject: any = {};
  public idCompany;
  public companyName;
  public status: string;
  public credentials = {};

  constructor(private spinnerService: NgxSpinnerService, private snackBar: MatSnackBar,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private rolesServices: RolesService,
    private router: Router) {
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      userEmail: ['', [Validators.required, Validators.email]],
      userPassword: ['', Validators.required]
    });

    this.rolesServices.getRoles().subscribe((res: any) => {

      this.idRoll = res[res.findIndex(r => r.name === 'Administrador')].idRoll;
      console.log(this.idRoll);
    });

  }
  onSubmit() {
    if (this.registerForm.valid) {
      this.progressBar = true;
      this.dataToSend = {
        idRoll: this.idRoll,
        firstName: this.registerForm.value.name,
        lastName: this.registerForm.value.lastName,
        email: this.registerForm.value.userEmail,
        ocupation: '',
        password: this.registerForm.value.userPassword

      };
      this.credentials = {
        email: this.registerForm.value.userEmail,
        password: this.registerForm.value.userPassword
      };
      this.userService.register(this.dataToSend).subscribe((response: User) => {
        console.log(response);
        this.registered = true;
        this.login(this.credentials);
      }, err => {
        if (err.error) {
          this.registered = false;
          this.message = err.error;
          this.progressBar = false;
          this.openSnackBar(this.message);
        } else {
          this.registered = false;
          this.progressBar = false;
          this.message = 'Error al registrarse';
        }
        console.log(err);
      });
    }
  }
  login(credentials) {
    this.userService.signUp(credentials).subscribe((response: any) => {

      // decode the response
      const decoded = jwt_decode(response.token);
      this.identity = decoded;

      if (!this.identity || !this.identity.IdUser) {
        this.spinnerService.hide();
      } else {
        // Show the generated object identity

        // Get the token
        this.userService.signUp(credentials).subscribe((response: any) => {

          this.token = response.token;
          if (this.token.length <= 0) {
            this.spinnerService.hide();
          } else {
            // decode the token
            localStorage.setItem('token', this.token);
            localStorage.setItem('identity', JSON.stringify(this.identity));
            this.idUser = this.identity.IdUser;
            this.userService.selectFirstCompany(this.idUser, this.token).subscribe((res: any) => {

              this.companyObject = res[0];
              if (res[0] === undefined) {
                localStorage.setItem('idCompany', 'not-defined');
                localStorage.setItem('step', '0');
                window.location.reload();
              } else {
                this.idCompany = this.companyObject.idCompany;
                this.companyName = this.companyObject.companyName;
                localStorage.setItem('idCompany', this.idCompany);
                localStorage.setItem('companyName', this.companyName);
                window.location.reload();
              }
            });
            this.openSnackBar('¡Te has registrado correctamente!');
            this.router.navigate(['inicio']);
          }
        }, err => {
          this.status = 'error';
        });
      }
    }, error => {
      const errorMessage = error;
      if (errorMessage != null) {
        const body = error.body;
        this.status = 'error';
      }
    });
  }
  spinnerShow(): void {
    this.spinnerService.show();
    setTimeout(() => {
      this.spinnerService.hide();
    }, 9000);
  }
  openSnackBar(message) {
    this.snackBar.openFromComponent(SnackBarSavedChangesComponent, {
      data: { message: message }, duration: 7000,
    });
  }
}
