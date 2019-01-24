import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AttributeListComponent } from './attribute-list/attribute-list.component';
import { SystemListComponent } from './system-list/system-list.component';
import { AttributeComponent } from './attribute/attribute.component';
import { SystemComponent } from './system/system.component';
import { SurveyComponent } from './survey/survey.component';
import { SurveyListComponent } from './survey-list/survey-list.component';

const routes: Routes = [
  { path: "attribute-list/:id", component: AttributeListComponent },
  { path: "system-list/:id", component: SystemListComponent },
  { path: "attribute/:id", component: AttributeComponent },
  { path: "system/:id", component: SystemComponent },
  { path: "survey/:id", component: SurveyComponent },
  { path: "survey-list", component: SurveyListComponent },
  { path: '', redirectTo: 'survey-list', pathMatch: 'full' },
  // { path: '**', redirectTo: 'survey-listsgasdf' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
