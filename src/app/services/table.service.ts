import { Injectable } from '@angular/core';
import { defer, delay, Observable, of } from 'rxjs';
import { Message, Player, Scene, TableSnapshot } from '../store/table/table.models';

const AI_PLAYER_ID = 'aurora-ai';

@Injectable({ providedIn: 'root' })
export class TableService {
  loadSnapshot(): Observable<TableSnapshot> {
    const snapshot: TableSnapshot = {
      connectionStatus: 'online',
      players: this.createInitialPlayers(),
      messages: this.createInitialMessages(),
      scene: this.createInitialScene(),
    };

    return of(snapshot).pipe(delay(300));
  }

  requestAiGuidance(prompt: string): Observable<{ message: Message; suggestion: string }> {
    return defer(() => {
      const suggestion = `Aurora senses your curiosity about "${prompt}" and recommends focusing on narrative hooks and player spotlights.`;
      const message = this.createAiMessage(
        `Here is a quick beat you can weave in: ${prompt} reveals an ancient sigil that reacts to the party's emotions. Invite everyone to describe how their characters feel as the magic unfolds.`,
      );
      return of({ message, suggestion }).pipe(delay(850));
    });
  }

  createPlayerMessage(authorId: string, content: string): Message {
    return {
      id: this.createId(),
      authorId,
      authorType: 'player',
      content,
      createdAt: new Date().toISOString(),
      channel: 'table',
    };
  }

  createAiMessage(content: string): Message {
    return {
      id: this.createId(),
      authorId: AI_PLAYER_ID,
      authorType: 'ai',
      content,
      createdAt: new Date().toISOString(),
      channel: 'table',
    };
  }

  private createInitialPlayers(): Player[] {
    return [
      {
        id: 'guide-01',
        name: 'Mara',
        role: 'Guide',
        color: 'var(--mesa-player-guide, #ff6ec7)',
        isMuted: false,
        isSpeaking: false,
        presence: 'online',
      },
      {
        id: 'strategist-01',
        name: 'Orin',
        role: 'Strategist',
        color: 'var(--mesa-player-strategist, #45f7b4)',
        isMuted: false,
        isSpeaking: true,
        presence: 'online',
      },
      {
        id: 'lorekeeper-01',
        name: 'Nyx',
        role: 'Lorekeeper',
        color: 'var(--mesa-player-lore, #7bc8ff)',
        isMuted: true,
        isSpeaking: false,
        presence: 'online',
      },
      {
        id: AI_PLAYER_ID,
        name: 'Aurora',
        role: 'AI Director',
        color: 'var(--mesa-player-ai, #f5d97f)',
        isMuted: false,
        isSpeaking: false,
        presence: 'online',
      },
    ];
  }

  private createInitialMessages(): Message[] {
    return [
      {
        id: this.createId(),
        authorId: AI_PLAYER_ID,
        authorType: 'ai',
        content:
          'Aurora calibrated ambience: dusk horizon with shimmering wards. Tactical overlays synced to the board.',
        createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        channel: 'table',
      },
      {
        id: this.createId(),
        authorId: 'strategist-01',
        authorType: 'player',
        content: 'Can we get a tactical breakdown of the south archway? I want to scout safe cover.',
        createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
        channel: 'table',
      },
      {
        id: this.createId(),
        authorId: AI_PLAYER_ID,
        authorType: 'ai',
        content:
          'South archway offers partial cover. Two sentries rotate every 18 seconds. Suggest a coordinated advance with Nyx providing arcane dampening.',
        createdAt: new Date(Date.now() - 1000 * 60).toISOString(),
        channel: 'table',
      },
    ];
  }

  private createInitialScene(): Scene {
    return {
      id: 'scene-sundown-hold',
      title: 'Sundown Hold',
      summary:
        'Ruined battlements under a neon sky. Wards flicker as the party approaches the inner sanctum where the dusk reliquary hums.',
      ambience: 'Synthwave dusk with crystalline wind and distant chanting.',
      illustrationUrl: 'assets/img/sundown-hold.jpg',
    };
  }

  private createId(): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}
