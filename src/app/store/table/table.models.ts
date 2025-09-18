export type ConnectionStatus = 'idle' | 'connecting' | 'online';

export interface Player {
  id: string;
  name: string;
  role: string;
  color: string;
  isMuted: boolean;
  isSpeaking: boolean;
  presence: 'online' | 'away';
}

export type MessageAuthorType = 'player' | 'ai' | 'system';

export interface Message {
  id: string;
  authorId: string;
  authorType: MessageAuthorType;
  content: string;
  createdAt: string;
  channel: 'table' | 'whisper';
}

export interface Scene {
  id: string;
  title: string;
  summary: string;
  ambience: string;
  illustrationUrl: string;
}

export interface TableSnapshot {
  players: Player[];
  messages: Message[];
  scene: Scene;
  connectionStatus: ConnectionStatus;
}
