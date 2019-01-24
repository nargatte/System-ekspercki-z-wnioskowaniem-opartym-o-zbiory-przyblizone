import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Rule } from 'src/model/Rule';
import { Attribute } from 'src/model/attribute';
import { FactProcessor } from '../helpers/fact-processor';
import { System } from 'src/model/system';

@Component({
  selector: 'app-rules-table',
  templateUrl: './rules-table.component.html',
  styleUrls: ['./rules-table.component.scss']
})
export class RulesTableComponent implements OnInit {

  @Input() ruleList: Rule[];
  @Input() system: System = null;
  @Input() canSelected: boolean = false;
  @Input() showClass: boolean = false;
  @Input() showFacts: boolean = false;
  @Input() lightRules: Rule[] = [];
  @Input() bestLightRule: Rule = null;
  @Output() selected = new EventEmitter<number>();

  ngOnInit(): void {
    if(this.showClass)
      this.displayedColumns.push('class');
    if(this.showFacts)
      this.displayedColumns.push('facts');
  }

  selectedRow: number;

  setSelectedRow(v) {
    this.selectedRow = v;
    this.selected.emit(v);
  }

  onClick(i) {
    if(this.canSelected){
      if(this.selectedRow == i) this.setSelectedRow(null);
      else this.setSelectedRow(i);
    }
  }

  alph = FactProcessor.alphabet;

  displayedColumns: string[] = ['conditions', 'implication', 'decision', 'support', 'accuracy', 'coverage', 'length'];

}
