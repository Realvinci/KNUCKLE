<template>
  <div class="signup">
       <!-- <form @submit.prevent="signUp">
        <label for="email">Email:</label>
        <input type="email" placeholder="Enter password" v-model="email">
        <label for="password">Password:</label>
        <input type="password" v-model="password">
        <label for="password">Password:</label>
        <input type="password" v-model="confirm">
          <button @click="signUp" type="submit">Submit</button>
       </form> -->
       <section class="vh-100 gradient-custom">
  <div class="container py-5 h-100">
    <div class="row d-flex justify-content-center align-items-center h-100">
      <div class="col-12 col-md-8 col-lg-6 col-xl-5">
        <div class="card bg-dark text-white" style="border-radius: 1rem;">
          <div class="card-body p-5 text-center">

            <div class="mb-md-5 mt-md-4 pb-5">

              <h2 class="fw-bold mb-2 text-uppercase">SIGN UP</h2>
              <p class="text-white-50 mb-5">Please enter your Email and password!</p>

              <div class="form-outline form-white mb-4">
                <input type="email" id="typeEmailX" class="form-control form-control-lg" v-model="email"/>
                <label class="form-label" for="typeEmailX">Email</label>
              </div>

              <div class="form-outline form-white mb-4">
                <input type="password" id="typePasswordX" class="form-control form-control-lg" v-model="password"/>
                <label class="form-label" for="typePasswordX">Password</label>
              </div>

              <p class="small mb-5 pb-lg-2"><a class="text-white-50" href="#!">Forgot password?</a></p>

              <button class="btn btn-outline-light btn-lg px-5" @click="signUp" type="submit">Sign Up</button>

              <div class="d-flex justify-content-center text-center mt-4 pt-1">
                <a href="#!" class="text-white"><i class="fab fa-facebook-f fa-lg"></i></a>
                <a href="#!" class="text-white"><i class="fab fa-twitter fa-lg mx-4 px-2"></i></a>
                <a href="#!" class="text-white"><i class="fab fa-google fa-lg"></i></a>
              </div>

            </div>

            <div>
              <p class="mb-0">Don't an account? <a href="/login" class="text-white-50 fw-bold">Login</a>
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</section>
  </div>
</template>

<script>
import {app as app} from '../../firebase'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore,collection, addDoc  } from "firebase/firestore";
import {v4 as uuidv4} from 'uuid'
import { mapActions } from 'vuex';
const auth = getAuth(app);
const db = getFirestore(app);
export default {
   data(){
    return{
      email:'',
      password:''
    }
   },
   methods:{
       signUp(){
          if(this.email=='' | this.password == ''){
             alert('fill all inputs')
          }else{
            createUserWithEmailAndPassword(auth,this.email,this.password)
           .then((userCredential)=>{
             const user = userCredential.user
             localStorage.setItem('signinToken',user.accessToken)
             this.addToUsers()
             this.goHome()
           })
          }
          
       },
      goHome(){
           this.$router.push('/')
      },
      async addToUsers(){
        const userRef = doc(db,"users","8Y7gcp9uwA2LXMsiuLPY");
     await updateDoc(userRef,{
      Users:arrayUnion({ id:uuidv4(),email:this.email})
     })
      }
   }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=PT+Sans');

body{
  background: #fff;
  font-family: 'PT Sans', sans-serif;
}
h2{
  padding-top: 1.5rem;
}
a{
  color: #333;
}
a:hover{
  color: #da5767;
  text-decoration: none;
}
.card{
  border: 0.40rem solid #f8f9fa;
  top: 10%;
}
.form-control{
  background-color: #f8f9fa;
  padding: 20px;
  padding: 25px 15px;
  margin-bottom: 1.3rem;
}

.form-control:focus {

    color: #000000;
    background-color: #ffffff;
    border: 3px solid #da5767;
    outline: 0;
    box-shadow: none;

}

.btn{
  padding: 0.6rem 1.2rem;
  background: #da5767;
  border: 2px solid #da5767;
}
.btn-primary:hover {

    
    background-color: #df8c96;
    border-color: #df8c96;
  transition: .3s;

}
</style>


// await addDoc(collection(db, "products"), {
//   name: this.product.name,
//   price: this.product.price,
//   image:this.imageurl,
//   vendor:this.product.vendor,
//   description:this.product.description,
//   id:uuidv4()
// }