import { Component, OnDestroy, OnInit} from '@angular/core';
import { Contact } from '../contact.model';

import { ContactService } from '../contact.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cms-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit, OnDestroy {
  
  contacts: Contact [] = [];
  subscription: Subscription;
  term: string = "";

  constructor(private contactService: ContactService) {}   
  
  search(value: string) {
    this.term = value;
  }

  ngOnInit() {
     this.subscription =this.contactService.contactListChangedEvent
     .subscribe(
      (contactsList: Contact[]) => {
        this.contacts = contactsList;
      }
      );
    this.contactService.getContacts();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  
}
