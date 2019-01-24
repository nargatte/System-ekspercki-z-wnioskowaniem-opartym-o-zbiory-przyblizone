import { Component, OnInit, Input } from '@angular/core';
import { FactProcessor } from '../helpers/fact-processor';

@Component({
  selector: 'app-attr-set',
  templateUrl: './attr-set.component.html',
  styleUrls: ['./attr-set.component.scss']
})
export class AttrSetComponent {

  @Input() attributes: number[];
  alph = FactProcessor.alphabet;
}
