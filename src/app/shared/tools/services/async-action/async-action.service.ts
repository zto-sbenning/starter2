import { Injectable } from '@angular/core';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Action, Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

export const asyncStoreReducerKey = 'asyncStore';
export enum AsyncStateStatus {
  idle = '[Async State Status] Idle',
  pending = '[Async State Status] Pending',
  resolved = '[Async State Status] Resolved',
}
export enum AsyncStateResolvedStatus {
  success = '[Async State Resolved Status] Success',
  error = '[Async State Resolved Status] Error',
  cancel = '[Async State Resolved Status] Cancel',
}
export interface AsyncState<P = any, R = any, E = any> {
  id: string;
  type: string;
  createdTs: number;
  status: AsyncStateStatus;
  startedTs?: number;
  resolvedStatus?: AsyncStateResolvedStatus;
  resolvedTs?: number;
  payload?: P;
  result?: R | E;
}
export interface AsyncStore {
  states: EntityState<AsyncState>;
}
export const asyncStateEntityAdapter: EntityAdapter<AsyncState> = createEntityAdapter({sortComparer: false});
export const initialAsyncStore: AsyncStore = {
  states: asyncStateEntityAdapter.getInitialState(),
};
export enum AsyncStateActionType {
  create = '[Async State Action Type] Create',
  start = '[Async State Action Type] Start',
  delete = '[Async State Action Type] Delete',
  cancel = '[Async State Action Type] Cancel',
  resolveSuccess = '[Async State Action Type] Resolve Success',
  resolveError = '[Async State Action Type] Resolve Error',
  resolveCancel = '[Async State Action Type] Resolve Cancel',
}
export class CreateAsyncState<P = any> implements Action {
  type = AsyncStateActionType.create;
  constructor(public payload: { id: string, type: string, createdTs: number, payload?: P }) {}
}
export class StartAsyncState implements Action {
  type = AsyncStateActionType.start;
  constructor(public payload: { id: string, startedTs: number }) {}
}
export class DeleteAsyncState implements Action {
  type = AsyncStateActionType.delete;
  constructor(public payload: { id: string }) {}
}
export class CancelAsyncState implements Action {
  type = AsyncStateActionType.cancel;
  constructor(public payload: { id: string }) {}
}
export class ResolveSuccessAsyncState<R = any> implements Action {
  type = AsyncStateActionType.resolveSuccess;
  constructor(public payload: { id: string, resolvedTs: number, result?: R }) {}
}
export class ResolveErrorAsyncState<E = Error> implements Action {
  type = AsyncStateActionType.resolveError;
  constructor(public payload: { id: string, resolvedTs: number, result?: E }) {}
}
export class ResolveCancelAsyncState implements Action {
  type = AsyncStateActionType.resolveCancel;
  constructor(public payload: { id: string, resolvedTs: number }) {}
}
export type AsyncStateActions = CreateAsyncState
  | StartAsyncState
  | DeleteAsyncState
  | CancelAsyncState
  | ResolveSuccessAsyncState
  | ResolveErrorAsyncState
  | ResolveCancelAsyncState;
export function asyncStoreReducer(state: AsyncStore = initialAsyncStore, action: AsyncStateActions): AsyncStore {
  switch (action.type) {
    case AsyncStateActionType.create: {
      const payload = (action as CreateAsyncState).payload;
      return {
        states: asyncStateEntityAdapter.addOne({
          id: payload.id,
          type: payload.type,
          payload: payload.payload,
          createdTs: payload.createdTs,
          status: AsyncStateStatus.idle,
        }, state.states),
      };
    }
    case AsyncStateActionType.start: {
      const payload = (action as StartAsyncState).payload;
      return {
        states: asyncStateEntityAdapter.updateOne({
          id: payload.id,
          changes: {
            status: AsyncStateStatus.pending,
            startedTs: payload.startedTs
          }
        }, state.states),
      };
    }
    case AsyncStateActionType.delete: {
      return {
        states: asyncStateEntityAdapter.removeOne(action.payload.id, state.states),
      };
    }
    case AsyncStateActionType.resolveSuccess: {
      const payload = (action as ResolveSuccessAsyncState).payload;
      return {
        states: asyncStateEntityAdapter.updateOne({
          id: action.payload.id,
          changes: {
            status: AsyncStateStatus.resolved,
            resolvedStatus: AsyncStateResolvedStatus.success,
            resolvedTs: payload.resolvedTs,
            result: payload.result
          }
        }, state.states),
      };
    }
    case AsyncStateActionType.resolveError: {
      const payload = (action as ResolveErrorAsyncState).payload;
      return {
        states: asyncStateEntityAdapter.updateOne({
          id: action.payload.id,
          changes: {
            status: AsyncStateStatus.resolved,
            resolvedStatus: AsyncStateResolvedStatus.error,
            resolvedTs: payload.resolvedTs,
            result: payload.result
          }
        }, state.states),
      };
    }
    case AsyncStateActionType.resolveCancel: {
      const payload = (action as ResolveCancelAsyncState).payload;
      return {
        states: asyncStateEntityAdapter.updateOne({
          id: action.payload.id,
          changes: {
            status: AsyncStateStatus.resolved,
            resolvedStatus: AsyncStateResolvedStatus.cancel,
            resolvedTs: payload.resolvedTs
          }
        }, state.states),
      };
    }
    case AsyncStateActionType.cancel:
    default:
      return state;
  }
}

@Injectable({
  providedIn: 'root'
})
export class AsyncActionService {

  constructor(private store: Store<any>) { }

  create<P = any>(id: string, type: string, payload?: P) {
    const createdTs = Date.now();
    this.store.dispatch(new CreateAsyncState({ id, type, createdTs, payload }));
  }
  start(id: string) {
    const startedTs = Date.now();
    this.store.dispatch(new StartAsyncState({ id, startedTs }));
  }
  cancel(id: string) {
    this.store.dispatch(new CancelAsyncState({ id }));
  }
  delete(id: string) {
    this.store.dispatch(new DeleteAsyncState({ id }));
  }
  resolveSuccess<R = any>(id: string, result?: R) {
    const resolvedTs = Date.now();
    this.store.dispatch(new ResolveSuccessAsyncState({ id, resolvedTs, result }));
  }
  resolveError<E = Error>(id: string, result?: E) {
    const resolvedTs = Date.now();
    this.store.dispatch(new ResolveErrorAsyncState({ id, resolvedTs, result }));
  }
  resolveCancel(id: string) {
    const resolvedTs = Date.now();
    this.store.dispatch(new ResolveCancelAsyncState({ id, resolvedTs }));
  }
  select(id: string): Observable<AsyncState> {
    return this.store.pipe(select((states: any) => (states[asyncStoreReducerKey] as AsyncStore).states.entities[id]));
  }

}
