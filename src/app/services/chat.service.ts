import { Injectable } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { ChatMessage } from '../models/chat-message';
import { BehaviorSubject, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private urlBase:string = 'http://localhost:8080';
  private userId:string = '1';

  private stompClient: any;
  private messageSubject: BehaviorSubject<ChatMessage[]> = new BehaviorSubject<ChatMessage[]>([]);


  constructor(private http: HttpClient) {
    this.initConnectionSocket();
  }

  initConnectionSocket() {
    const url = `${this.urlBase}/chat-socket`;
    const socket = new SockJS(url); // defino la url para crear el socket
    this.stompClient = Stomp.over(socket); // creo la coneccion websocket usando el socket anterior

  }

  joinRoom(roomId: string) {
    this.stompClient.connect({}, () =>{
      this.stompClient.subscribe(`/topic/${roomId}`, (messages: any) =>{
        const messageContent = JSON.parse(messages.body);
        const currentMessage = this.messageSubject.getValue();
        currentMessage.push(messageContent);
        
        this.messageSubject.next(currentMessage); // le envio los mensajes al listener
      });
    });
    this.loadMessage(roomId);
  }

  sendMessage(roomId: string, chatMessage: ChatMessage) {
    this.stompClient.send(`/app/chat/${roomId}`, {}, JSON.stringify(chatMessage));
  }

  getMessageSubject(){
    return this.messageSubject.asObservable(); // con este metodo retorno lo que tiene mi listener
  }

  loadMessage(roomId: string): void {
    this.http.get<any[]>(`${this.urlBase}/api/chat/${roomId}`).pipe(
      map(result => {
        return result.map(res => {
          return {
            user: res.from,
            message: res.message
          } as ChatMessage
        })
      })
    ).subscribe({
      next: (chatMessage: ChatMessage[]) => {
        this.messageSubject.next(chatMessage);
      },
      error: (error) => {
        console.log(error);    
      }
    })
  }

  setUrl(url:string){
    this.urlBase = url;
    const socket = new SockJS(url); // defino la url para crear el socket
    this.stompClient = Stomp.over(socket); // creo la coneccion websocket usando el socket anterior
  }

  setUserId(userId:string){
    this.userId = userId;
  }

  getUserId() {
    return this.userId;
  }

}