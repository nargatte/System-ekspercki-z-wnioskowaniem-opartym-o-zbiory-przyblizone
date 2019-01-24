import { Component, OnInit } from '@angular/core';
import { DataProviderService } from '../data-provider.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { System } from 'src/model/system';
import { FactProcessor } from '../helpers/fact-processor';
import { Rule } from 'src/model/Rule';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss']
})
export class SurveyComponent implements OnInit {

  constructor(private provider: DataProviderService, private route: ActivatedRoute) { }

  system: System;
  processor: FactProcessor;
  answers: number[];
  reduct: number[];

  fitRules: Rule[] = [];
  bestRuleIndex: number = -1;

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      let id = params.get('id');
      this.system = this.provider.systems[id];
      this.processor = new FactProcessor(this.system.facts);
      this.reduct = this.processor.reduct;
      this.answers = new Array(this.system.conditionAttributes.length).fill(-1);
    });
  }

  onChange() {
    this.fitRules = this.processor.getCorrectRules(this.answers);
    if(this.fitRules.length != 0 )
      this.bestRuleIndex = this.processor.getIndexOfBestRule(this.fitRules);
    else
      this.bestRuleIndex = -1;
  }

}
