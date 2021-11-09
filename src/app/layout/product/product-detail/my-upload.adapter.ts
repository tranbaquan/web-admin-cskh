import {FileUploadService} from './file-upload.service';
import {environment} from '../../../../environments/environment';

export class MyUploadAdapter {
  loader: any;
  fileUploadService: FileUploadService;

  constructor(loader, fileUploadService: FileUploadService) {
    // The file loader instance to use during the upload.
    this.loader = loader;
    this.fileUploadService = fileUploadService;
  }

  // Starts the upload process.
  upload(): any {
    // Update the loader's progress.
    // server.onUploadProgress(data => {
    //   this.loader.uploadTotal = data.total;
    //   loader.uploaded = data.uploaded;
    // });

    // Return a promise that will be resolved when the file is uploaded.
    return this.loader.file
      .then(file => {
        const formData = new FormData();
        formData.set('', file);
        return new Promise((resolve, reject) => {
          this.fileUploadService.updateImage(formData).subscribe(res => {
            resolve({
              default: environment.storageUrl + res.data.substr(1)
            });
          }, error => {
            reject(error);
          });
        });
      });
  }

  abort(): void {
    // Reject the promise returned from the upload() method.
    // server.abortUpload();
  }
}
