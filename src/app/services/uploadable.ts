import { FileUploader } from 'ng2-file-upload';

export class Uploadable {


  public initUploader(uploaderName: string, url: string, onResponse: Function): void {
    const uploader = new FileUploader({ url });
    uploader.setOptions({ autoUpload: true });

    uploader.onAfterAddingFile = (fileItem: any) => {
      this[`${uploaderName}File`] = true;
    };

    uploader.onProgressItem = (fileItem: any, progress: any) => {
      this[`${uploaderName}Progress`] = _.parseInt(progress);
    };

    uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      this[`${uploaderName}File`] = false;
      this[`${uploaderName}Progress`] = 0;
      if (response) {
       onResponse(JSON.parse(response));
      }
    };
    this[uploaderName] = uploader;
  }
}
