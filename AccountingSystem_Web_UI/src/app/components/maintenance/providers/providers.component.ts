import { Component, OnInit } from '@angular/core';
import { ProvidersService } from '../../../services/providers.service';
import { MatDialog, MatSnackBar, MatTableDataSource } from '@angular/material';
import { CreateEditProviderComponent } from './create-edit-provider/create-edit-provider.component';
import { element } from 'protractor';
import { ConfirmationMessageComponent } from '../../shared/confirmation-message/confirmation-message.component';
import { SnackBarSavedChangesComponent } from '../../shared/snack-bar-saved-changes/snack-bar-saved-changes.component';
import { Overlay } from '@angular/cdk/overlay';

@Component({
  selector: 'app-providers',
  templateUrl: './providers.component.html',
  styles: [],
  providers: [ProvidersService]
})
export class ProvidersComponent implements OnInit {

  public dataSource: any = [];
  displayedColumns: string[] = ['name', 'identification', 'email', 'telephone', 'icons'];
  public parameters = {};
  public companyName;
  public spinner: boolean = true;
  public data = [];

  constructor(private providersService: ProvidersService, public dialog: MatDialog, private snackBar: MatSnackBar, 
    private overlay: Overlay) {
    this.companyName = localStorage.getItem('companyName');
  }

  ngOnInit() {
    this.getProviders();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  getProviders() {
    this.providersService.getProviders().subscribe((res: any) => {
      this.data = res;
      this.dataSource = new MatTableDataSource(res);
      this.spinner = false;
    });
  }

  createProvider() {
    this.parameters = {
      title: 'Ingresar Nuevo Proveedor'
    };
    this.openDialog();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CreateEditProviderComponent, {
      data: this.parameters,
      maxWidth: '100%',
      scrollStrategy: this.overlay.scrollStrategies.noop()
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getProviders();
    });
  }

  updateProvider(element) {
    console.log(element);
    this.parameters = {
      idProvider: element.idProvider,
      name: element.name,
      identification: element.identification,
      email: element.email,
      telephone: element.telephone,
      address: element.address,
      title: 'Editar Proveedor'
    };
    console.log('Parameters: ' + this.parameters);
    this.openDialog();
  }

  deleteProvider(idProvider) {
    this.openConfirmationMessage(idProvider);
  }

  openConfirmationMessage(idProvider): void {
    const dialogRef = this.dialog.open(ConfirmationMessageComponent, {
      data: { 'title': 'Eliminar Proveedor', 'description': '¿Deseas eliminar el proveedor?' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.providersService.deleteProvider(idProvider).subscribe((response) => {
          this.getProviders();
          this.openSnackBar('¡Proveedor eliminado!');
        }, err => {
          this.openSnackBar('¡Error de servidor!');
          console.log(err);
        });
      }
    });
  }

  openSnackBar(message):void {
    this.snackBar.openFromComponent(SnackBarSavedChangesComponent, {
      data: { message: message }, duration: 2000
    });
  }

}
