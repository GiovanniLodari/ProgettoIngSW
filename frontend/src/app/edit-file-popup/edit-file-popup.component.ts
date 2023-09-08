import { Component, Inject, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-edit-file-popup',
  templateUrl: './edit-file-popup.component.html',
  styleUrls: ['./edit-file-popup.component.css']
})
export class EditUnitPopupComponent {
  title: string;
  section: any;
  editData: any;
  attributes: string[] = [];
  dataLoaded: boolean = false;

  errorMessage: string = '';

  //Ruolo
  roleName: string = '';
  roleDescription: string = '';
  roleList: string[] = [];
  util: any[] = [];

  //Dipendente
  employeeName: string = '';
  employeeSurname: string = '';
  employeeCF: string = '';
  employeeEmail: string = '';
  employeePassword: string = '';
  employeeRoles: string[] = [];
  selectedUnit: string = '';
  selectedRoles: boolean[] = [];
  employeeUnit: string = '';

  //Unità Organizzativa
  organizationalUnits: string[] = [];
  unitName: string = '';
  unitRoles: string[] = [];
  selectedUnits: boolean[] = [];

  //Organigramma
  organigramName: string = '';
  organigramList: string[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private changeDetectorRef: ChangeDetectorRef,
    private dialogRef: MatDialogRef<EditUnitPopupComponent>
  ) {
    this.title = data.title;
    this.section = data.sectionTitle;
    this.editData = data.editData;
    this.dialogRef.disableClose = true;
  }

  ngOnInit() {
    this.getRoles();
    this.getUnits();
    this.getFile(this.editData, this.section);
  }

  confirmEdit(): void {
    this.dialogRef.close();
  }

  cancelEdit(): void {
    this.dialogRef.close();
  }

  getFile(file: any, section: string) {
    const fileData = {
      name: this.editData,
      section: this.section
    };
    this.http.post<any>('http://localhost:8080/file', fileData).subscribe(
      response => {
        const attributes = response;
        console.log(attributes);
        switch (section) {
          case 'Organigrammi':
            this.organigramName = attributes.nome;
            this.dataLoaded = true;
            break;
          case 'Unità Organizzative':
            this.unitName = attributes.nome;
            this.unitRoles = attributes.ruoliAmmissibili;
            for (let i = 0; i < attributes.ruoliSelezionati.length; i++) {
              if(attributes.ruoliSelezionati[i] === "true")
                this.selectedRoles[i] = true;
              else
                this.selectedRoles[i] = false;
            }
            this.dataLoaded = true;
            break;
          case 'Ruoli':
            this.roleName = attributes.nome;
            this.roleDescription = attributes.descrizione;
            this.dataLoaded = true;
            break;
          case 'Dipendenti':
            console.log(attributes);
            console.log(attributes.nome);
            this.employeeName = attributes.nome;
            this.employeeSurname = attributes.cognome;
            this.employeeCF = attributes.cf;
            this.employeeEmail = attributes.email;
            this.getEmployeeDetails(this.employeeCF);
            this.dataLoaded = true;
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

  getRoles() {
    this.http.get<any[]>('http://localhost:8080/roles').subscribe(
      roles => {
        this.roleList = roles.map(role => role.nome);
        this.roleList.sort();
      },
      error => {
        console.error('Errore durante il recupero dei ruoli:', error);
      }
    );
  }

  updateUnit(): void {
    if (confirm("Sei sicuro di voler procedere?")) {
      const unitRoles: string[] = this.roleList.filter((role, index) => this.selectedRoles[index] === true);
      this.selectedRoles = this.roleList.map(() => false);
      console.log("unitRoles -> ", unitRoles);
      console.log("unitName -> ", this.unitName);
      if (this.unitName && unitRoles.length > 0) {
        const unitData = {
          name: this.unitName,
          unitRoles: unitRoles
        };
        console.log(unitData);
        this.http.post('http://localhost:8080/edit-unit', unitData).subscribe(
          response => {
            console.log('Unità modificata correttamente:', response);
            this.dialogRef.close();
          },
          error => {
            console.error('Errore durante la modifica dell\'unità:', error);
            this.errorMessage = 'Errore durante la modifica dell\'unità';
          }
        );
      } else {
        this.errorMessage = 'Per favore, riempi tutti i campi obbligatori (*).';
      }
    }
  }

  updateRole(): void {
    if (confirm("Sei sicuro di voler procedere?")) {
      if (this.unitName && this.unitRoles.length > 0) {
        const unitData = {
          name: this.unitName,
          unitRoles: this.unitRoles
        };
        console.log(unitData);
        this.http.post('http://localhost:8080/edit-unit', unitData).subscribe(
          response => {
            console.log('Nuova unità creata:', response);
            this.dialogRef.close();
          },
          error => {
            console.error('Errore durante la creation dell\'unità:', error);
            this.errorMessage = 'Errore durante la creazione dell\'unità';
          }
        );
      } else {
        this.errorMessage = 'Per favore, riempi tutti i campi obbligatori (*).';
      }
    }
  }

  updateEmployee(): void {
    if (confirm("Sei sicuro di voler procedere?")) {
      const employeeRoles: string[] = this.roleList.filter((role, index) => this.selectedRoles[index] === true);
      this.selectedRoles = this.roleList.map(() => false);
      console.log(employeeRoles);
      const employeeUnits: string[] = this.organizationalUnits.filter((unit, index) => this.selectedUnits[index] === true);
      this.selectedUnits = this.organizationalUnits.map(() => false);
      console.log(employeeUnits);
      if (this.employeeName && this.employeeSurname && this.employeeCF && this.employeeEmail && employeeUnits.length > 0 && employeeRoles.length > 0) {
        const employeeData = {
          nome: this.employeeName,
          cognome: this.employeeSurname,
          cf: this.employeeCF,
          email: this.employeeEmail,
          listaRuoli: employeeRoles,
          listaUnita: employeeUnits
        };
        console.log(employeeData);
        this.http.post('http://localhost:8080/updateEmployee', employeeData).subscribe(
          response => {
            console.log('Nuovo dipendente creato:', response);
            this.dialogRef.close();
          },
          error => {
            console.error('Errore durante la creation del dipendente:', error);
            this.errorMessage = 'Errore durante la creazione del dipendente';
          }
        );
      } else {
        this.errorMessage = 'Per favore, riempi tutti i campi obbligatori (*).';
      }
    }
  }

  getUnits() {
      this.http.get<any[]>('http://localhost:8080/organizational-units').subscribe(
        units => {
          this.organizationalUnits = units.map(unit => unit.nome);
          this.selectedUnits = this.organizationalUnits.map(() => false);
          this.organizationalUnits.sort();
        },
        error => {
          console.error('Errore durante il recupero delle unità organizzative:', error);
        }
      );
    }

  getEmployeeDetails(employeeCF: string) {
    console.log(employeeCF);
    this.http.post<any>('http://localhost:8080/employeeDetails', employeeCF).subscribe(
      response => {
          const attributes = response;
          console.log(attributes);
          this.employeeRoles = attributes.listaRuoli;
          this.employeeUnit = attributes.listaUnita;
          for (let i = 0; i < this.organizationalUnits.length; i++) {
            if(this.employeeUnit.includes(this.organizationalUnits[i]))
              this.selectedUnits[i] = true;
            else
              this.selectedUnits[i] = false;
          }
          for (let i = 0; i < this.roleList.length; i++) {
            if(this.employeeRoles.includes(this.roleList[i]))
              this.selectedRoles[i] = true;
            else
              this.selectedRoles[i] = false;
          }
      },
      error => {
        console.error('Errore durante il recupero dei dati', error);
        this.errorMessage = 'Errore durante il recupero dei dati';
      }
    );
  }

}
