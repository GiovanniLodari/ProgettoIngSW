import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

interface Dipendente {
  nome: string;
  cognome: string;
  cf: string;
}

interface DetailsPopupData {
  title: string;
  listaRuoli: string[];
  listaDipendenti: Dipendente[];
}

@Component({
  selector: 'app-details-popup',
  templateUrl: './details-popup.component.html',
  styleUrls: ['./details-popup.component.css']
})
export class DetailsPopupComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DetailsPopupData, private http: HttpClient,
  private dialogRef: MatDialogRef<DetailsPopupComponent>) {
  this.dialogRef.disableClose = true;
  }

  tableColumnsDipendenti: string[] = ['position', 'surname', 'name', 'CF', 'actions'];

  ngOnInit(): void {
    console.log(this.data.listaRuoli);
    console.log(this.data.listaDipendenti);
  }

  confirm(): void {this.dialogRef.close(this.data.listaDipendenti);}

  removeEmployeeFromUnit(codiceFiscale: string, nomeUnita: string): void{
    if(confirm('Sei sicuro di voler rimuovere il dipendente dall\'unità?')){
      this.data.listaDipendenti = this.data.listaDipendenti.filter(dipendente => dipendente.cf !== codiceFiscale);
    /*
      const url = `http://localhost:8080/removeEmployee?codiceFiscale=${codiceFiscale}&nomeUnita=${nomeUnita}`;
      console.log(codiceFiscale);
      this.http.delete(url).subscribe(
        () => {
          console.log('Dipendente rimosso dall\'unità con successo');
        },
        () => {
          console.log('Errore durante la cancellazione del dipendente dall\'unità');
        }
      );
    */
    }
  }

}

