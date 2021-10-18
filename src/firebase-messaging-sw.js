importScripts('https://www.gstatic.com/firebasejs/9.1.3/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.1.3/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyBYX9m-Cu_S79oqd1DyuUoO2MljOBKkgvM',
  authDomain: 'notication-tmdt.firebaseapp.com',
  projectId: 'notication-tmdt',
  storageBucket: 'notication-tmdt.appspot.com',
  messagingSenderId: '398924202747',
  appId: '1:398924202747:web:6eee93da3e0e7687e4265e',
  measurementId: 'G-PVPDLZTXRM'
});

const messaging = firebase.messaging();

console.log('ok');

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.'
  };

  self.registration.showNotification(notificationTitle,
    notificationOptions);
});
