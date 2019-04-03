import {Observable, Subject} from "rxjs";
import { ToastService } from '.';
import {Subscription} from "rxjs/Subscription";

export abstract class CollectionProxy {

  protected loaded = new Subject<any>();

  public loaded$ = this.loaded.asObservable();
  public collection = [];


  protected onGoing: Observable<any>|null = null;

  protected constructor(protected toast: ToastService) {}

  public getAll(force: boolean = false): Observable<any> {
    return _.isEmpty(this.collection) || force ?
      this.loadAll() : Observable.from([this.collection]);
  }


  protected loadAll(): Observable<any> {
    const subject = new Subject();
    const currentRequest = this.onGoing ? this.onGoing : this.loadCollection().share();
    this.onGoing = currentRequest;
    currentRequest.subscribe(
      (response) => {
      this.collection = this.handleResponse(response);
      this.loaded.next(this.collection);
      subject.next(this.collection);
      subject.complete();
      this.onGoing = null;
    }, (error) => {
        subject.error(error);
        subject.complete();
        this.toast.error(error);
    });
    return subject.asObservable();
  }

  protected handleResponse(response): any {
    return response;
  }

  protected abstract loadCollection(): Observable<any>;


  // loader generator

  protected storedValues = {};
  protected runningLoaders = {};

  protected createLoader(name, subscriber) {
    let loader = this.loaderName(name);
    CollectionProxy.prototype[loader] = function() {
      let subs = this.runningLoaders[loader];
      if (!subs) {
        subs = this.wrapper(subscriber,
          (data) => this.storedValues[name] = data,
          null,
          () => this.runningLoaders[loader] = undefined
        );
        this.runningLoaders[loader] = subs;
      }
      return subs;
    }

    // Main getter
    CollectionProxy.prototype[name] = function() {
      let value = this.storedValues[name];
      let mainLoader;
      if (_.isEmpty(value)) {
        mainLoader = this[loader]();
      } else {
        mainLoader = Observable.from([value])
      }
      return mainLoader;
    }
  }

  private loaderName(name) {
    return `get${_.capitalize(name)}`;
  }

  private wrapper(subscriber, onNext = null, onError = null, onComplete = null) {
    let source = new Subject();
    subscriber.share().subscribe(
      (data) => {
        if (onNext) onNext(data)
        source.next(data);
        source.complete()
      },
      (error) => {
        if (onError) onNext(onError)
        this.toast.error(error);
        source.error(error);
        source.complete();
      },
      () => {
        if (onComplete) onComplete();
      }

    );

    return source.asObservable();;
  }
}
