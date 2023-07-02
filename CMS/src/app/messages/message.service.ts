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
  
  private firebaseUrl = 'http://localhost:3000/messages/';
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
  
  getMessages() {
    this.http.get<{messages: Message[]}>('http://localhost:3000/messages/')
        .subscribe({
          next: (responseData) => {
            this.messages = responseData.messages;
            this.sortAndSend();
          },
          error: (error: any) => {
            console.log(error);
          } 
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

  addMessage(message: Message) {
    if (!message) {
      return;
    }
  
    // make sure id of the new Message is empty
  message.id = '';

  const headers = new HttpHeaders({'Content-Type': 'application/json'});

  // add to database
  this.http.post<{ message: Message, document: Document }>('http://localhost:3000/messages',
    message,
    { headers: headers })
    .subscribe(
      (responseData) => {
        // add new document to documents
        this.messages.push(responseData.message);
        this.sortAndSend();
      }
    );
  }

  
updateMessage(originalMessage: Message, newMessage: Message) {
  if (!originalMessage || !newMessage) {
    return;
  }

  const pos = this.messages.findIndex(m => m.id === originalMessage.id);

  if (pos < 0) {
    return;
  }

  // set the id of the new Document to the id of the old Document
  newMessage.id = originalMessage.id;

  const headers = new HttpHeaders({'Content-Type': 'application/json'});

  // update database
  this.http.put('http://localhost:3000/messages/' + originalMessage.id,
    newMessage, { headers: headers })
    .subscribe(
      (response: Response) => {
        this.messages[pos] = newMessage;
        this.sortAndSend();
      }
    );
}

deleteDocument(message: Message) {

  if (!message) {
    return;
  }

  const pos = this.messages.findIndex(m => m.id === message.id);

  if (pos < 0) {
    return;
  }

  // delete from database
  this.http.delete('http://localhost:3000/messages/' + message.id)
    .subscribe(
      (response: Response) => {
        this.messages.splice(pos, 1);
        this.sortAndSend();
      }
    );
}
  sortAndSend() {
    // Ordenar los documentos por ID de forma ascendente
    this.messages.sort((a, b) => (a.id > b.id) ? 1: (b.id > a.id) ? -1: 0 );
    this.messageListChangedEvent.next(this.messages.slice());
  }

}
