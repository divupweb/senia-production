import { AbstractOwner } from "./abstract-owner";
import { Company } from "./company";

export class Employee extends AbstractOwner {
  public company: Company;
  readonly ownerType: string = 'User';

  public constructor(attributes: any, company: Company) {
    super(attributes);
    this.company = company;
  }

  public attributes(): any {
    return _.merge(super.attributes(), {
      company: this.company
    })
  }

}
