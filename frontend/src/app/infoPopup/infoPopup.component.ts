import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-info-popup',
  templateUrl: './infoPopup.component.html',
  styleUrls: ['./infoPopup.component.css']
})
export class InfoPopupComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}

