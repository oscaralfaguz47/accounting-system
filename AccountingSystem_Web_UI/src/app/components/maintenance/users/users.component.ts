import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { MatDialog, MatSnackBar, MatTableDataSource } from '@angular/material';
import { CreateEditUserComponent } from './create-edit-user/create-edit-user.component';
import { ConfirmationMessageComponent } from '../../shared/confirmation-message/confirmation-message.component';
import { SnackBarSavedChangesComponent } from '../../shared/snack-bar-saved-changes/snack-bar-saved-changes.component';
import { Overlay } from '@angular/cdk/overlay';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styles: [],
  providers: [UserService]
})
export class UsersComponent implements OnInit {
  displayedColumns = ['firstName', 'lastName', 'email', 'roll', 'status', 'icons'];
  dataSource: any = [];
  public parameters;
  public spinner: boolean = true;

  constructor(private userService: UserService, public dialog: MatDialog, private snackBar: MatSnackBar, private overlay: Overlay) { }

  ngOnInit() {
    this.getUsers();
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getUsers() {
    this.userService.getUsers().subscribe((res: any) => {
      this.dataSource = new MatTableDataSource(res);
      this.spinner = false;
    });
  }

  createUser() {
    this.parameters = {
      'title': 'Crear Nuevo Usuario'
    };
    this.openDialog();
  }

  updateUser(element) {
    console.log(element);
    this.parameters = {
      title: 'Editar Usuario',
      idUser: element.idUser,
      idRoll: element.idRoll,
      firstName: element.firstName,
      lastName: element.lastName,
      email: element.email,
      ocupation: element.ocupation,
    };
    console.log('the parameters are: ');
    console.log(this.parameters);
    this.openDialog();
  }

  changeUserStatus(idUser, status) {
    console.log(idUser);
    if (idUser.toString() === JSON.parse(localStorage.getItem('identity')).IdUser) {
      this.getUsers();
      this.openSnackBar('¡No puedes desactivar el usuario actual!');
    } else {
      if (status) {
        const title = 'Desactivar Usuario';
        const description = '¿Desea desactivar el usuario?';
        this.openConfirmationMessage(idUser, title, description);
      } else {
        const title = 'Activar Usuario';
        const description = '¿Desea activar el usuario?';
        this.openConfirmationMessage(idUser, title, description);
      }
    }
  }

  openConfirmationMessage(idUser, title, description): void {
    const dialogRef = this.dialog.open(ConfirmationMessageComponent, {
      data: { title: title, description: description }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (title === 'Activar Usuario') {
          this.userService.activateUser(idUser).subscribe((response) => {
            this.getUsers();
            this.openSnackBar('¡Usuario Activado!');
          }, err => {
            this.openSnackBar('¡Error de servidor!');
            console.log(err);
          });
        } else {
          this.userService.deactivateUser(idUser).subscribe((response) => {
            this.getUsers();
            this.openSnackBar('¡Usuario Desactivado!');
          }, err => {
            this.openSnackBar('¡Error de servidor!');
            console.log(err);
          });
        }
      } else {
        this.dataSource = this.userService.getUsers();
      }
    });
  }

  openSnackBar(message):void {
    this.snackBar.openFromComponent(SnackBarSavedChangesComponent, {
      data: { message: message }, duration: 2000
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CreateEditUserComponent, {
      data: this.parameters,
      maxWidth: '100%',
      scrollStrategy: this.overlay.scrollStrategies.noop()
    });
    dialogRef.afterClosed().subscribe(result => {
      this.getUsers();
    });
  }

}
