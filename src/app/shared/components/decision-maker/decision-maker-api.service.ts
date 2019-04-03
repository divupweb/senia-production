import {Injectable} from '@angular/core';
import {ApiClientService, ObjectLoader} from 'app/services';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class DecisionMakerApiService {
  private state;
  private status = new Subject();
  update;

  constructor(private apiClient: ApiClientService ) {
    this.update = this.status.asObservable();
    this.sendStatus(false);
  }

  open() {
    this.sendStatus(true);
  }

  close() {
    this.sendStatus(false);
  }

  private sendStatus(value) {
    if (value !== this.state) {
      this.state = value;
      this.status.next(this.state);
    }
  }

  post(data) {
    return this.apiClient.post('/decision_makers', JSON.stringify(ObjectLoader.toSnakeCase(data)));
  }
}
