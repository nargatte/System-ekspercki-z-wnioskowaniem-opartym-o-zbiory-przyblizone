import { Component, OnInit } from '@angular/core';
import { DataProviderService } from '../data-provider.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-attribute-list',
  templateUrl: './attribute-list.component.html',
  styleUrls: ['./attribute-list.component.scss']
})
export class AttributeListComponent implements OnInit {

  expandId: number;

  constructor(public provider: DataProviderService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.expandId = +params.get('id');
    });
  }
}
