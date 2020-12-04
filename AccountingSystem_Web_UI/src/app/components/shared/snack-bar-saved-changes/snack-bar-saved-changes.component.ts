import { Component, OnInit, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS, MAT_SNACK_BAR_DATA } from '@angular/material';

@Component({
  selector: 'app-snack-bar-saved-changes',
  templateUrl: './snack-bar-saved-changes.component.html',
  styles: [],
  providers:[{provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2000}}]
})
export class SnackBarSavedChangesComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }

  ngOnInit() {
  }

}
