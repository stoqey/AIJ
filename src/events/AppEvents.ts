import EventEmitter from "events";

export class AppEvents extends EventEmitter.EventEmitter {
  private cache = {};
  private static _instance: AppEvents;

  public static get Instance(): AppEvents {
    return this._instance || (this._instance = new this());
  }

  private constructor() {
    super();
  }
}
