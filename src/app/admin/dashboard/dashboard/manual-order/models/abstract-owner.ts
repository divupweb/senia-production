

export class AbstractOwner {

  public ownerType: string;
  public ownerId: string;
  public email: string;
  public name: string;

  protected properties = _.keys(this.attributes());

  public constructor(attributes: any) {
    _.merge(this, _.pick(attributes, this.properties));
    this.ownerId = _.get(attributes, 'id');
  }

  public attributes(): any {
    return {
      ownerType: this.ownerType,
      ownerId: this.ownerId,
      email: this.email,
      name: this.name
    };
  }
}
