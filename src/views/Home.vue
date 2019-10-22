<template>
  <div class="home has-background-light is-fullheight section page">

    <div id="monitors" class="container">
      <div :key="monitor.id" v-for="monitor in monitors" class="card monitor">
        <div class="card-content">
          <div class="content">
            <p class="title is-4">{{monitor.name}}</p>
            <p class="subtitle is-6 monitorURL">{{monitor.url}}</p>
            <p class="is-6 monitorLastPing">last pinged: {{monitor.lastPingHuman}}</p>

            <div class="level">
              <div>
                <p class="is-marginless ">Uptime</p>
                <p class="has-text-weight-bold is-marginless title is-5">{{monitor.upTime}}%</p>
              </div>
              <div>
                <p class="is-marginless ">Avg Response Time</p>
                <p class="has-text-weight-bold is-marginless title is-5">{{monitor.averageResponseTime}}ms</p>
              </div>
              <div>
                <p class="is-marginless ">status</p>
                <p :class="{'has-text-success': monitor.ok,'has-text-danger': !monitor.ok}" class="has-text-weight-bold is-marginless title is-5">{{monitor.status}}</p>
              </div>
            </div>
            <div>
              <chart :property="monitor" ></chart>
            </div>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>

<script>
  // @ is an alias to /src

  import chart from '@/components/chart.vue'
  export default {
    name: 'home',
    components: {chart},
    data() {
      return {
        monitors: [],
        apiKey: false
      }
    },
    mounted() {
      this.$firebase.auth().onAuthStateChanged(user => {
        if (user) {
          //console.log('fetching')
          this.$firebase.firestore().collection('secrets').doc('apiKey').onSnapshot(snap => {
            this.apiKey = snap.data().key
           // console.log('api key updated', this.apiKey)
          })
          this.$firebase.firestore().collection('users').doc(user.uid).get().then(snap => {
            const properties = snap.data().properties
          //  console.log(properties)
            this.$firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then((idToken) => {

              properties.forEach(i => {
                fetch(`${this.$parent.apiURL}/property/${i}`, {
                  method: 'GET',
                  headers: {
                    'authorization': this.apiKey,
                    'user': idToken
                  }
                }).then(res => res.json()).then(res => {
                //  console.log(res)
                  res.id = i
                  res.lastPingHuman = this.$moment.unix(res.lastPing).fromNow()
                  this.monitors.push(res)
                })

              })
            })

          })
        }
      })

    },
    methods: {}

  }
</script>
