import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CreateCompanyComponent } from '../maintenance/companies/create-company/create-company.component';
import { Overlay } from '@angular/cdk/overlay';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls:['./home.component.css']
})
export class HomeComponent implements OnInit {

  public parameters = {};
  public idCompany;
  public userName: string;
  public date: any;

  constructor(public dialog: MatDialog, private overlay: Overlay) {
    this.idCompany = localStorage.getItem('idCompany');
    const currentDate = new Date();
    this.date = currentDate.getDay() + '-' + currentDate.getMonth() + '-' + currentDate.getFullYear();

    console.log(this.date);
   }

  ngOnInit() {
    this.userName = JSON.parse(localStorage.getItem('identity')).FirstName;
  }

  createCompany() {
    this.parameters = {
      'title': 'Crear Nueva Empresa'
    };
    this.openDialog();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CreateCompanyComponent, {
      data: this.parameters,
      maxWidth: '95%',
      scrollStrategy: this.overlay.scrollStrategies.noop()
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
