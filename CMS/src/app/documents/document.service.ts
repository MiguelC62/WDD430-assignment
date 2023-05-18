import { Injectable, EventEmitter } from '@angular/core';

import { Document } from './document.model';

import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private documents: Document[] = [];

  documentSelectedEvent: EventEmitter<Document> = new EventEmitter<Document>();

  constructor() { 
    this.documents = MOCKDOCUMENTS;
  }
  getDocuments() {
    return this.documents.slice();
  }

  getDocument(id: string): Document {
    for (const document of this.documents) {
      if (document.id === id) {
        return document;
      }
    }
    return null;
   } 
}
