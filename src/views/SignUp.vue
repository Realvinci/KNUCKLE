<template>
  <div class="signup">
       <form @submit.prevent="signUp">
        <label for="email">Email:</label>
        <input type="email" placeholder="Enter password" v-model="email">
        <label for="password">Password:</label>
        <input type="password" v-model="password">
          <button @click="signUp" type="submit">Submit</button>
       </form>
  </div>
</template>

<script>
import {app as app} from '../../firebase'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore,collection, addDoc  } from "firebase/firestore";
import { mapActions } from 'vuex';
const auth = getAuth(app);
const db = getFirestore(app);
export default {
  data(){
    return{
        
          email:'',
          password:'',
          Admin:false,
          cart:[]
      
    }
  },
  methods:{
    signUp(){
      createUserWithEmailAndPassword(auth, this.email,this.password)
  .then((userCredential) => {
    
    const user = userCredential.user;
    console.log(user);
     this.AddUser();
    this.goHome();
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });
    },
    goHome(){
        this.$router.push('/')
    },
    async AddUser(){
      try {
        const docRef = await addDoc(collection(db,"users"),{name:this.email,Admin:this.Admin,cart:this.cart});
        console.log("Document written with ID: ",docRef.id);
        let docId = docRef.id
        localStorage.setItem('docId',docId)
        console.log('this is the state own',this.$store.state.userref)
      } catch (error) {
        console.log("Error adding document: ",error);
      }
    },
    //...mapActions(['AddUser'])
  }
}
</script>

<style>

</style>


// await addDoc(collection(db, "products"), {
//   name: this.product.name,
//   price: this.product.price,
//   image:this.imageurl,
//   vendor:this.product.vendor,
//   description:this.product.description,
//   id:uuidv4()
// }