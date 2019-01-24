import { Component, OnInit } from '@angular/core';
import { DataProviderService } from '../data-provider.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Attribute } from 'src/model/attribute';
import { FormControl, Validators, FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ContolsHelper } from '../helpers/contols-helper';

@Component({
  selector: 'app-attribute',
  templateUrl: './attribute.component.html',
  styleUrls: ['./attribute.component.scss']
})
export class AttributeComponent implements OnInit {

  isNew: boolean = false;
  id: number = 0;
  hasSystems: boolean = false;
  myGroup: FormGroup = this.fb.group({
    name: ['', ContolsHelper.noWhitespaceValidator],
    question: ['', ContolsHelper.noWhitespaceValidator],
    values: this.fb.array([['', ContolsHelper.noWhitespaceValidator]])
  });

  get values(): FormArray {
    return this.myGroup.get('values') as FormArray;
  }

  constructor(private provider: DataProviderService, private route: ActivatedRoute, private router: Router, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      let vid = params.get('id');
      if(vid == "new") {
        this.isNew = true;
      }
      else {
        this.id = +vid;
        this.resetFields();
      }
    });
  }

  onAddValue() {
    this.values.push(this.fb.control('', ContolsHelper.noWhitespaceValidator))
  }

  onDeleteValue(index: number) {
    this.values.removeAt(index);
  }

  resetFields() {
    let source = this.provider.attributes[this.id];
    this.hasSystems = source.systems.length != 0;
    this.myGroup = this.fb.group({
      name: [source.name, ContolsHelper.noWhitespaceValidator],
      question: [source.question, ContolsHelper.noWhitespaceValidator],
      values: this.fb.array(source.values.map(v => [v, ContolsHelper.noWhitespaceValidator]))
    });
  }

  getAttributeFromForm(): Attribute {
    let attribute = new Attribute();
    attribute.systems = this.provider.attributes[this.id].systems;
    attribute.name = this.myGroup.get('name').value;
    attribute.question = this.myGroup.get('question').value;
    attribute.values = this.values.controls.map(c => c.value);
    return attribute;
  }

  addAtribute() {
    ContolsHelper.markAllDirty(this.myGroup);
    if(this.myGroup.invalid)
      return
    this.provider.addAttribute(this.getAttributeFromForm());
    this.router.navigate(['/attribute-list', this.provider.attributes.length-1]);
  }

  editAtribute() {
    ContolsHelper.markAllDirty(this.myGroup);
    if(this.myGroup.invalid)
      return
    this.provider.replaceAttribute(this.getAttributeFromForm(), this.id);
    this.router.navigate(['/attribute-list', this.id]);
  }
}
