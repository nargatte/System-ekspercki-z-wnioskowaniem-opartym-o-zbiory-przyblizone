import { Component, OnInit, ViewChild } from '@angular/core';
import { System } from 'src/model/system';
import { DataProviderService } from '../data-provider.service';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Attribute } from 'src/model/attribute';
import { MatSelectChange, MatTableDataSource } from '@angular/material';
import { FormControl } from '@angular/forms';
import { ContolsHelper } from '../helpers/contols-helper';
import { SelectionModel } from '@angular/cdk/collections';
import { Fact } from 'src/model/fact';
import { FactProcessor } from '../helpers/fact-processor';
import { RulesTableComponent } from '../rules-table/rules-table.component';

@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.scss']
})
export class SystemComponent implements OnInit {

  @ViewChild('rulesTable') rulesTable: RulesTableComponent;

  isNew: boolean = false;
  system: System = new System();
  id: number = 0;
  attributeChecked: boolean[];
  decisionAttribute: string = '0';

  nameForm = new FormControl('', ContolsHelper.noWhitespaceValidator);
  checkBoxesError = false;

  selection = new SelectionModel<number[]>(true, []);
  dataSource = new MatTableDataSource<number[]>();
  displayedColumns: string[];

  factProcessor: FactProcessor = null;

  lightFacts: number[] = [];

  constructor(public provider: DataProviderService, private route: ActivatedRoute, private router: Router) {
    this.attributeChecked = new Array(provider.attributes.length).fill(false);
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      let vid = params.get('id');
      if(vid == "new") {
        this.isNew = true;
      }
      else {
        this.id = +vid;
        this.resetFields();
      }
      this.displayedColumnsUpdate();
    });
  }

  displayedColumnsUpdate() {
    this.displayedColumns = this.attributeChecked.map((b, i) => b ? ''+i : null).filter(n => n != null);
    this.displayedColumns.splice(0, 0, 'select');
    this.displayedColumns.push(''+this.decisionAttribute);  

    this.updateAttributesInSystemModel();
  }

  updateSystemModel() {
    this.updateAttributesInSystemModel();
    this.updateFactsInSystemModel();
  }

  updateAttributesInSystemModel() {
    this.system.decisionAttribute = this.provider.attributes[+this.decisionAttribute];
    this.system.conditionAttributes = this.attributeChecked.map((b, i) => b ? this.provider.attributes[i] : null).filter(a => a != null);
  }

  updateFactsInSystemModel() {
    if(this.rulesTable != null)this.rulesTable.setSelectedRow(null);
    this.system.facts = this.dataSource.data.map(r => {
      let f = new Fact();
      f.decision = r[this.decisionAttribute];
      f.conditions = this.attributeChecked.map((b, i) => b ? r[i]: null).filter(n => n != null);
      return f;
    });
    this.factProcessor = new FactProcessor(this.system.facts);
    if(this.system.facts.length > 0)this.system.questionCounter = this.factProcessor.reduct.length;
  }

  resetFields() {
    let source = this.provider.systems[this.id];
    this.system = new System();
    this.system.name = source.name;
    this.system.facts = source.facts.slice();
    this.factProcessor = new FactProcessor(this.system.facts);
    this.checkBoxesError = false;

    source.conditionAttributes.forEach((attribute) => {
      this.attributeChecked[this.provider.attributes.indexOf(attribute)] = true;
    });
    this.system.conditionAttributes = source.conditionAttributes.slice();

    this.decisionAttribute = ''+this.provider.attributes.indexOf(source.decisionAttribute);
    this.system.decisionAttribute = source.decisionAttribute;

    this.dataSource.data = source.facts.map(f => {
      let r = new Array(this.provider.attributes.length).fill(0);
      r[this.decisionAttribute] = f.decision;
      let x = 0;
      this.attributeChecked.forEach((b, i) => {
        if(b)
          r[i] = f.conditions[x++]; 
      });
      return r;
    });
  }

  canExit(): boolean {
    this.updateSystemModel();
    this.nameForm.markAsDirty();
    if(this.system.conditionAttributes.length == 0)
      this.checkBoxesError = true;
    return !this.checkBoxesError && this.nameForm.valid;
  }

  addSystem() {
    if(!this.canExit())
      return
    this.provider.addSystem(this.system);
    this.router.navigate(['/system-list', this.provider.systems.length - 1]);
  }

  editSystem() {
    if(!this.canExit())
      return
    this.provider.replaceSystem(this.system, this.id);
    this.router.navigate(['/system-list', this.id]);
  }

  onChangeCheckBox(): void {
    this.checkBoxesError = false;
    this.displayedColumnsUpdate();
  }

  isConditionAttribute(attribute: Attribute): boolean {
    return this.system.conditionAttributes.indexOf(attribute) >= 0;
  }

  onAddFact(): void {    
    this.dataSource.data.push(this.provider.attributes.map(a => 0));
    this.updateFactsInSystemModel();
  }

  onDeleteFacts(): void {
    this.selection.selected.forEach(r => {
      this.dataSource.data.splice(this.dataSource.data.indexOf(r), 1);
    });
    this.selection.clear();
    this.updateFactsInSystemModel();
  }

  masterToggle() {
    this.isAllSelected() ?
    this.selection.clear() :
    this.dataSource.data.forEach(row => this.selection.select(row));
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
}
