import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { TelegramService } from '../../services/telegram.service';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css'
})
export class FeedbackComponent implements OnInit, OnDestroy {
  feedback = signal<string>('');

  constructor(private telegram: TelegramService) {
    this.onSendFeedback = this.onSendFeedback.bind(this);
  }

  ngOnInit(): void {
    this.telegram.MainButton.setText('Send feedback');
    this.telegram.MainButton.show();
    this.telegram.MainButton.disable();
    this.telegram.MainButton.onClick(this.onSendFeedback);
  }

  onSendFeedback(): void {
    this.telegram.sendData({ feedback: this.feedback() });
  }

  handleChange(event): void {
    this.feedback.set(event.target.value);

    if (this.feedback().trim()) {
      this.telegram.MainButton.enable();
    } else {
      this.telegram.MainButton.disable();
    }
  }

  ngOnDestroy(): void {
    this.telegram.MainButton.offClick(this.onSendFeedback);
  }
}
