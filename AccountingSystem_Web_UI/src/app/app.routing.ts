import { ModuleWithProviders, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Components
import { HomeComponent } from './components/home/home.component';
import { AccountingAccountsComponent } from './components/maintenance/accounting-accounts/accounting-accounts.component';
import { AdjustingEntriesComponent } from './components/movements/adjusting-entries/adjusting-entries.component';
import { CompaniesComponent } from './components/maintenance/companies/companies.component';
import { MonthlyClosingComponent } from './components/movements/monthly-closing/monthly-closing.component';
import { UsersComponent } from './components/maintenance/users/users.component';
import { ExpenseRecordComponent } from './components/movements/expense-record/expense-record.component';
import { SalesRecordComponent } from './components/movements/sales-record/sales-record.component';
import { ConfigurationComponent } from './components/configuration/configuration.component';
import { MovementsComponent } from './components/movements/movements.component';
import { MaintenanceComponent } from './components/maintenance/maintenance.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { LoggedinGuard } from './services/loggedin.guard';
import { LoggedoutGuard } from './services/loggedout.guard';
import { ProvidersComponent } from './components/maintenance/providers/providers.component';
import { CustomersComponent } from './components/maintenance/customers/customers.component';
import { NoCompaniesGuard } from './services/noCompanies.guard';
import { ReportsComponent } from './components/reports/reports.component';
import { IncomeStatementComponent } from './components/reports/income-statement/income-statement.component';
import { BalanceSheetComponent } from './components/reports/balance-sheet/balance-sheet.component';
import { NoOpeningSeatGuard } from './services/no-opening-seat.guard';

// Guards



const APPROUTES: Routes = [
    { path: 'inicio', component: HomeComponent, canActivate: [LoggedinGuard] },
    {
        path: 'configuracion/asiento-apertura', component: ConfigurationComponent, canActivate: [LoggedinGuard, NoCompaniesGuard],
    },
    {
        path: 'movimientos', component: MovementsComponent, canActivate: [LoggedinGuard, NoCompaniesGuard, NoOpeningSeatGuard], children: [
            { path: 'registro-ventas', component: SalesRecordComponent, canActivate:[NoOpeningSeatGuard] },
            { path: 'registro-gastos', component: ExpenseRecordComponent, canActivate:[NoOpeningSeatGuard] },
            { path: 'asientos-ajustes', component: AdjustingEntriesComponent, canActivate:[NoOpeningSeatGuard] },
            { path: 'cierre-mensual', component: MonthlyClosingComponent, canActivate:[NoOpeningSeatGuard] },
            { path: '', redirectTo: 'registro-ventas', pathMatch: 'full' },
        ]
    },

    {
        path: 'mantenimiento', component: MaintenanceComponent, canActivate: [LoggedinGuard, NoCompaniesGuard, NoOpeningSeatGuard], children: [
            { path: 'cuentas-contables', component: AccountingAccountsComponent, canActivate:[NoOpeningSeatGuard] },
            { path: 'usuarios', component: UsersComponent, canActivate:[NoOpeningSeatGuard] },
            { path: 'empresas', component: CompaniesComponent, canActivate:[NoOpeningSeatGuard] },
            { path: 'proveedores', component: ProvidersComponent, canActivate:[NoOpeningSeatGuard] },
            { path: 'clientes', component: CustomersComponent, canActivate:[NoOpeningSeatGuard] },
            { path: '', redirectTo: 'cuentas-contables', pathMatch: 'full' }
        ]
    },
    {
        path: 'reportes', component: ReportsComponent, canActivate: [LoggedinGuard, NoCompaniesGuard, NoOpeningSeatGuard], children: [
            { path: 'estado-resultados', component: IncomeStatementComponent, canActivate:[NoOpeningSeatGuard] },
            { path: 'balance-situacion', component: BalanceSheetComponent, canActivate:[NoOpeningSeatGuard] },
            { path: '', redirectTo: 'estado-resultados', pathMatch: 'full' }
        ]
    },
    { path: 'registro', component: RegisterComponent, canActivate: [LoggedoutGuard] },
    { path: 'login', component: LoginComponent, canActivate: [LoggedoutGuard] },


    { path: '', redirectTo: 'inicio', pathMatch: 'full', canActivate: [LoggedinGuard] },
    { path: '**', component: HomeComponent, canActivate: [LoggedinGuard] }
];




export const ROUTINGPROVIDERS: any[] = [];
export const ROUTING: ModuleWithProviders = RouterModule.forRoot(APPROUTES);
