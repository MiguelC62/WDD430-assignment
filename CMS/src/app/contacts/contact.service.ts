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
  private firebaseUrl = 'https://maccms-91845-default-rtdb.firebaseio.com/contacts.json';
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
  getContacts(): Observable<Contact[]> {
    return new Observable((observer) => {
      this.http.get<Contact[]>(this.firebaseUrl)
        .subscribe({
          next: (contacts: Contact[]) => {
            this.contacts = contacts;
            this.maxContactId = this.getMaxId();
            this.contacts.sort((a, b) => a.name.localeCompare(b.name));
            this.contactListChangedEvent.next(this.contacts.slice());
          },
          error: (error: any) => {
            console.error('An error occurred:', error);
            observer.error(error);
          } 
    });
    });
  }

  getContact(id: string): Contact {
    for (const contact of this.contacts) {
      if (contact.id === id) {
        return contact;
      }
    }
    return null;
   }
  
  deleteContact(contact: Contact) {
  if (!contact) {
      return;
  }
  const pos = this.contacts.indexOf(contact);
  if (pos < 0) {
      return;
  }
  this.contacts.splice(pos, 1);
  this.storeContacts(this.contacts);
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

  addContact(newContact: Contact) {
    if (!newContact) {
      return;
    }
  
    this.maxContactId++;
    newContact.id = this.maxContactId.toString();
    this.contacts.push(newContact);
    this.storeContacts(this.contacts);
  }
  
  updateContact(originalContact: Contact, newContact: Contact) {
    if (!originalContact || !newContact) {
      return;
    }
  
    const pos = this.contacts.indexOf(originalContact);
    if (pos < 0) {
      return;
    }
  
    newContact.id = originalContact.id;
    this.contacts[pos] = newContact;
    this.storeContacts(this.contacts);
  }

}


