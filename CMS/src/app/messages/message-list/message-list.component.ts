import { Component, OnInit } from '@angular/core';
import { Message } from '../message.model';
import { MessageService } from '../message.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit {
  messages: Message[] = [];
  subscription: Subscription;

  constructor(private messageService: MessageService){}
  
  ngOnInit(){
   //suscribe to message chage event in message service
   this.subscription = this.messageService.messageListChangedEvent
   .subscribe((messagesList: Message[]) => {this.messages = messagesList});
  // load messages
  this.messageService.getMessages();
  }
  
}
