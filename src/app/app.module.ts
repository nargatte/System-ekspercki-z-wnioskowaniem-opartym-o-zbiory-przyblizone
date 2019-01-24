import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material-module';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { AttributeListComponent } from './attribute-list/attribute-list.component';
import { SystemListComponent } from './system-list/system-list.component';
import { AttributeComponent } from './attribute/attribute.component';
import { SystemComponent } from './system/system.component';
import { SurveyComponent } from './survey/survey.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material';
import { RulesTableComponent } from './rules-table/rules-table.component';
import { UndiffMatrixComponent } from './undiff-matrix/undiff-matrix.component';
import { RulesExplanationComponent } from './rules-explanation/rules-explanation.component';
import { AccordionItemComponent } from './accordion-item/accordion-item.component';
import { ArraySetComponent } from './array-set/array-set.component';
import { AttrSetComponent } from './attr-set/attr-set.component';
import { SurveyListComponent } from './survey-list/survey-list.component';

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    AttributeListComponent,
    SystemListComponent,
    AttributeComponent,
    SystemComponent,
    SurveyComponent,
    RulesTableComponent,
    UndiffMatrixComponent,
    RulesExplanationComponent,
    AccordionItemComponent,
    ArraySetComponent,
    AttrSetComponent,
    SurveyListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [{provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher}],
  bootstrap: [AppComponent]
})
export class AppModule { }
