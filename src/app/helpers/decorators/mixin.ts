export function Mixin(baseCtors: any[]) {
  return (derivedCtor: any) => {
    baseCtors.forEach((baseCtor) => {
      Object.getOwnPropertyNames(baseCtor.prototype).forEach((name: string) => {
        // allow override mixin's methods
        if (_.isUndefined(derivedCtor.prototype[name])) {
          derivedCtor.prototype[name] = baseCtor.prototype[name];
        }
      });
    });
  };
}
