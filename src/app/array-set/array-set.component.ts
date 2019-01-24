import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-array-set',
  templateUrl: './array-set.component.html',
  styleUrls: ['./array-set.component.scss']
})
export class ArraySetComponent {

  @Input() array: number[];
  @Input() char: string;

}
