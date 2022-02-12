import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService } from './auth.service';
import { LoginComponent } from './login/login.component';
import { ObrazciComponent } from './obrazci/obrazci.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ObrazciApiService } from './obrazci-api.service';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { AuthGuard } from './auth.guard';
import { AddEditObrazecComponent } from './obrazci/add-edit-obrazec/add-edit-obrazec.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatOptionModule } from '@angular/material/core';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ObrazciComponent,
    AddEditObrazecComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatSortModule,
    MatTableModule,
    MatAutocompleteModule,
    MatOptionModule
  ],
  providers: [AuthService, ObrazciApiService, AuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
