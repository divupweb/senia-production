import { Component, Input, Output, EventEmitter, ViewEncapsulation} from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { Mixin } from "../../../helpers/decorators/";
import { Uploadable } from "../../../services/uploadable";

@Component({
  selector: 'image-upload',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [ 'image-upload.scss' ],
  template: require('./image-upload.html'),
})

@Mixin([Uploadable])
export class ImageUploadComponent implements Uploadable {
  public initUploader: (uploader: string, url: string, onResponse: Function) => void;

  @Input('upload-url')
  public uploadUrl: string;

  @Output()
  public onResponse: EventEmitter<any> = new EventEmitter();

  public uploader: FileUploader;
  public uploaderProgress: number = 0;
  public uploaderFile: boolean = false;

  ngOnInit() {
    this.initUploader('uploader', this.uploadUrl, response => {
      this.onResponse.next(response);
    });
  }
}
