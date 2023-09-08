import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { InfoPopupComponent } from '../infoPopup/infoPopup.component';
import { AddFilePopupComponent } from '../add-file-popup/add-file-popup.component';
import { EditUnitPopupComponent } from '../edit-file-popup/edit-file-popup.component';
import { Location } from '@angular/common';
import { TableComponent } from '../table/table.component';
import { DescriptionPopupComponent } from '../description-popup/description-popup.component';
import { EditOrganigramComponentComponent } from '../edit-organigram-component/edit-organigram-component.component';
import { TreeComponent } from '../tree/tree.component';
import { Observable, of, pipe } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {
  organigramName: string = '';
  organigramList: string[] = [];

  sections: { title: string, files: { name: string }[] }[] = [
    { title: 'Organigrammi', files: [] },
    { title: 'Unità Organizzative', files: [] },
    { title: 'Ruoli', files: [] },
    { title: 'Dipendenti', files: [] }
  ];

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
  var check: string = "";
    this.route.queryParams.subscribe(params => {
      check = params['check'];
    });
    if(check === "false" || check === undefined){this.router.navigate(['/']);}
    this.fetchFiles();
    console.log(this.sections);
  }

  fetchFiles(): void {
    this.getRoles();
    this.getOrganizationalUnits();
    this.getOrganigrams();
  }

  redirectToLoginPage(): void {
    window.location.href = '/';
  }

  openDescriptionPopup(): void {
    const dialogRef = this.dialog.open(InfoPopupComponent, {
      data: {
        title: 'Assistenza',
        description: 'Realizzare innanzitto i componenti base e, solo successivamente, l\'intero organigramma.'
      }
    });
  }

  openTableComponent(section: { title: string }): void {
    var titolo = '';
    var sezione = '';
    switch (section.title) {
      case 'Ruoli':
        titolo = 'ruoli'; sezione = 'Ruoli';
        console.log(titolo); console.log(sezione);
        this.router.navigate(['/table'], {queryParams: { titolo: titolo, sezione: sezione }});
        break;
      case 'Dipendenti':
        console.log(section.title);
        titolo = 'dipendenti'; sezione = 'Dipendenti';
        this.router.navigate(['/table'], {queryParams: { titolo: titolo, sezione: sezione }});
        break;
      }
    }

  openAddFilePopup(section: { title: string }): void {
    let titolo: string = '';
    switch (section.title) {
      case 'Ruoli':
        titolo = 'ruolo';
        break;
      case 'Dipendenti':
        titolo = 'dipendente';
        break;
      case 'Organigrammi':
        titolo = 'organigramma';
        break;
      case 'Unità Organizzative':
        titolo = 'unità organizzativa';
        break;
    }
    const dialogRef = this.dialog.open(AddFilePopupComponent, {
      data: {
        title: 'Aggiungi ' + titolo,
        section: section
      }
    });
    dialogRef.afterClosed().subscribe(() => {
      window.location.reload();
    });
  }

  openFile(fileName: string, title: string): void {
      let titolo: string = '';
      switch (title) {
        case 'Organigrammi': titolo = 'organigrammi';break;
        case 'Unità Organizzative': titolo = 'unità organizzative'; break;
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
      }
    );
  }

  editOrganigram(fileName: any): void{
    console.log(fileName);
    const dialogRef = this.dialog.open(EditOrganigramComponentComponent, {
      data: {
        title: 'Modifica organigramma',
        editData: fileName
      }
    });
    dialogRef.afterClosed().subscribe(() => {
      window.location.reload();
    });
  }

  openOrganigram(file: any): void {
    this.router.navigate(['/tree'], {queryParams: {organigramName: file}});
  }

  deleteOrganigram(file: any): void{
    if (confirm("Sei sicuro di voler procedere?")) {
      console.log(file);
      this.http.post('http://localhost:8080/delete-organigram', file).subscribe(
        response => {
          window.location.reload();
        },
        error => {
          console.error('Errore durante l\'eliminazione dell\'organigramma:', error);
        }
      );
    }
  }

  editUnit(title: string, fileName: string): void {
    let titolo: string = '';
    console.log(fileName);
    switch (title) {
      case 'Organigrammi': titolo = 'organigramma'; break;
      case 'Unità Organizzative': titolo = 'unità organizzativa'; break;
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

  checkUnitDelete(unit: any): Observable<boolean> {
    return this.http.post<string>('http://localhost:8080/checkUnitDelete', unit.name).pipe(
      //tap(response => console.log('Risposta ricevuta:', response)),
      map(response => response === "true"),
      catchError(error => {
        console.error('Errore durante il recupero dei dati', error);
        return of(false);
      })
    );
  }

  deleteUnit(file: any): void {
    this.checkUnitDelete(file).subscribe(check => {
      if (!check) {
        window.alert("Non è possibile eliminare l'unità perché è contenuta in un organigramma.");
      } else {
        if (confirm("Sei sicuro di voler procedere?")) {
          this.http.post('http://localhost:8080/deleteUnit', file).subscribe(
            response => {
              window.location.reload();
            },
            error => {
              console.error('Errore durante l\'eliminazione dell\'unità:', error);
            }
          );
        }
      }
    });
  }

  getRoles(): void {
    this.http.get<any[]>('http://localhost:8080/roles').subscribe(
      roles => {
        this.sections[2].files = roles.map(role => ({ name: role.nome }));
        this.sections[2].files.sort();
      },
      error => {
        console.error('Errore durante il recupero dei ruoli:', error);
      }
    );
  }

  getOrganizationalUnits(): void {
    this.http.get<any[]>('http://localhost:8080/organizational-units').subscribe(
      units => {
        this.sections[1].files = units.map(unit => ({ name: unit.nome }));
        this.sections[1].files.sort((a, b) => a.name.localeCompare(b.name));
      },
      error => {
        console.error('Errore durante il recupero delle unità organizzative:', error);
      }
    );
  }

  getOrganigrams() {
    this.http.get<any[]>('http://localhost:8080/organigrams').subscribe(
      organigrams => {
        this.sections[0].files = organigrams.map(organigram => organigram.nome);
        console.log(this.sections[0].files);
        this.sections[0].files.sort(this.compareByName);
      },
      error => {
        console.error('Errore durante il recupero dell\'organigramma:', error);
      }
    );
  }

  compareByName(a: any, b: any): number {
    const nameA = a.toUpperCase();
    const nameB = b.toUpperCase();
    if (nameA < nameB) {
      return -1;
    } else if (nameA > nameB) {
      return 1;
    } else {
      return 0;
    }
  }

}

