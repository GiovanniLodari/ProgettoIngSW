import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { LoginService } from './login/login.service';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { InfoPopupComponent } from './infoPopup/infoPopup.component';
import { AddFilePopupComponent } from './add-file-popup/add-file-popup.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon'
import { MatDividerModule } from '@angular/material/divider';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatTreeModule } from '@angular/material/tree';
import { CommonModule } from '@angular/common';
import { EditUnitPopupComponent } from './edit-file-popup/edit-file-popup.component';
import { TableComponent } from './table/table.component';
import { MatTableModule } from '@angular/material/table';
import { DescriptionPopupComponent } from './description-popup/description-popup.component';
import { MatInputModule } from '@angular/material/input';
import { EditOrganigramComponentComponent } from './edit-organigram-component/edit-organigram-component.component';
import { TreeComponent } from './tree/tree.component';
import { AddUnitDialogComponent } from './add-unit-dialog/add-unit-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { CdkTreeModule } from '@angular/cdk/tree';
import { MatMenuModule } from '@angular/material/menu';
import { DetailsPopupComponent } from './details-popup/details-popup.component';
import { AddEmployeesPopupComponent } from './add-employees-popup/add-employees-popup.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    InfoPopupComponent,
    AddFilePopupComponent,
    EditUnitPopupComponent,
    TableComponent,
    DescriptionPopupComponent,
    EditOrganigramComponentComponent,
    TreeComponent,
    AddUnitDialogComponent,
    DetailsPopupComponent,
    AddEmployeesPopupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    CdkTreeModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatMenuModule,
    MatDialogModule,
    MatFormFieldModule,
    MatListModule,
    MatSelectModule,
    MatButtonModule,
    MatOptionModule,
    FormsModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatIconModule,
    MatDividerModule,
    MatTreeModule,
    MatTableModule,
    NgbModule,
    MatInputModule
  ],
  providers: [LoginService],
  bootstrap: [AppComponent]
})
export class AppModule { }
