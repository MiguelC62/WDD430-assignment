import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Document } from '../document.model';
import { DocumentService } from '../document.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'cms-document-edit',
  templateUrl: './document-edit.component.html',
  styleUrls: ['./document-edit.component.css']
})

export class DocumentEditComponent implements OnInit {
  originalDocument: Document;
  document: Document;
  editMode: boolean=false;
  id: string;
  
  constructor(
    private documentService: DocumentService,
    private router: Router,
    private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.params
    .subscribe((params: Params) => {
      this.id = params['id'];
      if (this.id === undefined || this.id === null) {
        this.editMode = false;
        return;
      }

      this.documentService.getDocument(this.id)
      .subscribe(response => {
        this.originalDocument = response.document;
      });
      if (this.originalDocument === undefined || this.originalDocument === null) {
        return;
      }

      this.editMode = true;
      this.document = JSON.parse(JSON.stringify(this.originalDocument)); // Cloning the originalDocument
    });
    }

    onSubmit(form: NgForm): void {
      const value = form.value; // Get values from form's fields
      const newDocument = new Document(value._id,value.id,value.name, value.description, value.url, value.children);
      // Assign the values in the form fields to the corresponding properties in newDocument
      newDocument.name = value.name;
      newDocument.url = value.url;
  
      if (this.editMode) {
        this.documentService.updateDocument(this.originalDocument, newDocument);
      } else {
        this.documentService.addDocument(newDocument);
      }
  
      this.router.navigate(['/documents']); // Route back to the main documents view
    }
  

    onCancel(): void {
      this.router.navigate(['/documents']); // Route back to the '/documents' URL
    }
}

