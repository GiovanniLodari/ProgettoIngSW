import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { InfoPopupComponent } from '../infoPopup/infoPopup.component';
import { EditUnitPopupComponent } from '../edit-file-popup/edit-file-popup.component';
import { DescriptionPopupComponent } from '../description-popup/description-popup.component';
import { Router } from '@angular/router';
import { Observable, of, pipe } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  files: any[] = [];
  tableColumns: string[] = ['position', 'name', 'actions'];
  tableColumnsDipendenti: string[] = ['position', 'surname', 'name', 'CF', 'actions'];
  title: string = '';
  section: string = '';
  errorMessage : string = '';

  constructor(
      private http: HttpClient,
      private dialog: MatDialog,
      private route: ActivatedRoute,
      private router: Router
    ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.title = params['titolo'];
      this.section = params['sezione'];
    });
    console.log(this.title);
    this.getFiles(this.section);
  }

  goBack(){
    const queryParams = { check:"true" };
    this.router.navigate(['/home'], { queryParams });
  }

  compareByName(a: any, b: any): number {
    const nameA = a.nome.toUpperCase();
    const nameB = b.nome.toUpperCase();
    if (nameA < nameB) {
      return -1;
    } else if (nameA > nameB) {
      return 1;
    } else {
      return 0;
    }
  }

  compareBySurname(a: any, b: any): number {
    const surnameA = a.cognome.toUpperCase();
    const surnameB = b.cognome.toUpperCase();
    if (surnameA < surnameB) {
      return -1;
    } else if (surnameA > surnameB) {
      return 1;
    } else {
      return 0;
    }
  }

  openDescriptionPopup(): void {
    const dialogRef = this.dialog.open(InfoPopupComponent, {
      data: {
        title: 'Assistenza',
        description: 'In questa sezione è possibile visualizzare un elenco dettagliato di '+this.title+'. Nello specifico, è possibile visualizzarne i dettagli e apportare modifiche a ciascun elemento presente di seguito.'
      }
    });
  }

  getFiles(section: string) {
    console.log(section);
    this.http.post<any>('http://localhost:8080/files', section).subscribe(
      response => {
        const attributes = response;
        console.log(attributes);
        switch (section) {
          case 'Ruoli':
            this.files = attributes;
            this.files = attributes.sort(this.compareByName)
            break;
          case 'Dipendenti':
            console.log(attributes);
            this.files = attributes;
            this.files = attributes.sort(this.compareBySurname)
            break;
          default:
            break;
        }
      },
      error => {
        console.error('Errore durante il recupero dei dati:', error);
        this.errorMessage = 'Si è verificato un errore durante il recupero dei dati.';
      }
    );
  }

  editFile(title: string, fileName: string): void {
    let titolo: string = '';
    console.log(fileName);
    switch (title) {
      case 'Ruoli': titolo = 'ruolo';break;
      case 'Dipendenti': titolo = 'dipendente'; break;
    }
    const dialogRef = this.dialog.open(EditUnitPopupComponent, {
      data: {
        title: 'Modifica ' + titolo,
        sectionTitle: title,
        editData: fileName
      }
    });
    dialogRef.afterClosed().subscribe(() => {
      window.location.reload();
    });
  }

  openFile(fileName: string, title: string): void {
    let titolo: string = '';
    console.log(fileName);
    switch (title) {
      case 'Ruoli': titolo = 'ruolo';break;
      case 'Dipendenti': titolo = 'dipendente'; break;
    }
    const dialogRef = this.dialog.open(DescriptionPopupComponent, {
      data: {
        title: 'Dettagli ' + titolo,
        sectionTitle: title,
        editData: fileName
      }
    });
    dialogRef.afterClosed().subscribe(() => {
      window.location.reload();
    });
  }

  deleteRole(fileName: string): void {
    this.checkRoleDelete(fileName).subscribe(check => {
      if (!check) {
        window.alert("Non è possibile eliminare il ruolo perché è assegnato ad una o più unità o dipendenti.");
      } else {
        if (confirm("Sei sicuro di voler procedere?")) {
          this.http.post('http://localhost:8080/deleteRole', fileName).subscribe(
            response => {
              window.location.reload();
            },
            error => {
              console.error('Errore durante l\'eliminazione del ruolo:', error);
            }
          );
        }
      }
    });
  }

  checkRoleDelete(role: any): Observable<boolean> {
    return this.http.post<string>('http://localhost:8080/checRoleDelete', role).pipe(
      //tap(response => console.log('Risposta ricevuta:', response)),
      map(response => response === "true"),
      catchError(error => {
        console.error('Errore durante il recupero dei dati', error);
        return of(false);
      })
    );
  }

  deleteEmployee(fileName: string): void {
    if (confirm("Sei sicuro di voler procedere?\nSe il dipendente selezionato è assegnato ad un unità organizzativa, esso verrà rimosso.")) {
      this.http.post('http://localhost:8080/deleteEmployee', fileName).subscribe(
        response => {
          window.location.reload();
        },
        error => {
          console.error('Errore durante l\'eliminazione del dipendente:', error);
        }
      );
    }
  }

}
