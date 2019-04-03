import { Subject } from 'rxjs/Subject';

const SOON_TIME = 60;


export class Deadline {
  private dueTimeValue;
  private timer;
  private source;
  passed = true;
  dueTime;
  timeLeft;
  soon = false;
  progress = 100;
  updates;
  empty = true;

  constructor(private timeStr, public progressBar = null) {
    this.source = new Subject();
    this.updates = this.source.asObservable();
    this.read()
  }

  private read() {
    if (!this.timeStr) return;
    this.empty = false;
    this.dueTimeValue = moment(this.timeStr, moment.ISO_8601);
    this.humanizeDueTime();
    this.updateStatus();
  }

  private checkPassed() {
    this.passed = this.dueTimeValue.isBefore();
    this.source.next(this.passed);
    if (this.passed) this.source.complete();
  }

  private checkSoon() {
    this.soon = false;

    if (this.passed) return;

    const soonTime = moment().add(SOON_TIME, 'minutes');
    this.soon = this.dueTimeValue.isBefore(soonTime)
  }

  private humanizeDueTime() {
    this.dueTime = this.deadlineFormatted()
  }

  private deadlineFormatted() {
    let format = "HH:mm";
    if (!this.dueTimeValue.isSame(moment(), 'day')) {
      format = "L HH:mm";
    }

    return this.dueTimeValue.format(format);
  }

  private updateMessage(duration) {
    this.timeLeft = duration;
  }

  private updateProgress(duration) {
    const left = duration.as('minutes');
    this.progress = Math.round((SOON_TIME - left) / SOON_TIME * 100);
  }

  private updateProgressBar() {
    if (this.progressBar) this.progressBar.animate();
  }

  private updateStatus() {
    this.checkPassed();
    this.checkSoon();
    if (this.passed) {
      if (this.timer) this.stop();
      return;
    }

    const duration = moment.duration(this.dueTimeValue.diff());
    this.updateProgress(duration);
    this.updateMessage(duration);
  }

  start() {
    if (this.passed) return;
    const updateTime = () => {
      this.updateStatus();
    };
    this.updateProgressBar();
    this.timer = setInterval(updateTime, 15000);
  }

  stop() {
    clearInterval(this.timer);
  }
}
