<template>
  <div id="app" class="has-background-light">
    <nav id="nav" class="navbar has-background-white box" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <div class="navbar-item">
          <img src="@/assets/logo.png">
          <h1 class="is-size-4 has-text-weight-bold is-primary has-text-primary">STOMP ROCKET <span
              class=" has-text-weight-light has-text-black">STATUS</span></h1>
          <p> v{{version}}</p>

        </div>


        <a role="button" class="navbar-burger burger" aria-label="menu" aria-expanded="false"
           data-target="navbarBasicExample">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navbarBasicExample" class="navbar-menu">

        <div class="navbar-end">
          <p v-if="admin" class="has-text-info navbar-item">Admin User</p>
          <div class="navbar-item">
            <div class="buttons">

              <button @click="logOut" v-if="user" class="button is-primary">
                LOG OUT
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
    <router-view/>
    <p class="has-background-light has-text-centered">Stomp Rocket Status is an open source project created by <a
        href="https://ronanfuruta.com" target="_blank">Ronan Furuta</a></p>
    <br>
  </div>
</template>
<script>
  export default {
    name: 'app',
    data() {
      return {
        user: false,
       // apiURL: 'http://localhost:3001',
        apiURL: 'https://api.status.ronanfuruta.com',
        version: require('../package').version,
        admin: false
      }
    },
    methods: {
      logOut() {
        this.user = false
        this.admin = false
        this.$firebase.auth().signOut().then(i => {
          this.$router.push('/login')
        })
      }
    },
    mounted() {

      this.$firebase.auth().onAuthStateChanged(user => {
        console.log('auth state changed')
        if (user) {
          console.log('loggedin')

          this.user = {
            name: user.displayName,
            email: user.email,
            uid: user.uid,
          }
          this.$firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then((idToken) => {
            // Send token to your backend via HTTPS
            fetch(this.apiURL + '/user', {
              method: 'POST',
              headers: {
                'content-type': 'application/json',
                user: idToken
              },
              body: JSON.stringify({
                name: user.displayName,
                email: user.email,
                lastLoggedIn: Date.now()
              })
            }).then(res => res.json()).then(res => {
              console.log(res, 'result from admin check')
              this.admin = res.admin;
            })
            // ...
          })

        } else {
          console.log('no user')

          this.$router.push('/login')


        }
      })
    }
  }
</script>