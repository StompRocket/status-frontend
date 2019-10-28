<template>
  <div class="home has-background-light is-fullheight container page">
    <router-link v-if="!loading" to="/" class="button  ">Back</router-link>
    <br>
    <br>
    <div v-if="form" class="box">
      <h1 class="title">Create a Monitor</h1>
      <form @submit.prevent="createProperty">
        <div class="field">
          <label class="label">Property Name</label>
          <div class="control">
            <input v-model="newProperty.name" required class="input" type="text" placeholder="Name">
          </div>
        </div>
        <div class="field">
          <label class="label">URL to fetch</label>
          <div class="control">
            <input v-model="newProperty.url" required class="input" type="text" placeholder="URL to fetch">
          </div>
        </div>
        <div class="field">
          <label class="label">Users to add</label>
          <div class="control">
            <input v-model="newProperty.users" required class="input" type="text" placeholder="Users to add">
          </div>
          <p class="help">Input emails of users separated by commas. If a user doesn't have an account an account will
            be created for them</p>
        </div>

        <div class="field is-grouped">
          <div class="control">
            <button type="submit" class="button is-link">Create</button>
          </div>
          <div class="control">
            <router-link to="/" class="button is-link is-light">Cancel</router-link>
          </div>
        </div>
      </form>
    </div>
    <div class="section" v-if="loading">
      <progress class="progress is-small is-primary" max="100">15%</progress>
      <p class="has-text-centered">Creating property and provisioning resources</p>
    </div>
    <div v-if="success" class="box">
      <h1 class="title has-text-success">Success!</h1>
      <h2 class="subtitle">Your property has been created</h2>
      <p v-if="res.newAccounts.length > 0">New Accounts Created:</p>
      <ul>
        <li v-for="user in res.newAccounts">{{user}}</li>
      </ul>
      <p v-if="res.newAccounts.length > 0">new account password: {{res.newAccountPassword}}</p>
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
        newProperty: {
          name: '',
          url: '',
          users: this.$parent.user.email
        },
        apiKey: false,
        loaded: false,
        loading: false,
        form: true,
        success: false,
        res: false
      }
    },
    mounted() {

      this.$firebase.auth().onAuthStateChanged(user => {
        if (user) {
          if (!this.$parent.admin) {
            this.$router.push('/')
          }
          //console.log('fetching')

        }
      })

    },
    methods: {
      createProperty() {
        if (this.newProperty.name && this.newProperty.url && this.newProperty.users) {
          this.form = false
          this.loading = true
          this.$firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then((idToken) => {
            console.log(JSON.stringify(this.newProperty))
            fetch(this.$parent.apiURL + '/property', {
              method: 'POST',
              headers: {
                'content-type': 'application/json',
                authorization: this.apiKey,
                user: idToken
              },
              body: JSON.stringify(this.newProperty)
            }).then(res => res.json()).then(res => {
              console.log(res)
              if (res.error) {
                console.log(res.error)
              } else {
                this.loading = false
                this.success = true
                this.res = res
              }
            })
          })

        }
      }

    }

  }
</script>
