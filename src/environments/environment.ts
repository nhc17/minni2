// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyBuMuz4R9R3xls1rUSUJVOmHLBqfQCMmrE",
    authDomain: "mini-bbb5b.firebaseapp.com",
    databaseURL: "https://mini-bbb5b.firebaseio.com",
    projectId: "mini-bbb5b",
    storageBucket: "mini-bbb5b.appspot.com",
    messagingSenderId: "297530830478"
  },
   api_url: 'http://localhost:3000',
  image_url: 'http://localhost:3000/images/'
}; 

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
