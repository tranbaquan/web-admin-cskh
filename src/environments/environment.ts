// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiBaseUrl: 'https://apiadminmotolok.way.vn',
  storageUrl: 'https://attachmentmotolok.way.vn',
  // apiBaseUrl: 'http://apicskh.heliostech.vn',
  // storageUrl: 'http://attachment.heliostech.vn',
  // test
  // vapidKey : 'BPYPqxNbCmR_NNt0jxvZskuvUUpkt5OMPP0qYWQvSged5KvOeOyjyx9HkgSGcX9ndUyjOM9FbmXwuktsiQmjWhc',
  // release
  vapidKey : 'BK1azpVainwoEhIv7PzVlAK-hNXhYM_LxTKDica9tJdpO2xhSKuDBJIhycS3IxBijeSgfl__5-OESY3uQ7SQAPY',
  firebaseConfig: {
    apiKey: 'AIzaSyBYX9m-Cu_S79oqd1DyuUoO2MljOBKkgvM',
    authDomain: 'notication-tmdt.firebaseapp.com',
    projectId: 'notication-tmdt',
    storageBucket: 'notication-tmdt.appspot.com',
    messagingSenderId: '398924202747',
    appId: '1:398924202747:web:6eee93da3e0e7687e4265e',
    measurementId: 'G-PVPDLZTXRM'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
