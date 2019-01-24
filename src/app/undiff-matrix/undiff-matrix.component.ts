import { Component, OnInit, Input } from '@angular/core';
import { FactProcessor } from '../helpers/fact-processor';

@Component({
  selector: 'app-undiff-matrix',
  templateUrl: './undiff-matrix.component.html',
  styleUrls: ['./undiff-matrix.component.scss']
})
export class UndiffMatrixComponent {

  @Input() matrix: number[][][];

  alph = FactProcessor.alphabet;

}
