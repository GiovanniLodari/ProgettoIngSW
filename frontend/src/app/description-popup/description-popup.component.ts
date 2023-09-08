import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-description-popup',
  templateUrl: './description-popup.component.html',
  styleUrls: ['./description-popup.component.css']
})
export class DescriptionPopupComponent {
  title: string = '';
  section: string = '';
  editData: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private dialogRef: MatDialogRef<DescriptionPopupComponent>
  ) {
      this.title = data.title;
      this.section = data.sectionTitle;
      this.editData = data.editData;
      this.dialogRef.disableClose = true;
    }

  errorMessage: string = '';

  //Organigramma
  organigramName: string = '';
  organigramList: string[] = [];

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
 selectedUnits: boolean[] = [];
 unitName: string = '';
 unitRoles: string[] = [];



 ngOnInit() {
  console.log(this.editData);
  this.getRoles();
  this.getFile(this.editData, this.section);
 }

  confirm(): void {
    this.dialogRef.close();
  }

  getFile(data: any, section: string) {
    switch (section) {
      case 'Organigrammi':
        console.log(data);
        this.organigramName = data.nome;
        break;
      case 'Unità Organizzative':
        this.getUnitDetails(data);
        break;
      case 'Ruoli':
        this.roleName = data.nome;
        this.roleDescription = data.descrizione;
        break;
      case 'Dipendenti':
        this.employeeName = data.nome;
        this.employeeSurname = data.cognome;
        this.employeeCF = data.cf;
        this.employeeEmail = data.email;
        this.getUnits();
        this.getEmployeeDetails(this.employeeCF);
        break;
      default:
        break;
    }
  }

  getUnitDetails(unitName: string) {
      console.log(unitName);
      this.http.post<any>('http://localhost:8080/unitDetails', unitName).subscribe(
        response => {
          const attributes = response;
          console.log(attributes);
          this.unitName = unitName;
          this.unitRoles = attributes.listaRuoli;
          for (let i = 0; i < this.roleList.length; i++) {
            if(this.unitRoles.includes(this.roleList[i]))
              this.selectedRoles[i] = true;
            else
              this.selectedRoles[i] = false;
          }
          console.log(this.selectedRoles);
        },
        error => {
          console.error('Errore durante il recupero dei dati', error);
          this.errorMessage = 'Errore durante il recupero dei dati';
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

  getRoles() {
    this.http.get<any[]>('http://localhost:8080/roles').subscribe(
      roles => {
        this.roleList = roles.map(role => role.nome);
        this.roleList.sort();
        this.selectedRoles = this.roleList.map(() => false);
      },
      error => {
        console.error('Errore durante il recupero dei ruoli:', error);
      }
    );
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

}
