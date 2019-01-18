import { Injectable } from '@angular/core';

export enum AsyncGraphNodeMode {
  raceAndCancel = '[Async Graph Node Mode] Race And Cancel',
  race = '[Async Graph Node Mode] Race',
  all = '[Async Graph Node Mode] All'
}

export enum AsyncGraphNodeLinkMode {
  next = '[Async Graph Node Link Mode] Next',
  error = '[Async Graph Node Link Mode] Error',
  cancel = '[Async Graph Node Link Mode] Cancel',
}

export interface AsyncGraphNodeLink {
  master: AsyncGraphNode;
  slave: AsyncGraphNode;
  mode: AsyncGraphNodeLinkMode;
  target: boolean;
}

export class AsyncGraphNode<T = any> {
  mode: AsyncGraphNodeMode;
  visitRefCount: number;
  masterRefCount: number;
  links: AsyncGraphNodeLink[];
  payload: T;
}

@Injectable({
  providedIn: 'root'
})
export class AsyncGraphService {

  constructor() { }
}
