import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { FactProcessor } from '../helpers/fact-processor';
import { System } from 'src/model/system';
import { MatExpansionModule, MatAccordion } from '@angular/material';

@Component({
  selector: 'app-rules-explanation',
  templateUrl: './rules-explanation.component.html',
  styleUrls: ['./rules-explanation.component.scss']
})
export class RulesExplanationComponent{

  @ViewChild(MatAccordion) contener: MatAccordion;

  @Input() factProcessor: FactProcessor;
  @Input() system: System

  range(end) {
    var ans = [];
    for (let i = 0; i < end; i++) {
        ans.push(i);
    }
    return ans;
}

expand() {
  this.contener.openAll();
}

hide() {
  this.contener.closeAll();
}

  alph = FactProcessor.alphabet;

}
