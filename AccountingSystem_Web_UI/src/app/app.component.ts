import { Component, OnInit, DoCheck, Input } from '@angular/core';
import { UserService } from './services/user.service';
import { Router } from '@angular/router';
import { MonthlyClosingsService } from './services/monthly-closings.service';
import { JournalMovementsService } from './services/journal-movements.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})
export class AppComponent implements OnInit, DoCheck {
  

  public token;
  public identity;
  public fillerNav = [];
  public idCompany;


  constructor( private journalMovementsService: JournalMovementsService,
    public monthlyClosingService: MonthlyClosingsService, private router: Router, private userService: UserService) {
    this.token = this.userService.getTockenLocalStorage();
    this.identity = this.userService.getIdentity();
    this.idCompany = localStorage.getItem('idCompany');
  }

  ngOnInit() {
    this.selectOpeningSeat();
    
  }

  selectOpeningSeat() {
    if (localStorage.getItem('idCompany') !== 'not-defined') {
      this.journalMovementsService.getOpeningSeatJournalMovements(this.idCompany).subscribe((res: any) => {
        if (res.length !== 0) {
          localStorage.setItem('openingSeat', 'true');
          localStorage.setItem('opseat', JSON.stringify(res));
       
        } else {
          localStorage.setItem('openingSeat', 'false');
     
        }
        if(localStorage.getItem('openingSeat') === 'true') {
          this.router.navigate(['inicio']);
        } else {
          this.router.navigate(['configuracion/asiento-apertura']);
        }
        this.idCompany = localStorage.getItem('idCompany');
      });
    } 
  }

  
  ngDoCheck() {
    this.token = this.userService.getTockenLocalStorage();
    this.identity = this.userService.getIdentity();
  }

}
