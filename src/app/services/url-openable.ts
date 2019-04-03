import { WindowRef } from "./window-ref";
export abstract class UrlOpenable {
  public tab;

  public openUrl(url: string, focus: boolean = false, tab = null) {
    let workTab;
    if (tab) {
      workTab = tab;
    } else if (this.tab) {
      workTab = this.tab;
    } else {
      workTab = this.getTab();
    }
    workTab.location.replace(url);
    if (focus) workTab.focus();
  }

  public openTab() {
    this.tab = this.getTab();
  }

  public getTab() {
    return WindowRef.nativeWindow.open('', '_blank');
  }

  public closeTabs(tabs = [this.tab]) {
    tabs.forEach((t: any) => { t.close() })
  }
}
