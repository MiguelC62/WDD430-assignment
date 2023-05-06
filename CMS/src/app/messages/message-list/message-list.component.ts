import { Component, OnInit } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit {
  messages: Message[] = [
    new Message('1', 'subject 1', 'Message Text 1', 'Miguel Condori'),
    new Message('2', 'subject 2', 'Message Text 2', 'Miguel Condori'),
    new Message('3', 'subject 3', 'Message Text 3', 'Miguel Condori')
  ];

  constructor(){}

  ngOnInit(){

  }
  onAddMessage(message: Message){
    this.messages.push(message);
  }
}
