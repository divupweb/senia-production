import {Component, OnInit} from '@angular/core';
import { SuspendsDataService } from '../services';

@Component({
  selector: 'events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {

  public events: any[] = [];

  constructor(private data: SuspendsDataService) { }

  public ngOnInit(): void {
    this.loadEvents();
  }

  public loadEvents(): void {
    this.data.getPendingEvents().subscribe((events: any[]) => {
      this.groupEvents(events);
    });
  }

  protected groupEvents(events: any): any {
    this.events = [];
    const groupedEvents = _.groupBy(events, (e) => {
      if (_.size(e.name) > 0) {
        return e.name;
      }
      return e.id;
    });
    _.each(groupedEvents, (group: any[]) => {
      const groupedEvent = _.first(group);
      this.events.push(_.merge(groupedEvent, { ids: _.map(group, 'id'), dates: _.map(group,'date') }));
    });
    this.events = _.sortBy(this.events, 'date');
  }
}
