import { Component, OnInit, ChangeDetectorRef, DoCheck, ElementRef, ViewChild, Input } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';
import { CompaniesService } from '../../../services/companies.service';
import { SnackBarSavedChangesComponent } from '../snack-bar-saved-changes/snack-bar-saved-changes.component';
import { MatDialog, MatSnackBar } from '@angular/material';
import { JournalMovementsService } from '../../../services/journal-movements.service';
import { ConfirmationMessageComponent } from '../confirmation-message/confirmation-message.component';

export class Company {
  public idCompany;
  public companyName;
}

declare var myExtObject: any;


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styles: [],
  providers: [UserService, CompaniesService]
})
export class SidenavComponent implements OnInit, DoCheck {

  @ViewChild('snav', { static: false }) private snav: any;
  public token;
  public idUser;
  public companySelected: any = {};
  public companies: any = [];
  public identity;
  public company: Company;
  public idCompany;
  public companyName;
  public userHasCompanies: boolean = false;
  screenWidth: number;


  constructor(
    private journalMovementsService: JournalMovementsService,
    private snackBar: MatSnackBar,
    private userService: UserService,
    private companyService: CompaniesService,
    changeDetectorRef: ChangeDetectorRef,
     media: MediaMatcher,
    private router: Router,
    public dialog: MatDialog) {
    this.idCompany = localStorage.getItem('idCompany');
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();

    this.idUser = this.userService.getIdentity().IdUser;

    this.mobileQuery.addListener(this._mobileQueryListener);
    this.getCompanies();

    // set screenWidth on page load
    this.screenWidth = window.innerWidth;
    window.onresize = () => {
      // set screenWidth on screen size change
      this.screenWidth = window.innerWidth;
    };
  }
  mobileQuery: MediaQueryList;


  // tslint:disable-next-line: variable-name
  private _mobileQueryListener: () => void;

  shouldRun = true;

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy(): void {
    // tslint:disable-next-line: deprecation
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.verifyUserHasCompaniesAndOpeningSeat();
    this.token = this.userService.getTockenLocalStorage();
  }



  verifyUserHasCompaniesAndOpeningSeat() {

    if (localStorage.getItem('idCompany') === 'not-defined') {
      this.userHasCompanies = false;

    } else {
      this.userHasCompanies = true;
    }
  }
validate(origin){
  if (localStorage.getItem('idCompany') === 'not-defined') {
       this.openSnackBar('Para acceder debes de crear una empresa');
  } else {
    if (localStorage.getItem('openingSeat') === 'false' && origin !== 'configuration') {
      this.openSnackBar('Para acceder debes de crear el asiento de apertura');
    }
  }
}
  getCompanies() {
    this.companyService.companiesSelect(this.idUser).subscribe((res: any) => {
      this.company = res;
    });
  }
  ngDoCheck() {
    this.idCompany = localStorage.getItem('idCompany');
    this.companyName = localStorage.getItem('companyName');
    this.token = this.userService.getTockenLocalStorage();
    this.idUser = this.userService.getIdentity().IdUser;
  }

  onCompanySelected(val: Company) {
    localStorage.setItem('idCompany', val.idCompany);
    localStorage.setItem('companyName', val.companyName);
    window.location.reload();
  }
  updateCompanyDropdown() {
    this.getCompanies();
  }
  closeSideNav() {
    if (this.screenWidth < 840) {
      this.snav.close();
    }
  }
  openSnackBar(message) {
    this.snackBar.openFromComponent(SnackBarSavedChangesComponent, {
      data: { message: message }, duration: 2000,
    });
  }
  logout() {
    localStorage.clear();
    this.token = null;
    this.identity = null;
    this.idUser = null;
    this.router.navigate(['login']);
  }
  openConfirmationMessage(): void {
    const dialogRef = this.dialog.open(ConfirmationMessageComponent, {
      data: { 'title': 'Cerrar Sesión', 'description': '¿Deseas cerrar la sesión?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.logout();
      }
    });
  }
}
