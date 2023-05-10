import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Document } from '../document.model';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {
  @Output() selectedDocumentEvent = new EventEmitter<Document>();

  documents: Document [] = [
    new Document('1', 'CIT 260 - Document 1', 'This is the first document', 'https://document1.com', null),
    new Document('2', 'CIT 366 - Document 2', 'This is the second document', 'https://document2.com', null),
    new Document('3', 'CIT 425 - Document 3', 'This is the third document', 'https://document3.com', null),
    new Document('4', 'CIT 460 - Document 4', 'This is the fourth document', 'https://document4.com', null),
    new Document('5', 'CIT 495 - Document 5', 'This is the fifth document', 'https://document5.com', null)
  ];
  constructor() {}
  ngOnInit() {
  }

  onSelectedDocument(document: Document) {
    this.selectedDocumentEvent.emit(document);
  }
}
