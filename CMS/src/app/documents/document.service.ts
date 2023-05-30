import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  documents: Document[] = [];
  maxDocumentId: number = 0;
  documentListChangedEvent =new Subject<Document[]>();

  //documentSelectedEvent = new EventEmitter<Document>();
  //documentChangedEvent = new EventEmitter<Document[]>();

  constructor() { 
    this.documents = MOCKDOCUMENTS;
    this.maxDocumentId = this.getMaxId();
  }
  getDocuments(): Document[] {
    return this.documents.slice();
  }

  getDocument(id: string): Document {
     return this.documents.find((document) => document.id === id);
   } 

  deleteDocument(document: Document) {
  if (!document) {
      return;
  }
  const pos = this.documents.indexOf(document);
  if (pos < 0) {
      return;
  }
  this.documents.splice(pos, 1);
  const documentsListClone = this.documents.slice();
  this.documentListChangedEvent.next(documentsListClone);

 }

 getMaxId(): number {
  let maxId = 0;

  for (const document of this.documents) {
    const currentId = parseInt(document.id, 10);
    if (currentId > maxId) {
      maxId = currentId;
    }
  }

  return maxId;
}

addDocument(newDocument: Document) {
  if (!newDocument) {
    return;
  }

  this.maxDocumentId++;
  newDocument.id = this.maxDocumentId.toString();
  this.documents.push(newDocument);
  const documentsListClone = this.documents.slice();
  this.documentListChangedEvent.next(documentsListClone);
}

updateDocument(originalDocument: Document, newDocument: Document) {
  if (!originalDocument || !newDocument) {
    return;
  }

  const pos = this.documents.indexOf(originalDocument);
  if (pos < 0) {
    return;
  }

  newDocument.id = originalDocument.id;
  this.documents[pos] = newDocument;
  const documentsListClone = this.documents.slice();
  this.documentListChangedEvent.next(documentsListClone);
}


}

