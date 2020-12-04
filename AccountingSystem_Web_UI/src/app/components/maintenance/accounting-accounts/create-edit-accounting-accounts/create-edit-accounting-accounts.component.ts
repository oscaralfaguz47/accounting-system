import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FirstCategoryAccoutsService } from '../../../../services/first-category-accouts.service';
import { SecondCategoryAccountsService } from '../../../../services/second-category-accounts.service';
import { AccountAffectationsService } from 'src/app/services/account-affectations.service';
import { AccountingAccoutsService } from '../../../../services/accounting-accouts.service';
import { SnackBarSavedChangesComponent } from 'src/app/components/shared/snack-bar-saved-changes/snack-bar-saved-changes.component';

export class Categories {
  public id;
  public name;
}

@Component({
  selector: 'app-create-edit-accounting-accounts',
  templateUrl: './create-edit-accounting-accounts.component.html',
  styles: [],
  providers: [
    FirstCategoryAccoutsService,
    SecondCategoryAccountsService,
    AccountAffectationsService,
    AccountingAccoutsService
  ]
})
export class CreateEditAccountingAccountsComponent implements OnInit {

  public progressBar;
  public title;
  public accountsForm: FormGroup;
  public accountingAccount = {};
  public idCompany;
  public firstCategoryAccounts: Categories;
  public secondCategoryAccounts: Categories;
  public accountAffectation: Categories;
  public secondCategoryDisabled;
  public disabled;

  constructor(private formBuilder: FormBuilder,
              private accountingAccountsService: AccountingAccoutsService,
              private firstCategoryAccountsService: FirstCategoryAccoutsService,
              private secondCategoryAccountsService: SecondCategoryAccountsService,
              private accountAffectationsService: AccountAffectationsService,
              private snackBar: MatSnackBar,
              private dialog: MatDialogRef<CreateEditAccountingAccountsComponent>,
              @Inject(MAT_DIALOG_DATA) public data) {
    this.progressBar = false;
    this.title = data.title;
    this.idCompany = localStorage.getItem('idCompany');
    this.chargeFirstCateforyAccoutsDropdown();
    this.chargeAccountAffectationsDropdown();
    if (data.title === 'Ingresar Nueva Cuenta') {
      data.description = '';
      this.secondCategoryDisabled = true;
       this.formCreateAccount();
       this.disabled = false;
    } else {
      this.formUpdateAccount();
      this.disabled = true;
    }
  }

  ngOnInit() {
  }

  enableSubCategory(idFirstCategoryAccount) {
    this.secondCategoryDisabled = false;
    this.secondCategoryAccountsService.getSecondCategoryAccounts(idFirstCategoryAccount).subscribe((res: any) => {
      this.secondCategoryAccounts = res;
    });
  }

  chargeFirstCateforyAccoutsDropdown() {
    this.firstCategoryAccountsService.getFirstCategoryAccounts().subscribe((res: any) => {
      this.firstCategoryAccounts = res;
    });
  }

  chargeAccountAffectationsDropdown() {
    this.accountAffectationsService.getAccountAffectations().subscribe((res: any) => {
      this.accountAffectation = res;
    });
  }

  formCreateAccount() {
    this.accountsForm = this.formBuilder.group({
      accountName: ['', Validators.required],
      idAccountFirstCategory: ['', Validators.required],
      idAccountSecondCategory: ['', Validators.required],
      idAccountAffectation: ['', Validators.required],
      description: ['']
    });
  }

  formUpdateAccount() {
    this.accountsForm = this.formBuilder.group({
      accountName: ['', Validators.required],
      idAccountFirstCategory: [''],
      idAccountSecondCategory: [''],
      idAccountAffectation: [''],
      description: ['']
    });
  }

  onSubmit() {
    if (this.title === 'Ingresar Nueva Cuenta') {
      this.createAccount();
    } else {
       this.updateAccount();
    }
  }

  createAccount() {
    this.accountingAccount = {
      IdCompany: this.idCompany,
      IdAccountFirstCategory: this.accountsForm.value.idAccountFirstCategory,
      IdAccountSecondCategory: this.accountsForm.value.idAccountSecondCategory,
      IdAccountAffectation: this.accountsForm.value.idAccountAffectation,
      AccountName: this.accountsForm.value.accountName,
      Description: this.accountsForm.value.description
    };
    if (this.accountsForm.valid) {
      this.progressBar = true;
      this.accountingAccountsService.createAccountingAccount(this.accountsForm.value.idAccountFirstCategory, this.accountingAccount)
      .subscribe((response) => {
        this.openSnackBar('¡Cuenta Creada!');
        this.closeDialog();
      }, err => {
        this.closeDialog();
        this.openSnackBar('¡Error de servidor!');
        console.log(err);
      });
    }
  }

  updateAccount() {
    this.accountingAccount = {
      IdAccountingAccount: this.data.idAccountingAccount,
      AccountName: this.accountsForm.value.accountName,
      Description: this.accountsForm.value.description
    };
     console.log(this.accountingAccount);
    if (this.accountsForm.valid) {
      this.progressBar = true;
      this.accountingAccountsService.updateAccountingAccount(this.accountingAccount).subscribe((response) => {
        this.openSnackBar('¡Cuenta Actualizada!');
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
