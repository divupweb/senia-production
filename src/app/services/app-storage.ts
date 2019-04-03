export class AppStorage {
  private data = {};

  constructor() {}

  static localStorageAvailable() {
    if (!('localStorage' in window)) return false;
    if (typeof localStorage == 'undefined') return false;

    let test = 'test-local-storage';
    try {
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch(e) {
        console.error('Local storage is not defined');
        return false;
    }
  }

  setItem(key, value) {
    return this.data[key] = String(value);
  }

  getItem(key) {
    return this.data.hasOwnProperty(key) ? this.data[key] : null;
  }

  removeItem(key) {
    return delete this.data[key];
  }

  clear() {
    return this.data = {};
  }

  key(index) {
    return Object.keys(this.data)[index];
  }

  length() {
    return Object.keys(this.data);
  }
}
