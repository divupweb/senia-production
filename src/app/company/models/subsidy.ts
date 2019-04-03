import { ObjectLoader } from "app/services";
import { TranslateService } from "@ngx-translate/core";
import { Observable } from "rxjs/Observable";

const subscriptions = ['breakfast', 'lunch', 'dinner'];
const exportedFields = ['type', 'active', 'value', 'id', 'free', 'period', 'valueType', 'subscriptionType'];

const DEFFAULT_MAX_VALUE = 200;

export class Subsidy {
  maxValue = DEFFAULT_MAX_VALUE;

  subscriptionCode = -1;
  subscriptionType;
  active = false;
  free = false;
  type;
  value = 0;
  id;
  valueType;
  period;
  valueTypes = [];
  periods = [];
  subsidyType = -2; // -2 NO, -1 FREE, 0 - amount, 1 - %
  loaded = false;
  userId;


  constructor(json, private t: TranslateService, valueTypes, periods, private state) {
    Object.assign(this, ObjectLoader.toCamelCase(json))
    this.setSubscriptionCode();
    this.loadLists(valueTypes, periods);
    this.maxValue = this.accountMaxValue();
  }

  private accountMaxValue() {
    return _.get(this.state.currentAccount(), 'subsidy_max_value', DEFFAULT_MAX_VALUE);
  }

  private loadLists(valueTypes, periods) {
    Observable.forkJoin([valueTypes, periods]).subscribe(
      (data: any) => {
        this.valueTypes = data[0];
        this.periods = data[1];
        this.setSubsidyType();
        this.loaded = true;
      });
  }

  params() {
    let value = _.pick(this, exportedFields);
    return value;
  }

  setSubscriptionCode() {
    this.subscriptionCode = subscriptions.indexOf(this.subscriptionType);
  }

  setSubsidyType() {
    this.subsidyType = -2;
    if (!this.active) return;
    if (this.free) {
      this.subsidyType = -1;
    } else if (this.value > 0) {
      let index = _.findIndex(this.valueTypes, (e) => e[1] == this.valueType);
      if (-1 < index) this.subsidyType = index;
    }
    if (this.valueType == 'percentage') this.maxValue = 100;
  }

  get representation() {
    if (!this.active) return;

    let value;
    switch (this.subsidyType) {
      case -1:
        value = this.t.instant('SUBSIDIES.FREE');
        break;
      default:
        value = `${this.valueRepresentation()} ${this.periodRepresentation()}`;
    }
    return value;
  }

  private periodRepresentation() {
    if (!this.period) return '';
    let type = this.period.toUpperCase();
    return this.t.instant(`SUBSIDIES.PERIODS.${type}`);
  }

  private valueRepresentation() {
    let value = `${this.value}`;
    _.some(this.valueTypes, (t) => {
      if (t[1] == this.valueType) {
        value += ` ${t[0]}`
        return true;
      }
    });
    return value;
  }

  get enabled() {
    return this.loaded && this.active && (this.free || this.value > 0);
  }

  get showSlider() {
    return this.active && !this.free && this.subsidyType >= 0;
  }

  changeValueType(subsidyType) {
    this.subsidyType = subsidyType;
    this.active = true;
    switch (subsidyType) {
      case -2:
        this.setNo(); break;
      case -1:
        this.setFree(); break;
      case 1:
        this.setPercentage(subsidyType); break;
      default:
        this.setValueType(subsidyType);
    }
  }

  private setNo() {
    this.free = false;
    this.value = 0;
    this.valueType = undefined;
    this.period = undefined;
  }

  private setFree() {
    this.free = true;
    this.value = 0;
    this.valueType = undefined;
    this.period = undefined;
  }

  private setPercentage(subsidyType) {
    this.setValueType(subsidyType);
    this.period = undefined;
    this.maxValue = 100;
  }

  private setValueType(subsidyType) {
    this.free = false;
    let valueType = this.valueTypes[subsidyType][1];
    this.valueType = valueType;
    if (this.value == 0) this.value = 100;
    if (!this.period) this.period = this.periods[0][1];
    this.setMaxValue();
  }

  isEqual(subsidy) {
    if (!subsidy) return false;
    let fields = ['type', 'value', 'free', 'period', 'valueType'];
    let value = fields.every((f) => {
      return this[f] == subsidy[f];
    })

    return value;
  }

  private setMaxValue() {
    let maxValue = this.accountMaxValue();
    switch (this.period) {
      case 'weekly':
        maxValue *= 7;
        break;
      case 'monthly':
        maxValue *= 30
        break;
    }
    this.maxValue = maxValue;
  }


  onPeriodChange() {
    this.setMaxValue();
  }
}
