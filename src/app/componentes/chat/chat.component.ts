import { Component, OnInit } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from '../../../environments/environment.prod';

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
  
  private urlService: string = environment.apiUrl+'/mensajehub';

  private connection: HubConnection;

  constructor() {
    this.connection = new HubConnectionBuilder()
      .withUrl(this.urlService)
      .build();
      this.connection.on("grupo1", message => this.newMessage(message));
  }

  ngOnInit(): void {
    this.connection.start()
      .then(_ => {
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
    this.conversation.push(message);
  }


}
