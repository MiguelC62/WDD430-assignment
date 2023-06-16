import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class DocumentService {
  documents: Document[] = [];
  maxDocumentId: number = 0;
  documentListChangedEvent =new Subject<Document[]>();
  private firebaseUrl = 'https://maccms-91845-default-rtdb.firebaseio.com/documents.json';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { 
    this.documents = MOCKDOCUMENTS;
    this.maxDocumentId = this.getMaxId();
  }
  
  storeDocuments(documents: Document[]): void {
    const documentListString = JSON.stringify(documents);
    this.http.put(this.firebaseUrl, documentListString, this.httpOptions)
      .subscribe(() => {
        const documentsListClone = this.documents.slice();
        this.documentListChangedEvent.next(documentsListClone);
      });
  }
  
  getDocuments(): Observable<Document[]> {
    return new Observable((observer) => {
      this.http.get<Document[]>(this.firebaseUrl)
        .subscribe({
          next: (documents: Document[]) => {
            this.documents = documents;
            this.maxDocumentId = this.getMaxId();
            this.documents.sort((a, b) => a.name.localeCompare(b.name));
            this.documentListChangedEvent.next(this.documents.slice());
          },
          error: (error: any) => {
            console.error('An error occurred:', error);
            observer.error(error);
          }
    });
    });
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

  this.storeDocuments(this.documents);
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
  this.storeDocuments(this.documents);
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
  this.storeDocuments(this.documents);
}

}

