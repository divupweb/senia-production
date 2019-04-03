const isFile = (obj) => obj instanceof File;
export class ObjectLoader {
  // toCamelCase
  static toCamelCase(object) {
    return ObjectLoader.convert(object, _.camelCase);
  }
  // to_snake_case
  static toSnakeCase(object) {
    return ObjectLoader.convert(object, _.snakeCase);
  }

  static convert(object, fn) {
    let convert = (source) => {
      let newObj;
      if (_.isObject(source) && !isFile(source)) {
        if (_.isArray(source)) {
          newObj = source.map((e) => convert(e))
        } else {
          newObj = {};
          _.keys(source).forEach((key) => {
            let newKey = _.startsWith(key, '_') ? key : fn(key);
            newObj[newKey] = convert(source[key]);
          });
        }
      } else {
        newObj = source;
      }

      return newObj;
    };

    return convert(object);
  }

  static toFormData(object: any): FormData {
    const appendRecursive = (formData: FormData, key: string, value: any, parentKey: string | null = null) => {
      let k = parentKey ? `${parentKey}[${key}]` : key;
      if (_.isObject(value) && !isFile(value)) {
        _.each(value, (vv, kk) => {
          let kkNew = _.isInteger(kk) ? '' : kk;
          return appendRecursive(formData, kkNew, vv, k);
        })
      } else {
        formData.append(k, value);
      }
    };
    const formData = new FormData();
    _.each(object, (v, k) => appendRecursive(formData, k, v));

    return formData;
  }

  static json(object) {
    return ObjectLoader.toCamelCase(object.json());
  }
}
