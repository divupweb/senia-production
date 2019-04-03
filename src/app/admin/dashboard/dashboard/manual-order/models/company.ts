import {AbstractOwner} from "./abstract-owner";
import {Employee} from "./employee";

export class Company extends AbstractOwner {

  public displayUrl: string;
  public employees: Employee[] = [];
  readonly ownerType: string = 'Company';

  public constructor(attributes: any) {
    super(attributes);
    this.initEmployees(attributes['employees']);
  }

  public attributes(): any {
    return _.merge(super.attributes(), {
      displayUrl: this.displayUrl
    })
  }

  protected initEmployees(employees: any[]): void {
    this.employees = _.map(employees, (e) => new Employee(e, this));
  }

}
