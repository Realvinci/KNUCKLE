<template>
<div>
    <i class="fa-solid fa-user my-2" data-toggle="modal" data-target="#staticBackdrop"></i>
<!-- Modal -->
<div class="modal fade" id="staticBackdrop" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="staticBackdropLabel">Login</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <label for="email">Email</label>
        <input type="email" placeholder="Enter your email" v-model="email">
       <br>
        <label for="password">Password</label>
        <input type="password" placeholder="Enter your password" v-model="password">
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="login">Login</button>
        <router-link to="/signup">
            <button type="button" class="btn btn-primary" data-dismiss="modal">Signup</button>
        </router-link>
      </div>
    </div>
  </div>
</div>
</div>
</template>

<script>
import {app as app} from '../../firebase'
 import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
 const auth = getAuth(app);
export default {
  name:'login',
  data(){
    return{
     email:'',
     password:'',
     loginToken:''
    }
  },
  methods:{
   login(){
    signInWithEmailAndPassword(auth, this.email, this.password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    console.log(user.accessToken);
    this.loginToken = user.accessToken
    this.SaveToken();
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });
   },
   SaveToken(){
     const parsed = JSON.stringify(this.loginToken);
     localStorage.setItem('signinToken',parsed);
   }
  }

}
</script>

<style>

</style>