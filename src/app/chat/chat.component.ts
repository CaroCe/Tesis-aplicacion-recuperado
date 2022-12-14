import { Component, OnInit } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  public userName = '';
  public groupName = '';
  public messageToSend = '';
  public joined = false;
  public conversation: string[] = [];

  private connection: HubConnection;

  constructor() {
    this.connection = new HubConnectionBuilder()
      .withUrl('https://localhost:44329/mensajehub')
      .build();
      this.connection.on("grupo1", message => this.newMessage(message));
    this.connection.on("grupo3", message => this.newMessage(message));
  }

  ngOnInit(): void {
    this.connection.start()
      .then(_ => {
        console.log('Connection Started');
      }).catch(error => {
        return console.error(error);
      });
  }

  public sendMessage() {
    this.connection.invoke('SendMessage', this.messageToSend)
      .then(_ =>{
        this.messageToSend = ''
      }
        
        );
  }

  private newMessage(message: string) {
    console.log(message);
    this.conversation.push(message);
  }


}
