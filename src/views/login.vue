<template>
  <div class="home  section hero is-fullheight has-background-light">
    <div class="hero-body container">
      <div id="loginCard" class="card">
        <div class="card-content">
          <h1 class="title">Login</h1>
          <form @submit.prevent="loginWithEmail">
            <div class="field">
              <label class="label">Email</label>
              <div class="control">
                <input :class="{'is-danger': emailError}" v-model="email" required class="input" type="email" placeholder="Email">
              </div>
              <p v-if="emailError" class="help is-danger">{{emailError}}</p>
            </div>
            <div class="field">
              <label class="label">Password</label>
              <div class="control">
                <input :class="{'is-danger': passwordError}" v-model="password" required class="input" type="password" placeholder="Password">
                <p v-if="passwordError" class="help is-danger">{{passwordError}}</p>
              </div>
            </div>

            <br>

            <div class="field is-grouped">
              <div class="control">
                <button type="submit" class="button is-link">Login</button>
              </div>

            </div>

          </form>
        </div>

      </div>

    </div>

  </div>
</template>

<script>
  // @ is an alias to /src

  export default {
    name: 'home',
    data() {
      return {
        emailError: false,
        email: '',
        password: '',
        passwordError: false
      }
    },
    methods: {
      loginWithEmail() {
        if (this.email && this.password) {
          this.$firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(user => {
            if (user) {
              this.$router.push('/')
            }
          }).catch((error) => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorCode, errorMessage)
            this.emailError = false
            this.passwordError = false
            if (errorCode === 'auth/user-not-found') {
              this.emailError = 'An account does not exist with this email'
            } else if (errorCode === 'auth/wrong-password') {
              this.passwordError = 'Password incorrect'
            }
            // ...
          });
        } else {

        }


      },
      loginWithGoogle() {
        const provider = new this.$firebase.auth.GoogleAuthProvider();
        this.$firebase.auth().signInWithRedirect(provider);

      }
    }

  }
</script>
