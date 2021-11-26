importScripts('https://www.gstatic.com/firebasejs/9.1.3/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging-compat.js');

// firebase.initializeApp({
//   apiKey: 'AIzaSyBYX9m-Cu_S79oqd1DyuUoO2MljOBKkgvM',
//   authDomain: 'notication-tmdt.firebaseapp.com',
//   projectId: 'notication-tmdt',
//   storageBucket: 'notication-tmdt.appspot.com',
//   messagingSenderId: '398924202747',
//   appId: '1:398924202747:web:6eee93da3e0e7687e4265e',
//   measurementId: 'G-PVPDLZTXRM'
// });

// daotq
firebase.initializeApp({
  apiKey: 'AIzaSyBcmGUBIzEdvuVA1v4D06F4u7-GrRMMP9Y',
  authDomain: 'helios-180d5.firebaseapp.com',
  projectId: 'helios-180d5',
  storageBucket: 'helios-180d5.appspot.com',
  messagingSenderId: '494985658735',
  appId: '1:494985658735:web:58f462008b964c3eb6289a',
  measurementId: 'G-ZPP9CQSJ58'
});


const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
