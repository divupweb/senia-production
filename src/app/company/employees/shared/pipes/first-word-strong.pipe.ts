import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstWordStrong'
})

export class FirstWordStrongPipe implements PipeTransform {
  constructor() {}

  transform(value: any, args: any[]) {
    let poz = value.indexOf(" ");
    let firstWord;
    let lastPart;
    if (poz) {
      firstWord = value.substr(0, poz);
      lastPart = value.substr(poz);
    } else {
      firstWord = value;
      lastPart = '';
    }
    return `<strong style="color:#4a4a4a; display: inline-block;width: 70px">${firstWord}</strong>${lastPart}`
  }
}
