<template>
  <div class="container">
    <div class="row row-4">
    <div class="card col-sm mx-1" v-for="product in getFirestoredata.slice(1,4)" :key="product.id">
        <router-link :to="`/description/${product.id}`">
            <img class="img-fluid" style="width:200px;" :src="product.image" alt="">
        </router-link>
        <div class="card-body">
           <h5 class="card-title">{{ product.name }}</h5>
           <button class="btn btn-danger" @click="addToFirestore(product)"><i class="fa-solid fa-cart-shopping"></i></button>
           <span class="lead">N{{ product.price }}</span>
        </div>
    </div>
    </div>
    {{ email }}
    {{ getCart }}
  </div>
</template>

<script>
//import { collection, getFirestore,query,where ,getDocs} from '@firebase/firestore';
import { collection, getDocs,getFirestore,query,where,updateDoc,doc} from "firebase/firestore"; 
import { mapActions, mapGetters } from 'vuex';
import {app as app} from '../../firebase'
import jwt_decode from 'jwt-decode'
const db = getFirestore(app)
let Authenticated = false
export default {
 name:'Trending',
 data(){
    return{
       email:'',
       userRefid:'',
    }
 },
 methods:{
    ...mapActions(['getProductsfromfirebase','checklogin','checkEmail','getEmail','getDocid','AddToCart','addToFirestore','getUserCart']),
 login(){
  let signinToken = localStorage.getItem('signinToken')
   if(signinToken){
      
       return true
   }else{
     return false
   }
 },


//    async  addTofirestore(payload){
//   //check for logged in
//   let email;
//   let userid;
//   let cart = [];
//   let signed = this.login()
//   if(signed){
//      //get the email
//      let signinToken = localStorage.getItem('signinToken')
//      let DecryptedToken = jwt_decode(signinToken)
//      email = DecryptedToken.email
//      //search the user get the userid and retrieve the cart and privaleges
//      if(email){
//         const usersRef = collection(db,"users")
//         const q = query(usersRef,where("email",'==',email))  
//         const querySnapshot = await getDocs(q);
//         querySnapshot.forEach((doc)=>{
//             if(doc.data().email==email){
               
//                 //function to return docid
//                 const usercartref = doc(db,"users",this.userRefid)
//                 console.log(doc.data().cart)
//                 cart = [...doc.data().cart]
//                 console.log('this is the cart properties=>',cart)
//                 for(let item of cart){
//                    if(item.id!=payload.id){
//                        cart.push(payload)
                      
//                        updateDoc(usercartref,{
//                         cart:cart
//                        }) 
//                    }else{
//                      alert('Item exists')
//                    }
//                 }
//                 console.log('This is the cart state after adding the product=>',cart)
//             }
//         })
//       //   const usercartref = doc(db,"users",userid)
//       //   updateDoc(usercartref,{
//       //     cart:cart.flat(),
//       //   })
//         alert('added to cart')
//      }
//   }else{
//      alert('signin with directing the user to login page')
//   }
// },

 async getUserRef(){
     const usersRef = collection(db,"users")
     const q = query(usersRef,where("email",'==',this.email))
     const querySnapshot = await getDocs(q)
     querySnapshot.forEach((doc)=>{
       if(doc.data().email == this.email){
            this.userRefid = doc.id
            console.log(this.userRefid)
       }
     })
 },
    checkforparticularuser(){
    let token = localStorage.getItem('signinToken')
    token = JSON.stringify(token)
     let DecryptedToken =  jwt_decode(token)
      this.email = DecryptedToken.email
    // return  this.email

 },

 },
 created(){
   this.getProductsfromfirebase()
   this.checkforparticularuser();
   this.getUserCart();
   this.getUserRef();
 },
 computed:{
    ...mapGetters(['getFirestoredata','getCart'])
 }
}
</script>

<style>

</style>



