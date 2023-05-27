import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'cms-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.css']
})

export class DocumentEditComponent implements OnInit {
  id: string;
  
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params
    .subscribe((params: Params) => {
      this.id = params['id'];});
    }
}
