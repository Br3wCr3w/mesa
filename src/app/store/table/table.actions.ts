import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Message, TableSnapshot } from './table.models';

export const TableActions = createActionGroup({
  source: 'Table',
  events: {
    'Enter Table': emptyProps(),
    'Enter Table Success': props<{ snapshot: TableSnapshot }>(),
    'Enter Table Failure': props<{ error: string }>(),
    'Send Chat Message': props<{ authorId: string; content: string }>(),
    'Message Received': props<{ message: Message }>(),
    'Toggle Player Audio': props<{ playerId: string }>(),
    'Set Player Speaking': props<{ playerId: string; speaking: boolean }>(),
    'Request Ai Guidance': props<{ prompt: string }>(),
    'Ai Guidance Pending': emptyProps(),
    'Ai Guidance Received': props<{ message: Message; suggestion: string }>(),
  },
});
