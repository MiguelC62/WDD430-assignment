import { Component, OnDestroy, OnInit } from '@angular/core';
import { Document } from '../document.model';

import { DocumentService } from '../document.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit, OnDestroy {

  documents: Document [] = [];
  documentId: string ='';
  subscription: Subscription;

  constructor(private documentService: DocumentService) {
    this.documentService.getDocuments().subscribe({
      next: (documents: Document[]) => {
        this.documents = documents;
      },
      error: (error: any) => {
        console.error('An error occurred:', error);
      }
  });
  }

  ngOnInit() {
    
    this.subscription = this.documentService.documentListChangedEvent
    .subscribe((documentsList: Document[]) => {this.documents = documentsList});
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
