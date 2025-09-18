import { createSelector } from '@ngrx/store';
import {
  playersAdapter,
  messagesAdapter,
  selectActiveScene,
  selectAiStatus,
  selectAiSuggestion,
  selectConnectionStatus,
  selectError,
  selectStatus,
  tableFeatureKey,
  selectTableState,
} from './table.reducer';

const selectPlayersState = createSelector(selectTableState, (state) => state.players);
const selectMessagesState = createSelector(selectTableState, (state) => state.messages);

const { selectAll: selectAllPlayers, selectEntities: selectPlayerEntities } =
  playersAdapter.getSelectors(selectPlayersState);

const { selectAll: selectAllMessages } = messagesAdapter.getSelectors(selectMessagesState);

export const selectTableViewModel = createSelector(
  selectStatus,
  selectConnectionStatus,
  selectError,
  (status, connectionStatus, error) => ({
    status,
    connectionStatus,
    error,
    isLoading: status === 'loading',
  }),
);

export const selectOnlinePlayers = createSelector(selectAllPlayers, (players) =>
  players.filter((player) => player.presence === 'online'),
);

export const selectPlayerById = (id: string) =>
  createSelector(selectPlayerEntities, (entities) => entities[id] ?? null);

export const selectChatMessages = createSelector(
  selectAllMessages,
  selectPlayerEntities,
  (messages, entities) =>
    messages.map((message) => ({
      ...message,
      authorName:
        message.authorType === 'ai'
          ? 'Aurora (AI)'
          : message.authorType === 'system'
          ? 'System'
          : entities[message.authorId]?.name ?? 'Unknown Adventurer',
      accentColor:
        message.authorType === 'player'
          ? entities[message.authorId]?.color ?? 'var(--ion-color-primary)'
          : 'var(--ion-color-tertiary)',
    })),
);

export const selectSceneDetails = selectActiveScene;

export const selectAiAssistantState = createSelector(
  selectAiStatus,
  selectAiSuggestion,
  (status, suggestion) => ({
    status,
    suggestion,
    isThinking: status === 'thinking',
  }),
);

export const selectTableFeatureState = selectTableState;

export const TABLE_FEATURE_KEY = tableFeatureKey;
