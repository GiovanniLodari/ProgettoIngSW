import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-edit-organigram-component',
  templateUrl: './edit-organigram-component.component.html',
  styleUrls: ['./edit-organigram-component.component.css']
})
export class EditOrganigramComponentComponent {
  dataLoaded: boolean = true;
  section: string = 'Organigrammi';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private dialogRef: MatDialogRef<EditOrganigramComponentComponent>
  ) {
      this.editData = data.editData;
      this.dialogRef.disableClose = true;
    }
  editData: string = '';
  organigramName: string = '';
  errorMessage: string = '';

  ngOnInit() {
    this.getFile(this.data.editData);
  }

  confirmEdit(): void {
    this.dialogRef.close();
  }

  cancelEdit(): void {
    this.dialogRef.close();
  }

  getFile(file: any) {
    console.log(file);
    this.http.post<any>('http://localhost:8080/getOrganigram', file).subscribe(
      response => {
        const attributes = response;
        console.log(attributes);
        this.organigramName = attributes.nome;
      },
      error => {
        console.error('Errore durante il recupero dei dati:', error);
      });
  }

  updateOrganigram(): void {
    if (confirm("Sei sicuro di voler procedere?")) {
      if (this.organigramName) {
        this.http.post('http://localhost:8080/edit-organigram', this.organigramName).subscribe(
          response => {
            console.log('Organigramma modificato correttamente:', response);
            this.dialogRef.close();
          },
          error => {
            console.error('Errore durante la modifica dell\'organigramma:', error);
            this.errorMessage = 'Errore durante la modifica dell\'organigramma';
          }
        );
      } else {
        this.errorMessage = 'Per favore, riempi tutti i campi obbligatori (*).';
      }
    }
  }
}
