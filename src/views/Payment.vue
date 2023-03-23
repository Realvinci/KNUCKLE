<template>
  <div class="payment">
      <!-- <h4>Payment Method</h4>
      <div class="form-check form-check-inline">
        <input class="form-check-input" type="radio" name="card" id="" value="master">
        <label class="form-check-label" for="">Master Card</label>
      </div>
        <div class="form-check form-check-inline">
        <input class="form-check-input" type="radio" name="card" id="" value="verve">
        <label class="form-check-label" for="">Verve Card</label>
       </div>
       <div class="price">
        <h2 style="margin-right:100px;">Total:</h2>
          <h2>N{{ GetTotal }}</h2>
       </div>
       <div class="card-details">
        <div class="form-row">
        <div class="form-group col-md-8">
            <input type="number" class="form-control" placeholder="Card Number:">
        </div>   
       </div>
       <div class="form-row">
          <div class="form-group col-md-3">
           <input type="text" class="form-control" placeholder="Expiry:">
         </div>
    <div class="form-group col-md-3">
      <input type="number" class="form-control" placeholder="CVV:">
    </div>
  </div>
       </div>
    <button>Submit</button> -->
    <form @submit.prevent="getpaymentinfo">
      <div class="form-group">
    <!-- <label for="email">Email Address</label>
    <input type="email" id="email-address"  v-model="email" />
  </div>
  <div class="form-group">
    <label for="amount">Amount</label>
    <input type="tel" id="amount" v-model="amount"/> -->
  </div>
  
  <div class="form-submit">
    <button @click="getpaymentinfo"> Pay </button>
  </div>
    </form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import jwt_decode from 'jwt-decode';
import {app as app} from '../../firebase'
import { collection, getDocs,getFirestore,query,where,updateDoc,doc } from "firebase/firestore"; 
const db = getFirestore(app);
export default {
  data(){
    return{
      email:'',
      amount:'',
      firstname:'',
      lastname:'',
      databasemail:'',
      docid:'',
      shippingdetail:[],
      total:'',
      paymentData:{
        total:'',
        email:'',
        address:'',
        mobile:'',
        cart:[]
      }
    }
  },
   methods:{
    ...mapActions(['getPrice','ProcessPayment']),
    //getTotal
    //getshipping detail and push here into the payload cause you will push the payload things in the backend
     mail(){
      let signinToken = localStorage.getItem('signinToken')
      let DecryptedToken = jwt_decode(signinToken)
       this.databasemail = DecryptedToken.email
     },
    
      async docRef(){
       try {
         const query = await getDocs(collection(db,"users"))
         query.forEach((doc)=>{
           if(doc.data().email == this.databasemail){
              this.docid = doc.id
              console.log(this.docid)
           }
         })
       } catch (error) {
        console.log(error)
       }
     
     },
  
     async getpaymentinfo(){
      const usersRef = collection(db,"users")
     // const usercartref = doc(db,"users",this.docid)
     const q = query(usersRef,where("email",'==',this.databasemail))  
     const querySnapshot = await getDocs(q);
     querySnapshot.forEach((doc)=>{
         if(doc.data().email == this.databasemail){
          for(let item of doc.data().cart){
             this.paymentData.cart.push(item)
          }
          this.paymentData.total = Number(doc.data().TotalPrice)
           this.paymentData.email =doc.data().shippingDetails.shippingEmail
           this.paymentData.address = doc.data().shippingDetails.shippingAddress
           this.paymentData.mobile = doc.data().shippingDetails.shippingmobile
         }
     })
     //console.log(this.paymentData)
     
      let paymentinfo = {
      
         email:this.paymentData.email,
         amount:this.paymentData.total,
         address:this.paymentData.address,
         mobile:this.paymentData.mobile,
         cart:this.paymentData.cart
      }
      console.log('this are the items of payment object',paymentinfo)
      this.ProcessPayment(paymentinfo)
     },

     },
   computed:{
     ...mapGetters(['GetTotal'])
   },
   created(){
    //this.getPrice()
     this.mail()
    this.docRef()
    this.getOrders()
   // this.getpaymentinfo()
   }
}
</script>

<style>
.payment{
    margin-top: 10px;
}
.card{
    display: flex;
    align-items: center;
}
.price{
    display: flex;
    margin: 0 auto;
    justify-content: center;
    align-items: center;
}
.card-details{
 
   align-items: center;
   justify-content: center;
}
</style>


basically make payload


//get shipping address from the shipping view and get show here together with the price and add to the final price and as to proceed to pay