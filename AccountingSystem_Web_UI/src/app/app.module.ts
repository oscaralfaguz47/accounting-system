import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';



// Routing
import { ROUTING, ROUTINGPROVIDERS } from './app.routing';

// Guards
import { LoggedinGuard } from './services/loggedin.guard';
import { LoggedoutGuard } from './services/loggedout.guard';
import { NoCompaniesGuard } from './services/noCompanies.guard';

// Material
import { MaterialModule } from './material/material.module';

// Externals
import { NgxSpinnerModule } from 'ngx-spinner';

// Components
import { AppComponent } from './app.component';
import { ExpenseRecordComponent } from './components/movements/expense-record/expense-record.component';
import { SalesRecordComponent } from './components/movements/sales-record/sales-record.component';
import { AdjustingEntriesComponent } from './components/movements/adjusting-entries/adjusting-entries.component';
import { MonthlyClosingComponent } from './components/movements/monthly-closing/monthly-closing.component';
import { AccountingAccountsComponent } from './components/maintenance/accounting-accounts/accounting-accounts.component';
import { UsersComponent } from './components/maintenance/users/users.component';
import { CompaniesComponent } from './components/maintenance/companies/companies.component';
import { HomeComponent } from './components/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidenavComponent } from './components/shared/sidenav/sidenav.component';
import { ConfigurationComponent } from './components/configuration/configuration.component';
import { MovementsComponent } from './components/movements/movements.component';
import { MaintenanceComponent } from './components/maintenance/maintenance.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from './services/user.service';
import { CompaniesService } from './services/companies.service';
import { CreateCompanyComponent } from './components/maintenance/companies/create-company/create-company.component';
import { ProvidersComponent } from './components/maintenance/providers/providers.component';
import { CustomersComponent } from './components/maintenance/customers/customers.component';
import { CustomerService } from './services/customers.service';
import { RouterModule } from '@angular/router';
import { SnackBarSavedChangesComponent } from './components/shared/snack-bar-saved-changes/snack-bar-saved-changes.component';
import { ConfirmationMessageComponent } from './components/shared/confirmation-message/confirmation-message.component';
import { CreateEditUserComponent } from './components/maintenance/users/create-edit-user/create-edit-user.component';
import { CreateEditProviderComponent } from './components/maintenance/providers/create-edit-provider/create-edit-provider.component';
import { CreateEditCustomerComponent } from './components/maintenance/customers/create-edit-customer/create-edit-customer.component';
import { CreateEditAccountingAccountsComponent } from './components/maintenance/accounting-accounts/create-edit-accounting-accounts/create-edit-accounting-accounts.component';
import { SeatDetailsComponent } from './components/movements/adjusting-entries/seat-details/seat-details.component';
import { ReportsComponent } from './components/reports/reports.component';
import { IncomeStatementComponent } from './components/reports/income-statement/income-statement.component';
import { BalanceSheetComponent } from './components/reports/balance-sheet/balance-sheet.component';
import { LoadingDialogComponent } from './components/shared/loading-dialog/loading-dialog.component';
import { MatDateFormats, MAT_DATE_FORMATS, NativeDateAdapter, DateAdapter } from '@angular/material';
import { AlertMessageComponent } from './components/shared/alert-message/alert-message.component';
import { NoOpeningSeatGuard } from './services/no-opening-seat.guard';
import { DataGlobalService } from './services/data-global.service';
import { SpinnerLoadingComponent } from './components/shared/spinner-loading/spinner-loading.component';

// const MY_DATE_FORMATS = {
//   parse: {
//     dateInput: { day: 'numeric', month: 'numeric', year: 'numeric' }
//   },
//   display: {
//     dateInput: 'input',
//     monthYearLabel: { year: 'numeric', month: 'short' },
//     dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
//     monthYearA11yLabel: { year: 'numeric', month: 'long' },
//   }
// };

export class AppDateAdapter extends NativeDateAdapter {

  // format(date: Date, displayFormat: Object): string {
  //   if (displayFormat === 'input') {
  //     const day = date.getDate();
  //     const month = date.getMonth() + 1;
  //     const year = date.getFullYear();
  //     return `${day}/${month}/${year}`;
  //   } else {
  //     return date.toDateString();
  //   }
  // }
}

@NgModule({
  declarations: [
    AppComponent,
    ExpenseRecordComponent,
    SalesRecordComponent,
    AdjustingEntriesComponent,
    MonthlyClosingComponent,
    AccountingAccountsComponent,
    UsersComponent,
    CompaniesComponent,
    HomeComponent,
    SidenavComponent,
    ConfigurationComponent,
    MovementsComponent,
    MaintenanceComponent,
    LoginComponent,
    RegisterComponent,
    CreateCompanyComponent,
    ProvidersComponent,
    CustomersComponent,
    SnackBarSavedChangesComponent,
    ConfirmationMessageComponent,
    CreateEditUserComponent,
    CreateEditProviderComponent,
    CreateEditCustomerComponent,
    CreateEditAccountingAccountsComponent,
    SeatDetailsComponent,
    ReportsComponent,
    IncomeStatementComponent,
    BalanceSheetComponent,
    LoadingDialogComponent,
    AlertMessageComponent,
    SpinnerLoadingComponent
  ],
  entryComponents: [
    CreateCompanyComponent,
    CreateEditUserComponent,
    CreateEditProviderComponent,
    CreateEditCustomerComponent,
    CreateEditAccountingAccountsComponent,
    SnackBarSavedChangesComponent,
    ConfirmationMessageComponent,
    LoadingDialogComponent,
    AlertMessageComponent
  ],
  imports: [
    BrowserModule,
    ROUTING,
    MaterialModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    RouterModule
  ],
  providers: [
    ROUTINGPROVIDERS,
    { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
    { provide: DateAdapter, useClass: AppDateAdapter },
   // { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    LoggedinGuard,
    LoggedoutGuard,
    NoCompaniesGuard,
    NoOpeningSeatGuard,
    UserService,
    CompaniesService,
    CustomerService,
    DataGlobalService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
