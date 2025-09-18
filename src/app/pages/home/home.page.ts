import { ChangeDetectionStrategy, Component, OnInit, TrackByFunction } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { TableFacade } from '../../store/table/table.facade';
import { Message, Player } from '../../store/table/table.models';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage implements OnInit {
  readonly viewModel$ = this.tableFacade.viewModel$;
  readonly players$ = this.tableFacade.players$;
  readonly messages$ = this.tableFacade.messages$;
  readonly scene$ = this.tableFacade.scene$;
  readonly aiAssistant$ = this.tableFacade.aiAssistant$;

  readonly chatForm = this.formBuilder.nonNullable.group({
    message: ['', [Validators.required, Validators.minLength(2)]],
  });

  readonly aiForm = this.formBuilder.nonNullable.group({
    prompt: ['', [Validators.required, Validators.minLength(3)]],
  });

  readonly trackByMessage: TrackByFunction<Message & { authorName: string }> = (_, item) => item.id;
  readonly trackByPlayer: TrackByFunction<Player> = (_, item) => item.id;

  private readonly hostPlayerId = 'guide-01';

  constructor(
    private readonly tableFacade: TableFacade,
    private readonly formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.tableFacade.enterTable();
  }

  sendMessage(): void {
    if (this.chatForm.invalid) {
      this.chatForm.markAllAsTouched();
      return;
    }

    const message = this.chatForm.controls.message.value.trim();
    if (!message) {
      return;
    }

    this.tableFacade.sendChatMessage(this.hostPlayerId, message);
    this.chatForm.reset({ message: '' });
  }

  requestGuidance(): void {
    if (this.aiForm.invalid) {
      this.aiForm.markAllAsTouched();
      return;
    }

    const prompt = this.aiForm.controls.prompt.value.trim();
    if (!prompt) {
      return;
    }

    this.tableFacade.requestAiGuidance(prompt);
    this.aiForm.reset({ prompt: '' });
  }

  toggleAudio(playerId: string): void {
    this.tableFacade.togglePlayerAudio(playerId);
  }
}
