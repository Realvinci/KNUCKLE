<template>
    <div>
      <div>
<table class="table container" style="width:500px; border:1px solid #000; margin-top:10px;">
  <thead>
    <tr>
      <th scope="col">Image</th>
      <th scope="col">Qty</th>
      <th scope="col">Price</th>
    </tr>
  </thead>
  <tbody v-for="product in getCart" :key="product.id">
    <tr>
      <th scope="row">
        <img :src="product.image" class="rounded" style="width:50px;">
      </th>
       
      <button id="decrease" style="margin-top:10px;" @click="decrease(product)">-</button>
      <button id="increase" style="margin-top:10px;"  @click="increase(product)">+</button>
      <td> {{ product.qty }} x {{ product.price }}</td>
      <i @click="removeFromFBCart(product)" class="fa-solid fa-trash"></i>
    </tr>
  </tbody>
</table>

    <h4 class="mr-auto;"></h4>   
      
      </div>
      {{ GetTotal }}
      <router-link to="/shipping">
        <button @click="getUserCart">Shipping</button>
      </router-link>
</div>    
</template>
    
<script>  
import { mapActions,mapGetters } from 'vuex';
import {app as app} from '../../firebase'
import { collection, getDocs,getFirestore,query,where,updateDoc,doc } from "firebase/firestore"; 
import jwt_decode from 'jwt-decode';
const db = getFirestore(app)
export default {
 
   data(){
    return{
      value:'',
      defaultPrice:'',
       qty:'',
       email:'',
       userref:'',
       Cart:[]
    }
   },

   methods:{
     ...mapActions(['getUserCart','removeFromFBCart','getPrice','getInputqty']),
     getInput(product){
      //  let input = document.getElementById("input").value
      //  this.getInputqty(input,product)
       let input = document.getElementById("input").value
       console.log(input)
     },
      mail(){
        let signinToken = localStorage.getItem('signinToken')
        let DecryptedToken = jwt_decode(signinToken)
         this.email = DecryptedToken.email
       },
       async docRef(){ 
        try {
          const query = await getDocs(collection(db,"users"))
          query.forEach((doc)=>{
             if(doc.data().email===this.email){
                this.userref = doc.id
             }
          })
        } catch (error) {
          console.log(error)
        } 
        
      },
     //get firebase qty and make it the qty on this.qty
     async getqty(payload){
       const usersRef = collection(db,"users")
       let productIndex;
       const usercartref = doc(db,"users",this.userref)
       const q = query(usersRef,where("email",'==',this.email))  
       const querySnapshot = await getDocs(q)
       querySnapshot.forEach((doc)=>{
           if(doc.data().email===this.email){
              this.Cart = [...doc.data().cart]
              let product= this.Cart.find(product=>product.id==payload.id)
               productIndex = this.Cart.findIndex(product=>product.id==payload.id)
           }
       })
        this.Cart[productIndex].qty = Number(this.qty)
        console.log(this.Cart)
      },
      async increase(payload){
         const usersRef = collection(db,"users")
         
         const q = query(usersRef,where("email","==",this.email))
         const usercartref = doc(db,"users",this.userref)
         const querySnapshot = await getDocs(q)
         querySnapshot.forEach((doc)=>{
          if(doc.data().email == this.email){
              this.Cart = [...doc.data().cart]
             let product = this.Cart.find(product=>product.id==payload.id)
             if(product){
               product.qty++
               updateDoc(usercartref,{
                cart:this.Cart
              })
              window.location.reload()
             }
          }
         })
         console.log(this.Cart)
      },
      async decrease(payload){
         const usersRef = collection(db,"users")
         
         const q = query(usersRef,where("email","==",this.email))
         const usercartref = doc(db,"users",this.userref)
         const querySnapshot = await getDocs(q)
         querySnapshot.forEach((doc)=>{
          if(doc.data().email == this.email){
              this.Cart = [...doc.data().cart]
             let product = this.Cart.find(product=>product.id==payload.id)
             if(product){
                if(product.qty>1){
                  product.qty--
                }else{
                   product.qty
                }
                
                updateDoc(usercartref,{
                cart:this.Cart
              })
              window.location.reload()
             }
          }
         })
         console.log(this.Cart)
      }
   },

   computed:{
    ...mapGetters(['getCart','GetTotal'])
   },
   created(){
    this.getUserCart()
    this.getPrice()
    this.mail()
    this.docRef()
   },
  
}
</script>

<style>
form {
    width: 300px;
    margin: 0 auto;
    text-align: center;
    padding-top: 50px;
  }
  
  .value-button {
    display: inline-block;
    border: 1px solid #ddd;
    margin: 10px;
    width: 40px;
    height: 20px;
    text-align: center;
    vertical-align: middle;
    padding: 11px 0;
    background: #eee;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  
  .value-button:hover {
    cursor: pointer;
  }
  
  form #decrease {
    margin-right: -4px;
    border-radius: 8px 0 0 8px;
  }
  
  form #increase {
    margin-left: -4px;
    border-radius: 0 8px 8px 0;
  }
  
  form #input-wrap {
    margin: 0px;
    padding: 0px;
  }
  
  input#number {
    text-align: center;
    border: none;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    margin: 0px;
    width: 40px;
    height: 40px;
  }
  
  input[type=number]::-webkit-inner-spin-button,
  input[type=number]::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
  }
</style>



// increaseValue() {
//   var value = parseInt(document.getElementById('number').value, 10);
//   value = isNaN(value) ? 0 : value;
//   value++;
//   document.getElementById('number').value = value;
//   console.log(value)
// },
// decreaseValue() {
// var value = parseInt(document.getElementById('number').value, 10);
// value = isNaN(value) ? 0 : value;
// value < 1 ? value = 1 : '';
// value--;
// document.getElementById('number').value = value;
// console.log(value)
// },