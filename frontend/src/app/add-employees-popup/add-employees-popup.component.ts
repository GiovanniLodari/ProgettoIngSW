import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { HttpClient } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';

class Ruolo {
  nome: string;
  constructor(nome: string) {
    this.nome = nome;
  }
}

class Dipendente {
  nome: string;
  cognome: string;
  cf: string;
  email: string;
  listaRuoli: Ruolo[] = [];
  listaUnita: string[] = [];
  constructor(nome: string, cognome: string, cf: string, email: string, listaRuoli: Ruolo[], listaUnita: string[]) {
    this.nome = nome;
    this.cognome = cognome;
    this.cf = cf;
    this.email = email;
    this.listaRuoli = listaRuoli;
    this.listaUnita = listaUnita;
  }
}

@Component({
  selector: 'app-add-employees-popup',
  templateUrl: './add-employees-popup.component.html',
  styleUrls: ['./add-employees-popup.component.css']
})
export class AddEmployeesPopupComponent {
  employeesList: Dipendente[] = [];
  filteredEmployees: Dipendente[] = [];
  dipendentiUnita: Dipendente[] = [];
  errorMessage: string = '';
  roleList: string[] = [];
  selectedEmployees: boolean[] = [];
  tableColumnsDipendenti: string[] = ['position', 'surname', 'name', 'CF', 'actions'];
  dataSource: MatTableDataSource<Dipendente>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private dialogRef: MatDialogRef<AddEmployeesPopupComponent>
  ) {
    this.roleList = data.roleList;
    this.dipendentiUnita = data.employees;
    this.dialogRef.disableClose = true;
    this.dataSource = new MatTableDataSource<Dipendente>([]);
  }

  ngOnInit() {
    this.getEmployees();
  }

  getEmployees() {
    this.http.post<Dipendente[]>('http://localhost:8080/files', 'Dipendenti').subscribe(
      response => {
        response.forEach((employeeData: Dipendente) => {
          const ruoli: Ruolo[] = [];
          employeeData.listaRuoli.forEach((ruoloData: Ruolo) => {
            const roleName = ruoloData.nome;
            const ruolo = new Ruolo(roleName);
            ruoli.push(ruolo);
          });

          const employee = new Dipendente(
            employeeData.nome,
            employeeData.cognome,
            employeeData.cf,
            employeeData.email,
            ruoli,
            employeeData.listaUnita
          );
          this.employeesList.push(employee);
        });
        this.checkRolesForEmployees();
      },
      error => {
        console.error('Errore durante il recupero dei dipendenti.', error);
        this.errorMessage = 'Si è verificato un errore durante il recupero dei dipendenti.';
      }
    );
  }

  checkRolesForEmployees() {
    if (this.roleList && this.roleList !== undefined) {
      for (const employee of this.employeesList) {
        for (const role of employee.listaRuoli) {
          if (this.roleList.includes(role.nome)) {
            const isEmployeeInUnit = this.dipendentiUnita.find(dipendente => dipendente.cf === employee.cf);
            if (!isEmployeeInUnit) {
              this.filteredEmployees.push(employee);
              break;
            }
          }
        }
      }
      this.filteredEmployees = this.filteredEmployees.sort(this.compareBySurname);
      console.log(this.filteredEmployees);
      this.selectedEmployees = new Array<boolean>(this.filteredEmployees.length);
      this.dataSource.data = this.filteredEmployees;
    } else {
      console.error('La lista dei ruoli non è definita correttamente.');
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

  addEmployee(employee: Dipendente, index: number){
    this.dipendentiUnita.push(employee);
    this.selectedEmployees[index] = true;
  }

  confirm(): void {this.dialogRef.close(this.dipendentiUnita);}

  cancel(): void {this.dialogRef.close();}

}
