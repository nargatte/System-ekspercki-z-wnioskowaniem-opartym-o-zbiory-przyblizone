import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { DataProviderService } from '../data-provider.service';
import { System } from 'src/model/system';
import { Router } from '@angular/router';

@Component({
  selector: 'app-survey-list',
  templateUrl: './survey-list.component.html',
  styleUrls: ['./survey-list.component.scss']
})
export class SurveyListComponent{

  constructor(public provider: DataProviderService, private router: Router) {
    this.playableSystems = this.provider.systems.map<[System, number]>((o, i) => [o, i]).filter(p => p[0].facts.length != 0 && p[0].questionCounter != 0);
   }

  playableSystems: [System, number][];
}
