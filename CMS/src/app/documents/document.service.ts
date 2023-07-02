import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Document } from './document.model';
import { MOCKDOCUMENTS } from './MOCKDOCUMENTS';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class DocumentService {
  private documents: Document[] = [];
  maxDocumentId: number = 0;
  documentListChangedEvent =new Subject<Document[]>();
  
  private firebaseUrl = 'http://localhost:3000/documents';
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
  
  getDocuments() {
    this.http.get<{documents: Document[]}>('http://localhost:3000/documents/')
        .subscribe({
          next: (responseData) => {
            this.documents = responseData.documents;
            this.sortAndSend();
          },
          error: (error: any) => {
            console.log(error);
          } 
        });
  }
    
getDocument(id: string) {
     return this.http.get<{document: Document}>('http://localhost:3000/documents/'+ id);
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

addDocument(document: Document) {
  if (!document) {
    return;
  }

  // make sure id of the new Document is empty
  document.id = '';

  const headers = new HttpHeaders({'Content-Type': 'application/json'});

  // add to database
  this.http.post<{ message: string, document: Document }>('http://localhost:3000/documents',
    document,
    { headers: headers })
    .subscribe(
      (responseData) => {
        // add new document to documents
        this.documents.push(responseData.document);
        this.sortAndSend();
      }
    );
}

updateDocument(originalDocument: Document, newDocument: Document) {
  if (!originalDocument || !newDocument) {
    return;
  }

  const pos = this.documents.findIndex(d => d.id === originalDocument.id);

  if (pos < 0) {
    return;
  }

  // set the id of the new Document to the id of the old Document
  newDocument.id = originalDocument.id;
  newDocument._id = originalDocument._id;

  const headers = new HttpHeaders({'Content-Type': 'application/json'});

  // update database
  this.http.put('http://localhost:3000/documents/' + originalDocument.id,
    newDocument, { headers: headers })
    .subscribe(
      (response: Response) => {
        this.documents[pos] = newDocument;
        this.sortAndSend();
      }
    );
}

deleteDocument(document: Document) {

  if (!document) {
    return;
  }

  const pos = this.documents.findIndex(d => d.id === document.id);

  if (pos < 0) {
    return;
  }

  // delete from database
  this.http.delete('http://localhost:3000/documents/' + document.id)
    .subscribe(
      (response: Response) => {
        this.documents.splice(pos, 1);
        this.sortAndSend();
      }
    );
}
sortAndSend() {
  // Ordenar los documentos por ID de forma ascendente
  this.documents.sort((a, b) => (a.name > b.name) ? 1: (b.name > a.name) ? -1: 0 );
  this.documentListChangedEvent.next(this.documents.slice());
}

}

