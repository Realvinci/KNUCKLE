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

 },
 created(){
   this.getProductsfromfirebase()


 },
 computed:{
    ...mapGetters(['getFirestoredata','getCart'])
 }
}
</script>

<style>

</style>



