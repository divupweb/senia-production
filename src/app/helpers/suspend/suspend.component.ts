import {Component, EventEmitter, Input, Output} from '@angular/core';
import { ToastService } from "app/services";
import { SuspendApiService } from "./suspend-api.service"
import { SuspendImagesApiService } from "./suspend-images-api.service"

@Component({
  selector: 'suspend',
  providers: [ SuspendApiService, SuspendImagesApiService ],
  styleUrls: ['suspend.scss'],
  templateUrl: './suspend.html'
})

export class SuspendComponent {
  typeValue;
  @Input()
  get type() {
    return this.typeValue;
  }
  set type(val) {
    this.typeValue = val || 'company';
  }
  @Input() item;

  @Output()
  public onSuccess: EventEmitter<any> = new EventEmitter();
  days = [];
  public events: any[];
  suspendDates = [];
  updateDates = [];
  format = "DD-MM-YYYY";
  initialMonth: any  = moment().startOf('month');
  currentMonth: any;
  monthTitle: string;
  selectedStart;
  selectedEnd;
  range;
  weekDays;

  name;
  description;
  initUploader;
  imageId;
  imageDisplayUrl;
  imageUploadUrl;
  private fullForm = false;
  private loaded = false;

  constructor(
    public toastService: ToastService,
    public service: SuspendApiService,
    private imagesApi: SuspendImagesApiService) {
    this.initWeekDays();
  }

  ngOnInit() {
    if (!this.loaded) {
      this.currentMonth = _.cloneDeep(this.initialMonth);
      this.calculateMonth();
    }
    if (this.type == 'general') {
      this.fullForm = true;
      this.imageUploadUrl = this.imagesApi.imageUrl();
    }
  }

  ngOnChanges(changes) {
    if (changes['item']) this.loadItem();
  }

  private initWeekDays() {
    let days = moment.weekdaysMin();
    days.push(days.shift());
    this.weekDays = days;
  }

  clickDay(day) {
    let selected = moment(day.date, this.format);
    if (selected.isAfter(moment().toDate())) {
      if (!this.selectedStart && !this.selectedEnd || this.selectedEnd ) {
        this.selectedStart = selected;
        this.selectedEnd = null;
        this.range = null
      } else if (this.selectedStart) {
        if (selected.isBefore(this.selectedStart)) {
          this.selectedEnd = _.clone(this.selectedStart);
          this.selectedStart = selected
        } else {
          this.selectedEnd = selected
        }
      }
      if (this.selectedStart && this.selectedEnd) {
        this.range = [moment(this.selectedStart, this.format), moment(this.selectedEnd, this.format)];
      }
      if (day.events.length > 0) {
        const event = _.first(day.events);
        this.name = event.summary;
      }
      this.calculateDays()
    }
  }

  create() {
    this.doRequest('create')
  }

  delete() {
    this.doRequest('delete')
  }

  calculateMonth(selected = null) {
    this.service.list(this.type, this.currentMonth.format(this.format)).subscribe(
      (response) => {
        let dates = response.dates ? response.dates : response;
        this.suspendDates = dates;
        this.events = response.events || [];
        if (response.updates) this.updateDates = response.updates;
        this.calculateDays();
        this.monthTitle = this.currentMonth.format("MMMM, YYYY");
        if (selected) this.clickDay(selected);
      },
      (error) => this.toastService.error(error)
    )
  }

  isChangeMonth(val) {
    if (!this.initialMonth || !this.currentMonth) return false;
    if (val == 1) return true;
    if (val == -1) {
      return this.initialMonth.format(this.format) != this.currentMonth.format(this.format)
    }
  }

  changeMonth(val) {
    if (val == 1) this.currentMonth.add(1, 'month');
    if (val == -1 && this.initialMonth != this.currentMonth) this.currentMonth.subtract(1, 'month');
    this.calculateMonth()
  }

  private

  doRequest(action) {
    let start = this.selectedStart.format(this.format);
    let end = this.selectedEnd ? this.selectedEnd.format(this.format) : start;
    let request = this.service[action](this.type, start, end, this.params());
    request.subscribe(
      (response) => {
        this.clear();
        this.calculateMonth();
        this.onSuccess.emit();
      },
      (error) => this.toastService.error(error)
    )
  }

  private clear() {
    [
      'selectedStart',
      'selectedEnd',
      'range',
      'name',
      'description',
      'imageId',
      'imageDisplayUrl'
    ].forEach((e) => {
      this[e] = null;
    })
  }

  calculateDays() {
    let firstDay = _.cloneDeep(this.currentMonth).startOf('isoweek');

    let contains = (range, day) => {
      return day.isBetween(range[0], range[1]);
    };

    for(var i = 0; i < 5; i++) {
      this.days[i] = [];

      for(var j = 0; j < 7; j++) {
        this.days[i][j] = {
          number: firstDay.date(),
          date: firstDay.format(this.format),
          events: this.getEvents(firstDay),
          weekday: j,
          weekend: _.includes([5, 6], j),
          another: firstDay.month() != this.currentMonth.month(),
          update: false
        };

        if(_.includes(this.suspendDates, this.days[i][j]['date'])) {
          this.days[i][j]['suspend'] = true
        } else {
          this.days[i][j]['empty'] = true
        }

        if(_.includes(this.updateDates, this.days[i][j]['date'])) {
          this.days[i][j]['update'] = true
        }

        if (moment().isSame(firstDay)) {
          this.days[i][j]['today'] = true
        }

        if ( this.selectedStart && this.selectedStart.isSame(firstDay) || this.selectedEnd && this.selectedEnd.isSame(firstDay)) {
          this.days[i][j]['selected'] = true
        }

        if (this.range && contains(this.range, firstDay)) {
          this.days[i][j]['betweenSelected'] = true
        }
        firstDay.add(1, 'day')
      }
    }
  }

  private params() {
    let data;
    if (this.fullForm) {
      data = {
        name: this.name,
        description: this.description,
        image_id: this.imageId
      }
    }
    return data;
  }

  fileUpload(data) {
    if (data.errors) {
      this.toastService.error(data.errors.file);
    } else {
      this.imageId = data.id;
      this.imageDisplayUrl = data.display_url;
    }
  }

  deleteImage() {
    this.imagesApi.delete(this.imageId).subscribe(
      (response) => { this.imageDisplayUrl = null },
      (error) => this.toastService.error(error)
    )
  }
  protected getEvents(date: any): any[] {
    return _.filter(this.events, (e) => moment(_.get(e, 'start.date')).isSame(date, 'day'));
  }

  private loadItem() {
    if (!this.item) return;
    this.clear();

    let params = {
      name: 'name',
      description: 'description',
      imageId: 'image_id',
      imageDisplayUrl: 'display_url'
    };

    _.each(params, (v, k) => this[k] = this.item[v]);

    let date = moment(this.item.date);
    let day = { date: date.format(this.format) };
    let currentMonth = date.startOf('month');
    if (!currentMonth.isSame(this.initialMonth, 'month')) {
      this.loaded = true;
      this.currentMonth = _.cloneDeep(currentMonth);
      this.calculateMonth(day)
    } else {
      this.clickDay(day);
    }
  }
}
