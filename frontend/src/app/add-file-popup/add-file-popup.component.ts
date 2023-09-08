import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-file-popup',
  templateUrl: './add-file-popup.component.html',
  styleUrls: ['./add-file-popup.component.css']
})
export class AddFilePopupComponent {
  @Input() color: string = '#1976d2';
  errorMessage: string = '';

  //Ruolo
  roleName: string = '';
  roleDescription: string = '';
  roleList: string[] = [];

  //Dipendente
  employeeName: string = '';
  employeeSurname: string = '';
  employeeCF: string = '';
  employeeEmail: string = '';
  employeePassword: string = '';
  employeeRoles: string[] = [];
  selectedRoles: boolean[] = [];
  employeeUnits: string[] = [];
  selectedUnits: boolean[] = [];
  employeeList: string[] = [];
  cfList: string[] = [];
  emailList: string[] = [];

  //Unità Organizzativa
  organizationalUnits: string[] = [];
  unitName: string = '';
  unitRoles: string[] = [];

  //Organigramma
  organigramName: string = '';
  organigramList: string[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AddFilePopupComponent>,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router
  ) {this.dialogRef.disableClose = true;}

  ngOnInit() {
    this.getRoles();
    this.getOrganizationalUnits();
    this.getOrganigrams();
    this.getEmployees();
    this.selectedRoles = this.roleList.map(() => false);
    this.selectedUnits = this.organizationalUnits.map(() => false);
  }

  confirmSelectionCreate(): void {
    this.dialogRef.close();
  }

  cancelSelectionCreate(): void {
    this.dialogRef.close();
  }

  getRoles() {
    this.http.get<any[]>('http://localhost:8080/roles').subscribe(
      roles => {
        this.roleList = roles.map(role => role.nome);
        this.selectedRoles = this.roleList.map(() => false);
        this.roleList.sort();
      },
      error => {
        console.error('Errore durante il recupero dei ruoli:', error);
      }
    );
  }

  getOrganizationalUnits() {
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

  getOrganigrams() {
    this.http.get<any[]>('http://localhost:8080/organigrams').subscribe(
      organigrams => {
        this.organigramList = organigrams.map(organigram => organigram.nome);
        console.log(this.organigramList);
      },
      error => {
        console.error('Errore durante il recupero delle unità organizzative:', error);
      }
    );
  }

  getEmployees() {
    this.http.get<any[]>('http://localhost:8080/employees').subscribe(
      employees => {
        this.cfList = employees.map(employee => employee.cf);
        this.emailList = employees.map(employee => employee.email);
        console.log(this.cfList);
        console.log(this.emailList);
      },
      error => {
        console.error('Errore durante il recupero dei dipendenti:', error);
      }
    );
  }

  createRole(): void {
    if (this.roleName && this.roleDescription) {
      if(this.roleList.includes(this.roleName))
        this.errorMessage = 'Errore: Il nome inserito non è disponibile';
      else{
        const roleData = {
          name: this.roleName,
          description: this.roleDescription
        };
        console.log(roleData);
        this.http.post('http://localhost:8080/role', roleData).subscribe(
          response => {
            console.log('Nuovo ruolo creato:', response);
            this.dialogRef.close();
            window.location.reload();
          },
          error => {
            console.error('Errore durante la creazione del ruolo:', error);
            this.errorMessage = 'Errore durante la creazione del ruolo';
          }
        );
      }
    } else {
      this.errorMessage = 'Per favore, riempi tutti i campi obbligatori (*).';
    }
  }

  createOrganigram(): void {
    if (this.organigramName) {
      if(this.organigramList.includes(this.organigramName))
        this.errorMessage = 'Errore: Il nome inserito non è disponibile';
      else{
      this.http.post('http://localhost:8080/organigram', this.organigramName).subscribe(
        response => {
          console.log('Nuova unità creata:', response);
          this.dialogRef.close();
        },
        error => {
          console.error('Errore durante la creation dell\'organigramma:', error);
          this.errorMessage = 'Errore durante la creazione dell\'organigramma';
        }
      );
      }
    } else {
      this.errorMessage = 'Per favore, riempi tutti i campi obbligatori (*).';
    }
  }

  createUnit(): void {
    const unitRoles: string[] = this.roleList.filter((role, index) => this.selectedRoles[index] === true);
    this.selectedRoles = this.roleList.map(() => false);
    if (this.unitName && unitRoles.length > 0) {
      if(this.organizationalUnits.includes(this.unitName))
        this.errorMessage = 'Errore: Il nome inserito non è disponibile';
      else{
        const unitData = {
          name: this.unitName,
          unitRoles: unitRoles
        };
        console.log(unitData);
        this.http.post('http://localhost:8080/organizational-unit', unitData).subscribe(
          response => {
            console.log('Nuova unità creata:', response);
            this.dialogRef.close();
          },
          error => {
            console.error('Errore durante la creation dell\'unità:', error);
            this.errorMessage = 'Errore durante la creazione dell\'unità';
          }
        );
      }
    } else {
      this.errorMessage = 'Per favore, riempi tutti i campi obbligatori (*).';
    }
  }

  createEmployee(): void {
    this.employeeRoles = this.roleList.filter((role, index) => this.selectedRoles[index] === true);
    this.employeeUnits = this.organizationalUnits.filter((unit, index) => this.selectedUnits[index] === true);
    this.selectedRoles = this.roleList.map(() => false);
    this.selectedUnits = this.organizationalUnits.map(() => false);

    if (this.employeeName && this.employeeSurname && this.employeeCF && this.employeeEmail && this.employeeRoles.length > 0) {
      if (this.isValidEmail(this.employeeEmail)) {
        if (this.isValidCF(this.employeeCF)) {
          if (this.cfList.includes(this.employeeCF) || this.emailList.includes(this.employeeEmail)) {
            this.errorMessage = 'Errore: Il codice Fiscale o l\'email inseriti non sono disponibili';
          } else {
            const employeeData = {
              nome: this.employeeName,
              cognome: this.employeeSurname,
              codiceFiscale: this.employeeCF,
              email: this.employeeEmail,
              listaRuoli: this.employeeRoles,
              unitaOrganizzative: this.employeeUnits
            };
            this.selectedRoles = this.roleList.map(() => false);
            this.http.post('http://localhost:8080/employee', employeeData).subscribe(
              response => {
                console.log('Nuovo dipendente creato:', response);
                this.dialogRef.close();
              },
              error => {
                console.error('Errore durante la creazione del dipendente:', error);
              }
            );
          }
        } else {
          this.errorMessage = 'Codice fiscale non valido.';
        }
      } else {
        this.errorMessage = 'Email non valida.';
      }
    } else {
      this.errorMessage = 'Per favore, riempi tutti i campi obbligatori (*).';
    }
  }


  isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  isValidCF(codiceFiscale: string): boolean {
    const codiceFiscaleRegex = /^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$/;
    return codiceFiscaleRegex.test(codiceFiscale);
  }
}

