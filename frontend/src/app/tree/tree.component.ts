import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { InfoPopupComponent } from '../infoPopup/infoPopup.component';
import { AddUnitDialogComponent } from '../add-unit-dialog/add-unit-dialog.component';
import { DetailsPopupComponent } from '../details-popup/details-popup.component';
import { AddEmployeesPopupComponent } from '../add-employees-popup/add-employees-popup.component';

class Dipendente {
  nome: string;
  cognome: string;
  cf: string;

  constructor(nome: string, cognome: string, cf: string) {
    this.nome = nome;
    this.cognome = cognome;
    this.cf = cf;
  }
}

class Unit {
  nome: string;
  livello: number;
  listaUnita: Unit[] = [];
  listaDipendenti: Dipendente[] = [];
  listaRuoli: string[] = [];

  constructor(nome: string, livello: number) {
    this.nome = nome;
    this.livello = livello;
    this.listaUnita = [];
    this.listaDipendenti = [];
    this.listaRuoli = [];
  }
}

interface FlatNode {
  expandable: boolean;
  nome: string;
  livello: number;
}

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css']
})
export class TreeComponent implements OnInit {
  organizationalUnits: string[] = [];
  nomeOrganigramma: string = '';
  organigramma: Unit[] = [];
  employees: string[] = [];
  setVisible: boolean = false;
  undoButton: boolean = true;
  dataSource: MatTreeFlatDataSource<Unit, FlatNode>;
  treeControl: FlatTreeControl<FlatNode>;
  treeFlattener: MatTreeFlattener<Unit, FlatNode>;

  saved: boolean = true;

  @ViewChild('recursiveTree', { static: true }) recursiveTree!: TemplateRef<any>;
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.treeControl = new FlatTreeControl<FlatNode>(
      node => node.livello,
      node => node.expandable
    );

    this.treeFlattener = new MatTreeFlattener<Unit, FlatNode>(
      (node, level) => ({
        expandable: !!node.listaUnita && node.listaUnita.length > 0,
        nome: node.nome,
        livello: level
      }),
      node => node.livello,
      node => node.expandable,
      node => node.listaUnita
    );

    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.nomeOrganigramma = params['organigramName'];
    });
    if (this.nomeOrganigramma) {
      this.getOrganigramma(this.nomeOrganigramma);
    }
    this.getOrganizationalUnits(this.nomeOrganigramma);
    console.log(this.organizationalUnits);
    console.log(this.undoButton);
  }

  goBack() {
    if(this.dataSource.data.length > 0){
      if(this.saved){
        const queryParams = { check:"true" };
        this.router.navigate(['/home'], { queryParams });
      }
      else{
        if(confirm('Sei sicuro di voler tornare indietro? Perderai tutti i dati non salvati.')){
          const queryParams = { check:"true" };
          this.router.navigate(['/home'], { queryParams });
        }
      }
    }else{
      const queryParams = { check:"true" };
      this.router.navigate(['/home'], { queryParams });
    }
  }

  openDescriptionPopup(): void {
    const dialogRef = this.dialog.open(InfoPopupComponent, {
      data: {
        title: 'Assistenza',
        description: 'In questa sezione è possibile costruire un organigramma. Più precisamente, è richiesto che tutti gli elementi necessari alla sua creazione siano già stati definiti nelle sezioni apposite. In questa sezione avviene l\'assemblaggio di tutti gli elementi al fine della realizzazione dell\'organigramma.'
      }
    });
  }

  hasChild = (_: number, node: FlatNode) => node.expandable || (!!node.nome && !!node.livello);

  getOrganigramma(nomeOrganigramma: string) {
    this.http.get<any>(`http://localhost:8080/organigramDetails`, { params: { nomeOrganigramma } })
      .subscribe(
        (response: any) => {
          const listaUnita = response.listaUnita;
          if (listaUnita && listaUnita.length > 0) {
            this.organigramma = listaUnita;
            this.dataSource.data = this.organigramma;
            this.setVisible = false;
            this.visitTree(this.dataSource.data);
          } else { this.setVisible = true; }
        },
        (error) => {
          console.error(error);
        }
    );
  }

  visitTree(nodes: Unit[]): void {
    for (const node of nodes) {
      this.getUnitDetails(node);
      if (node.listaUnita && node.listaUnita.length > 0) {
        this.visitTree(node.listaUnita);
      }
    }
  }

  addChildNode(parentNode: Unit, childName: string) {
    const childNode = new Unit(childName, parentNode.livello + 1);
    const findNode = (nodes: Unit[]): boolean => {
      for (const node of nodes) {
        if (node.nome === parentNode.nome && childNode.livello === (parentNode.livello+1)) {
          if(node.listaUnita === undefined){
            node.listaUnita = [];
          }
          node.listaUnita.push(childNode);
          return true;
        }
        if (node.listaUnita && node.listaUnita.length > 0) {
          if (findNode(node.listaUnita)) {
            return true;
          }
        }
      }
      return false;
    };
    if (findNode(this.dataSource.data)) {
      this.treeControl.expand(parentNode as any);
      this.dataSource.data = [...this.dataSource.data];
      this.saved = false;
    } else {
      console.log('Nodo padre non trovato');
    }
    this.getUnitDetails(childNode);
  }

  deleteNode(node: Unit) {
    const confirmation1 = confirm('Sei sicuro di voler eliminare il nodo selezionato?');
    if (!confirmation1) {
      return;
    }
    const findAndDeleteNode = (nodes: Unit[]): boolean => {
      for (let i = 0; i < nodes.length; i++) {
        const currentNode = nodes[i];
        if (currentNode.nome === node.nome) {
          if (currentNode.listaUnita && currentNode.listaUnita.length > 0) {
            const confirmation2 = confirm('Attenzione: eliminando questo nodo verranno eliminati tutti i suoi figli. Sei sicuro di voler procedere?');
            if (!confirmation2) {
              return false;
            }
            else{this.saveState();}
          }
          const deletedNode = nodes.splice(i, 1)[0];
          if (deletedNode) {
            this.addUnitAndChildrenNames(deletedNode);
          }
          this.organizationalUnits.sort();
          this.saved = false;
          return true;
        }
        if (currentNode.listaUnita && currentNode.listaUnita.length > 0) {
          if (findAndDeleteNode(currentNode.listaUnita)) {
            return true;
          }
        }
      }
      return false;
    };
    const success = findAndDeleteNode(this.dataSource.data);
    if (success) {
      this.dataSource.data = [...this.dataSource.data];
      if (!(this.dataSource.data.length > 0)) {
        this.setVisible = true;
      }
    } else {
      console.log('Nodo non trovato');
    }
  }


  addUnitAndChildrenNames(unit: Unit) {
    this.organizationalUnits.push(unit.nome);
    if (unit.listaUnita && unit.listaUnita.length > 0) {
      for (const childUnit of unit.listaUnita) {
        this.addUnitAndChildrenNames(childUnit);
      }
    }
  }

  addEmployees(unit: Unit) {
    let findedNode: Unit | undefined;
    const findNode = (nodes: Unit[]): boolean => {
      for (const node of nodes) {
        if (node.nome === unit.nome) {
          findedNode = node;
          return true;
        }
        if (node.listaUnita && node.listaUnita.length > 0) {
          if (findNode(node.listaUnita)) {
            return true;
          }
        }
      }
      return false;
    };

    if (findNode(this.dataSource.data) && findedNode !== undefined) {
      const dialogRef = this.dialog.open(AddEmployeesPopupComponent, {
        data: {
          roleList: findedNode.listaRuoli,
          employees: findedNode.listaDipendenti
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.saveState();
          if(findedNode !== undefined){
            findedNode.listaDipendenti = result;
            this.saved = false;
          }
        }
      });
    }
  }

  saveOrganigram(nomeOrganigramma: string) {
    const url = 'http://localhost:8080/saveOrganigramma';
    const data = {
      nomeOrganigramma,
      organigramma: this.dataSource.data
    };
    this.http.post(url, data).subscribe(
      () => {
        console.log('Organigramma salvato con successo');
        this.saved = true;
        this.undoButton = false;
      },
      (error) => {
        console.error('Errore durante il salvataggio dell\'organigramma', error);
      }
    );
  }

  //util
  openAddUnitDialog(parentNode?: Unit) {
    const dialogRef = this.dialog.open(AddUnitDialogComponent, {
      data: { organizationalUnitsList: this.organizationalUnits }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
      this.saveState()
        if (!parentNode) {
          const rootNode = new Unit(result, 0);
          this.organigramma.push(rootNode);
          this.getUnitDetails(rootNode);
          this.setVisible = false;
          this.dataSource.data = this.organigramma;
        } else {
          this.addChildNode(parentNode, result);
        }
        const index = this.organizationalUnits.indexOf(result);
          if (index !== -1) {
            this.organizationalUnits.splice(index, 1);
          }
      }
    });
  }

  getOrganizationalUnits(nomeOrganigramma: string) {
    this.http.get<any[]>('http://localhost:8080/getUnitaOrganizzative', { params: { nomeOrganigramma } }).subscribe(
      units => {
        this.organizationalUnits = units.map(unit => unit.nome);
        this.organizationalUnits.sort();
        this.removeUnitsFromOrganizationalUnits();
      },
      error => {
        console.error('Errore durante il recupero delle unità organizzative:', error);
      }
    );
  }

  getUnitDetails(unit: Unit) {
    this.http.post<any>('http://localhost:8080/unitDetails', unit.nome).subscribe(
      response => {
        const attributes = response;
        unit.listaRuoli = attributes.listaRuoli;
        unit.listaDipendenti = attributes.listaDipendenti;
      },
      error => {
        console.error('Errore durante il recupero dei dati', error);
      }
    );
  }

  openDetails(unit: Unit): void {
    let findedNode: Unit | undefined;
    const findNode = (nodes: Unit[]): boolean => {
      for (const node of nodes) {
        if (node.nome === unit.nome) {
          findedNode = node;
          return true;
        }
        if (node.listaUnita && node.listaUnita.length > 0) {
          if (findNode(node.listaUnita)) {
            return true;
          }
        }
      }
      return false;
    };

    if (findNode(this.dataSource.data) && findedNode !== undefined) {
      const dialogRef = this.dialog.open(DetailsPopupComponent, {
         maxWidth: '550px',
         width: '100%',
         height: '55%',
        data: {
          title: findedNode.nome,
          listaRuoli: findedNode.listaRuoli,
          listaDipendenti: findedNode.listaDipendenti
        }
      });
      this.saveState();
      dialogRef.afterClosed().subscribe((listaDipendentiAggiornata: Dipendente[]) => {
        if (listaDipendentiAggiornata && findedNode !== undefined) {
          if(findedNode.listaDipendenti !== listaDipendentiAggiornata){
            findedNode.listaDipendenti = listaDipendentiAggiornata;
            this.saved = false;
          }
        }
      });
    }
  }

  getEmployees() {
    this.http.post<any>('http://localhost:8080/files', 'Dipendenti').subscribe(
      response => {
        const attributes = response;
        this.employees = attributes;
        this.employees = attributes.sort(this.compareBySurname);
      },
      error => {
        console.error('Errore durante il recupero dei dati:', error);
      }
    );
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

  removeUnitsFromOrganizationalUnits(): void {
    this.organizationalUnits = this.organizationalUnits.filter(unitName => {
      return !this.findNode(this.dataSource.data, unitName);
    });
  }

  findNode(nodes: Unit[], nome: string): Unit | undefined {
    for (const node of nodes) {
      if (node.nome === nome) {
        return node;
      }
      if (node.listaUnita && node.listaUnita.length > 0) {
        const foundNode = this.findNode(node.listaUnita, nome);
        if (foundNode) {
          return foundNode;
        }
      }
    }
    return undefined;
  }

  saveState() {
    const url = 'http://localhost:8080/saveState';
    const data = {
      nomeOrganigramma: this.nomeOrganigramma,
      stato: this.dataSource.data
    };
    this.http.post(url, data).subscribe(
      () => {
        console.log('Stato salvato con successo');
        this.undoButton = false;
      },
      (error) => {
        console.error('Errore durante il salvataggio dello stato', error);
      }
    );
  }

  getOldState(nomeOrganigramma: string) {
      this.http.get<any>(`http://localhost:8080/getOldState`, { params: { nomeOrganigramma } })
        .subscribe(
          (response: any) => {
            console.log(this.undoButton);
            console.log(response);
            console.log(response.check);
            if(response.check === "true" || response === ""){ this.undoButton = true; }
            else {this.undoButton = false;}
            console.log(this.undoButton);
              const listaUnita = response.listaUnita;
              if (listaUnita && listaUnita.length > 0) {
                this.organigramma = listaUnita;
                this.dataSource.data = this.organigramma;
                this.setVisible = false;
                this.visitTree(this.dataSource.data);
                this.getOrganizationalUnits(this.nomeOrganigramma);
              } else {
                this.setVisible = true;
                this.organigramma = listaUnita;
                this.dataSource.data = this.organigramma;
              }
          },
          (error) => {
            console.error(error);
          }
      );
    }
}
