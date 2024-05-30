import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { ChatService } from './services/chat.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ng-chat-socket';
  urlBase: string = 'http://localhost:8080';
  userId: string = '1';

  constructor(private chatService: ChatService, private router:Router) { }

  onSubmit(): void {
    this.chatService.setUrl(this.urlBase);
    this.chatService.setUserId(this.userId);
    this.router.navigate([`/chat/${this.userId}`]);
  }
}
