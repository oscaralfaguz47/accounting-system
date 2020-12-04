import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import * as jwt_decode from 'jwt-decode';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {

  public token;
  public status: string;
  public identity;
  public idUser;
  public idCompany;
  public companyName;
  public companyObject: any = {};
  public credentials = {};
  public loginForm: FormGroup;

  constructor(private spinnerService: NgxSpinnerService,
    private userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.credentials = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };
      // Login the user and to get the object identity
      this.spinnerShow();
      this.userService.signUp(this.credentials).subscribe((response: any) => {

        // decode the response
        const decoded = jwt_decode(response.token);
        this.identity = decoded;

        if (!this.identity || !this.identity.IdUser) {
          this.spinnerService.hide();
        } else {
          // Show the generated object identity

          // Get the token
          this.userService.signUp(this.credentials).subscribe((response: any) => {

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

              this.router.navigate(['inicio']);
            }
          }, err => {
            this.status = 'error';
            this.spinnerService.hide();
          });
        }
      }, error => {
        const errorMessage = error;
        if (errorMessage != null) {
          const body = error.body;
          this.status = 'error';
          this.spinnerService.hide();
        }
      });
    }
  }

  spinnerShow(): void {
    this.spinnerService.show();
    setTimeout(() => {
      this.spinnerService.hide();
    }, 100000);
  }
  spinnerHide() {
    this.spinnerService.hide();
  }
}
