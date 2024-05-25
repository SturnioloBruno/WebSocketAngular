import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../services/chat.service';
import { ChatMessage } from '../../models/chat-message';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit{

  constructor(private chatService: ChatService) {

  }
  ngOnInit(): void {
    this.chatService.joinRoom("ABC");
  }

  sendMessage() {
    const chatMessage = {
      message: 'HOLA',
      user: '1'
    }as ChatMessage
    this.chatService.sendMessage("ABC", chatMessage);
  }
}
