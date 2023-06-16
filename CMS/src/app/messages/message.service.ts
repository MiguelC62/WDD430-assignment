import { Injectable} from '@angular/core';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';
import { Observable, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class MessageService {
  private messages: Message[] = [];
  maxMessageId: number = 0;
  messageListChangedEvent =new Subject<Message[]>();
  private firebaseUrl = 'https://maccms-91845-default-rtdb.firebaseio.com/messages.json';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { 
    this.messages = MOCKMESSAGES;
    this.maxMessageId = this.getMaxId();
  }
  
  storeMessages(messages: Message[]): void {
    const messageListString = JSON.stringify(messages);
    this.http.put(this.firebaseUrl, messageListString, this.httpOptions)
      .subscribe(() => {
        const messagesListClone = this.messages.slice();
        this.messageListChangedEvent.next(messagesListClone);
      });
  }
  
  getMessages(): Observable<Message[]> {
    return new Observable((observer) => {
      this.http.get<Message[]>(this.firebaseUrl)
        .subscribe({
          next: (messages: Message[]) => {
            this.messages = messages;
            this.maxMessageId = this.getMaxId();
            this.messages.sort((a, b) => a.sender.localeCompare(b.sender));
            this.messageListChangedEvent.next(this.messages.slice());
          },
          error: (error: any) => {
            console.error('An error occurred:', error);
            observer.error(error);
          }
    });
    });
  }
    
  getMessage(id: string): Message {
    for (const message of this.messages) {
      if (message.id === id) {
        return message;
      }
    }
    return null;
   }
   getMaxId(): number {
    let maxId = 0;
  
    for (const message of this.messages) {
      const currentId = parseInt(message.id, 10);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }

  addMessage(newMessage: Message) {
    if (!newMessage) {
      return;
    }
  
    this.maxMessageId++;
    newMessage.id = this.maxMessageId.toString();
    this.messages.push(newMessage);
    this.storeMessages(this.messages);
  }

}
