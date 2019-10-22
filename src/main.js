import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import firebase from 'firebase/app'
import moment from 'moment'
import 'firebase/auth'
import 'firebase/firestore'
import '@/assets/bulma.sass'
import '@/assets/main.scss'

const firebaseConfig = {
  apiKey: "AIzaSyDCeVsbrwga9XDE_Pq3fBbGOSfq8CgI3_Q",
  authDomain: "stomprocket-status.firebaseapp.com",
  databaseURL: "https://stomprocket-status.firebaseio.com",
  projectId: "stomprocket-status",
  storageBucket: "stomprocket-status.appspot.com",
  messagingSenderId: "118762920137",
  appId: "1:118762920137:web:158d1f886396226179d518",
  measurementId: "G-ND8Y087HCR"
};
firebase.initializeApp(firebaseConfig)
Vue.prototype.$firebase = firebase
Vue.prototype.$moment = moment
Vue.config.productionTip = false
let app
firebase.auth().onAuthStateChanged(user => {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
})

