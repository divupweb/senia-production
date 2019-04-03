import {Component, EventEmitter, Input, Output} from "@angular/core";
import {AbstractOwner, Company} from "../models";
import {SlideInOut} from "app/shared/animations";

@Component({
  animations: [SlideInOut.animation],
  selector: 'owners-group',
  templateUrl: 'owners-group.html',
  styleUrls: ['owners-group.scss']
})
export class OwnersGroupComponent {

  @Input()
  public company: Company;

  @Input()
  public employeeFilter: string = '';

  @Output()
  public onSelect: EventEmitter<AbstractOwner> = new EventEmitter();

  public collapsed: boolean = true;

  public toggle(): void {
    this.collapsed = !this.collapsed;
  }

  public hasEmployees(): boolean {
    return this.company.employees.length > 0;
  }

  public select(item: AbstractOwner): void {
    this.onSelect.emit(item);
  }

}
