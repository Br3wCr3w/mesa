import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createFeature, createReducer, on } from '@ngrx/store';
import { TableActions } from './table.actions';
import { ConnectionStatus, Message, Player, Scene } from './table.models';

export const tableFeatureKey = 'table';

type TableStatus = 'idle' | 'loading' | 'ready' | 'error';

type AiStatus = 'idle' | 'thinking';

export interface TableState {
  status: TableStatus;
  connectionStatus: ConnectionStatus;
  error: string | null;
  activeScene: Scene | null;
  aiStatus: AiStatus;
  aiSuggestion: string | null;
  players: EntityState<Player>;
  messages: EntityState<Message>;
}

export const playersAdapter = createEntityAdapter<Player>({
  sortComparer: (a, b) => a.name.localeCompare(b.name),
});

export const messagesAdapter = createEntityAdapter<Message>({
  sortComparer: (a, b) => a.createdAt.localeCompare(b.createdAt),
});

const initialState: TableState = {
  status: 'idle',
  connectionStatus: 'idle',
  error: null,
  activeScene: null,
  aiStatus: 'idle',
  aiSuggestion: null,
  players: playersAdapter.getInitialState(),
  messages: messagesAdapter.getInitialState(),
};

export const tableFeature = createFeature({
  name: tableFeatureKey,
  reducer: createReducer(
    initialState,
    on(TableActions.enterTable, (state) => ({
      ...state,
      status: 'loading',
      error: null,
      connectionStatus: 'connecting',
    })),
    on(TableActions.enterTableSuccess, (state, { snapshot }) => ({
      ...state,
      status: 'ready',
      connectionStatus: snapshot.connectionStatus,
      activeScene: snapshot.scene,
      aiSuggestion: snapshot.scene.summary,
      error: null,
      players: playersAdapter.setAll(snapshot.players, state.players),
      messages: messagesAdapter.setAll(snapshot.messages, state.messages),
    })),
    on(TableActions.enterTableFailure, (state, { error }) => ({
      ...state,
      status: 'error',
      connectionStatus: 'idle',
      error,
    })),
    on(TableActions.messageReceived, (state, { message }) => ({
      ...state,
      messages: messagesAdapter.addOne(message, state.messages),
    })),
    on(TableActions.togglePlayerAudio, (state, { playerId }) => ({
      ...state,
      players: playersAdapter.updateOne(
        {
          id: playerId,
          changes: {
            isMuted: !state.players.entities[playerId]?.isMuted,
          },
        },
        state.players,
      ),
    })),
    on(TableActions.setPlayerSpeaking, (state, { playerId, speaking }) => ({
      ...state,
      players: playersAdapter.updateOne(
        {
          id: playerId,
          changes: {
            isSpeaking: speaking,
          },
        },
        state.players,
      ),
    })),
    on(TableActions.aiGuidancePending, (state) => ({
      ...state,
      aiStatus: 'thinking',
    })),
    on(TableActions.aiGuidanceReceived, (state, { message, suggestion }) => ({
      ...state,
      aiStatus: 'idle',
      aiSuggestion: suggestion,
      messages: messagesAdapter.addOne(message, state.messages),
    })),
  ),
});

export const {
  name: tableFeatureName,
  reducer: tableReducer,
  selectTableState,
  selectStatus,
  selectConnectionStatus,
  selectError,
  selectActiveScene,
  selectAiStatus,
  selectAiSuggestion,
} = tableFeature;

