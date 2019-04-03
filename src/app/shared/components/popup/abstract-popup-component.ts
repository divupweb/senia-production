
export abstract class AbstractPopupComponent {

  public state: boolean = false;

  public show(): void {
    this.beforeShow();
    setTimeout(() => {
      this.state = true;
      this.afterShow();
    }, 50);
  }

  public close(event = null): void {
    this.beforeClose();
    this.state = false;
    this.afterClose();
  }

  public toggle(): void {
    this.state ? this.close() : this.show();
  }

  public beforeShow(): void {
    return;
  }

  public afterShow(): void {
    return;
  }

  public beforeClose(): void {
    return;
  }

  public afterClose(): void {
    return;
  }

}
