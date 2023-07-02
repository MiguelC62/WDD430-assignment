import { Injectable } from '@angular/core';
import { Contact } from './contact.model';
import {MOCKCONTACTS} from './MOCKCONTACTS';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  contacts: Contact[] = [];
  maxContactId: number = 0;
  contactListChangedEvent = new Subject<Contact[]>();
  
  private firebaseUrl = 'http://localhost:3000/contacts';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { 
    this.contacts = MOCKCONTACTS;
    this.maxContactId = this.getMaxId();
  }

  storeContacts(contacts: Contact[]): void {
    const contactListString = JSON.stringify(contacts);
    this.http.put(this.firebaseUrl, contactListString, this.httpOptions)
      .subscribe(() => {
        const contactsListClone = this.contacts.slice();
        this.contactListChangedEvent.next(contactsListClone);
      });
  }

  getContact(id: string) {
    return this.http.get<{message: string, contact: Contact}>('http://localhost:3000/contacts/'+id);
  } 
  
  getContacts() {
      this.http.get<{message: string, contacts: Contact[]}>('http://localhost:3000/contacts/')
        .subscribe({
          next: (responseData) => {
            this.contacts = responseData.contacts;
            this.sortAndSend();
          },
          error: (error: any) => {
            console.log(error);
          } 
        });
  }

  deleteContact(contact: Contact) {
  if (!contact) {
      return;
  }
  const pos = this.contacts.findIndex(c => c.id === contact.id);
  if (pos < 0) {
      return;
  }

  // delete from database
  this.http.delete('http://localhost:3000/contacts/' + contact.id)
    .subscribe(
      (response: Response) => {
        this.contacts.splice(pos, 1);
        this.sortAndSend();
      }
    );
  }

  getMaxId(): number {
    let maxId = 0;
    for (const contact of this.contacts) {
      const currentId = parseInt(contact.id, 10);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  addContact(contact: Contact) {
    if (!contact) {
      return;
    }
  
    // make sure id of the new Document is empty
    contact.id = '';
  
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
  
    // add to database
    this.http.post<{ message: string, contact: Contact }>('http://localhost:3000/contacts',
      contact,
      { headers: headers })
      .subscribe(
        (responseData) => {
          // add new document to documents
          this.contacts.push(responseData.contact);
          this.sortAndSend();
        }
      );
  }
  
  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {
      return;
    }
  
    const pos = this.contacts.findIndex(c => c.id === originalContact.id);

  if (pos < 0) {
    return;
  }

  // set the id of the new Document to the id of the old Document
  newContact.id = originalContact.id;
  
  const headers = new HttpHeaders({'Content-Type': 'application/json'});

  // update database
  this.http.put('http://localhost:3000/contacts/' + originalContact.id,
    newContact, { headers: headers })
    .subscribe(
      (response: Response) => {
        this.contacts[pos] = newContact;
        this.sortAndSend();
      }
    );
  }

  sortAndSend() {
    // Ordenar los documentos por ID de forma ascendente
    this.contacts.sort((a, b) => a.name > b.name ? 1: b.name > a.name ? -1: 0 );
    this.contactListChangedEvent.next(this.contacts.slice());
  }
  

}


