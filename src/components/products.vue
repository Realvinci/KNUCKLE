<template>
  <div class="row row-cols-4 mx-1">
    <div class="col card" v-for="product in getFirestoredata" :key="product.id">
        <router-link :to="`/description/${product.id}`">
            <img class="img-fluid" :src="product.image" alt="" style="width:200px">
        </router-link>
        <div class="card-body">
           <h5 class="card-title">{{ product.name }}</h5>
           <button @click="addToFirestore(product)" class="btn btn-danger"><i class="fa-solid fa-cart-shopping"></i></button>
           <span class="lead">N{{ product.price }}</span>
        </div>
       
    </div>
   
  </div>
</template>

<script>
//import { getFirestore } from '@firebase/firestore';
import { collection, getDocs,getFirestore,query,where,updateDoc,doc } from "firebase/firestore"; 
import { mapActions,mapGetters } from 'vuex';    
import {app as app} from '../../firebase'
import jwt_decode from 'jwt-decode'
const db = getFirestore(app)
export default {    
   name:'products',
   data(){
    return{
       id:this.$route.params
    }
   },
   methods:{
   ...mapActions(['getProductsfromfirebase','lastAdd','addToFirestore']),
   login(){
  let signinToken = localStorage.getItem('signinToken')
   if(signinToken){
      
       return true
   }else{
     return false
   }
 },

   async  addTofirestore(payload){
  //check for logged in
  let email;
  let userid;
  let cart = [];
  let signed = this.login()
  if(signed){
     //get the email
     let signinToken = localStorage.getItem('signinToken')
     let DecryptedToken = jwt_decode(signinToken)
     email = DecryptedToken.email
     //search the user get the userid and retrieve the cart and privaleges
     if(email){
        const usersRef = collection(db,"users")
        const q = query(usersRef,where("email",'==',email))  
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc)=>{
            if(doc.data().email==email){
                userid = doc.id
                cart.push(doc.data().cart)
                for(let item of doc.data().cart){
                  if(item.id!=payload.id){
                     cart.push(payload)
                  }
                }
            }
        })
        const usercartref = doc(db,"users",userid)
        updateDoc(usercartref,{
          cart:cart.flat(),
        })
     }
  }else{
     alert('signin with directing the user to login page')
  }
  //function check login
}
   },
   created(){
   this.getProductsfromfirebase()
   },
   computed:{
    ...mapGetters(['getFirestoredata'])
   }
}
</script>

