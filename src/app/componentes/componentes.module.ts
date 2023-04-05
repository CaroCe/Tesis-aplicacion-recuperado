import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentesRoutingModule } from './componentes-routing.module';
import { Material } from '../material';
import { NavComponent } from './nav/nav.component';
import { ChatComponent } from './chat/chat.component';
import { DialogGeneralErrorComponent } from './dialog-general-error/dialog-general-error.component';
import { DialogGeneral } from './dialog-general/dialog-general';
import { NavService } from './nav/nav.service';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from '../app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { DialogError } from './dialog-general-error/dialog-error';


@NgModule({
  declarations: [
    ChatComponent,
    DialogGeneral,
    DialogGeneralErrorComponent,
    NavComponent
  ],
  imports: [
    ComponentesRoutingModule,
    CommonModule,
    MatFormFieldModule,
    Material,
    MatSortModule,
    MatCardModule,
    ReactiveFormsModule,
    FormsModule,
    MatTableModule
  ],
  exports:[
    DialogGeneral,
    DialogGeneralErrorComponent,
    ChatComponent,
    NavComponent
  ],
  providers:[
    NavService
  ]
})
export class ComponentesModule { }
