import { Component, OnInit, Input } from '@angular/core';
import { JournalMovementsService } from '../../../../services/journal-movements.service';
import { MonthlyClosingsService } from '../../../../services/monthly-closings.service';

@Component({
  selector: 'app-seat-details',
  templateUrl: './seat-details.component.html',
  styles: [],
  providers: [JournalMovementsService, MonthlyClosingsService]
})
export class SeatDetailsComponent implements OnInit {

  @Input()
  public seatElement;
  displayedColumns: string[] = ['accountingAccount', 'accountAffectation', 'totalAmount', 'description'];
  public journalMovements = [];
  public monthlyClosings = [];
  public monthlyClosing;

  constructor(private monthlyClosingsService: MonthlyClosingsService, private journalMovementsService: JournalMovementsService) { }

  ngOnInit() {
    console.log(this.seatElement);
    this.getJournalMovements();
    this.getMonthlyClosings();
  }

  getJournalMovements() {
    this.journalMovementsService.getDetailedJournalMovements(this.seatElement.idJournalSeat).subscribe((res: any) => {
      this.journalMovements = res;
    });
  }

  getMonthlyClosings() {
    this.monthlyClosingsService.selectMonthlyClosings().subscribe((res: any) => {
      this.monthlyClosings = res;
      const indexMonthlyClosing = res.findIndex(res => res.idMonthlyClosing === this.seatElement.idMonthlyClosing);
      if (indexMonthlyClosing >= 0) {
        this.monthlyClosing = '' + this.monthlyClosings[indexMonthlyClosing].month + '/' + this.monthlyClosings[indexMonthlyClosing].year;
      } else {
        this.monthlyClosing = 'Este asiento no pertenece a un cierre mensual';
      }
     
    });
  }

}
