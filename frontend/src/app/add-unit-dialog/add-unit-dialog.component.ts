import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-unit-dialog',
  templateUrl: './add-unit-dialog.component.html',
  styleUrls: ['./add-unit-dialog.component.css']
})
export class AddUnitDialogComponent implements OnInit {
  organizationalUnits: string[] = [];
  selectedUnit: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private dialogRef: MatDialogRef<AddUnitDialogComponent>
  ) {
    this.organizationalUnits = data.organizationalUnitsList;
    this.dialogRef.disableClose = true;
  }

  ngOnInit(): void{}

  confirm(): void {
    this.dialogRef.close(this.selectedUnit);
  }

  cancel(): void {
    this.dialogRef.close();
  }

  getOrganizationalUnits() {
    this.http.get<any[]>('http://localhost:8080/organizational-units').subscribe(
      units => {
        this.organizationalUnits = units.map(unit => unit.nome);
        this.organizationalUnits.sort();
      },
      error => {
        console.error('Errore durante il recupero delle unità organizzative:', error);
      }
    );
  }
}
