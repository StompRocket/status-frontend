<template>
  <div class="home has-background-light is-fullheight section page">

    <div v-if="this.$parent.user && loaded" id="monitors" class="container">
      <router-link to="/new" v-if="this.$parent.admin" class="newMonitor card monitor has-background-light">


        <p class="has-text-weight-bold has-text-info title is-4">Create New</p>


      </router-link>
      <div :key="monitor.id" v-for="monitor in monitors" class="card monitor has-background-white">
        <div class="card-content">
          <div class="content">
            <p class="title is-4">{{monitor.name}}</p>
            <p class="subtitle is-6 monitorURL">{{monitor.url}}</p>
            <p v-if="monitor.fetched" class="is-6 monitorLastPing">last pinged: {{monitor.lastPingHuman}}</p>
            <p v-if="!monitor.fetched" class="is-6 monitorLastPing">This property has not been fetched yet. Please check again in 5 minutes.</p>

            <div v-if="monitor.fetched" class="level">
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
                <p :class="{'has-text-success': monitor.ok,'has-text-danger': !monitor.ok}"
                   class="has-text-weight-bold is-marginless title is-5">{{monitor.status}}</p>
              </div>
            </div>
            <div v-if="monitor.fetched">
              <chart :property="monitor"></chart>
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
        apiKey: false,
        loaded: false
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

          //  console.log(properties)
          this.$firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then((idToken) => {


            fetch(`${this.$parent.apiURL}/properties`, {
              method: 'GET',
              headers: {
                'user': idToken
              }
            }).then(res => res.json()).then(res => {
              console.log(res)
              this.monitors = res.result.map(i => {
                if (i.fetched) {
                  i.lastPingHuman = this.$moment.unix(i.lastPing).fromNow()
                }

                return i
              })
              this.loaded = true

            })


          })


        }
      })

    },
    methods: {}

  }
</script>
