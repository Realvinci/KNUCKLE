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
   <button @click="ProcessPayment" class="btn btn-primary btn-lg"> Proceed To payment </button> 
  <div class="container">

</div>
  </div>
    </form>
   <button class="a" @click="goHome">Home</button>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { v4 as uuidv4 } from 'uuid';
import jwt_decode from 'jwt-decode';
import {app as app} from '../../firebase'
import { collection, getDocs,getFirestore,query,where,updateDoc,doc,arrayUnion } from "firebase/firestore"; 
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
      Total:0,
      paymentData:{
        total:'',
        email:'',
        address:'',
        mobile:'',
      },
      cart:[],
      waybill:0,
      servicecharge:20,
      transactionRef:''
    }
  },
   methods:{
    ...mapActions(['getPrice','ProcessPayment']),
    //getTotal
    //getshipping detail and push here into the payload cause you will push the payload things in the backend
   
    data(){
      return{
         option:{
          hostname: 'api.paystack.co',
          port: 443,
  path: '/transaction/verify/:reference',
  method: 'GET',
  headers: {
    Authorization:"Bearer sk_test_345ebd19d09ce347f8c7b400e194994a20c7ad23"
  }
         }
      }
    },
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
              //console.log(this.docid)
           }
         })
       } catch (error) {
       // console.log(error)
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
      //console.log('this are the items of payment object',paymentinfo)
      this.ProcessPayment(paymentinfo)
     },
     getDetail(){
        let ShippingDetails = localStorage.getItem('ShippingDetails')
        let Total = localStorage.getItem('Total')
        
        let cart = localStorage.getItem('cart')
    
        cart = JSON.parse(cart)
         this.cart = cart
        
         Total = JSON.parse(Total)

         this.Total = Number(Total)
        
        ShippingDetails = JSON.parse(ShippingDetails)
        //console.log(ShippingDetails.email)
        this.paymentData.email = ShippingDetails.email
        //console.log(ShippingDetails.address)
        this.address = ShippingDetails.address
     },
     async getShippingAddressPrice(){
         const querySnapshot = await getDocs(collection(db,"Address"))
         querySnapshot.forEach((doc)=>{
           //console.log(doc.data().Addresses)
            for(let address of doc.data().Addresses){
                 if(address.Address === this.address){
                   // console.log(address)
                    this.waybill = Number(address.Price)
                    //console.log(this.waybill)
                 }
            }
         })
     },
     ProcessPayment(){
   let handler = PaystackPop.setup({
    key:'pk_test_6fa8a57d2c32f30ce1adb45083ab983aa1330b26',
    email:this.paymentData.email, 
    amount:(this.Total*1)+(this.waybill*1)+(this.servicecharge*1),
    ref:''+Math.floor((Math.random() * 1000000000) + 1),
    
    onClose: function() {
      alert('Transaction was not completed, window closed.');
      this.goHome()
    },
    callback:function(response){
      const res =  fetch(`https://api.paystack.co/transaction/verify/:${response.reference}`,this.option)
      const Data =  res.json(res)
      console.log(Data)
      // // let message ='This is the reference '+ response.reference;
      // // console.log(message)
      // // console.log(response.reference)
      //  let ref = ''+response.reference
      //  this.checksuccess(ref)
      //  //console.log(ref)
      //   //check for success by using reference else push to check
      //   //response.reference
      //  // checksuccess(response.reference)
      //  this.checksuccess(ref)
      //   if(this.checksuccess(response.reference)){
      //      this.updateOrder()
      //      this.clearLocal()
      //     alert('Payment completed')
      //   }else{
      //     alert('payment Declined')
      //   }
      // alert(message)
    }
  })
  handler.openIframe();
},
checksuccess(reference){
        console('running from transaction')
      //  const res =  fetch(`https://api.paystack.co/transaction/verify/:${reference}`,this.option)
      //  const Data =  res.json();
      // console.log(Data)
      // //check transaction
      //  if(res.status.data.status="sucess"){
      //       // this.updateOrder()
      //       // this.clearLocal()
      //       //clear the localstorage
      //   }else{
      //     return false
      //   }
      },
async updateOrder(){
  const OrdersRef = doc(db, "Orders", "Orders");
     let shoppingDetail = localStorage.getItem('ShippingDetails')
       shoppingDetail = JSON.parse(shoppingDetail)
       //console.log('gotten from the getpending',shoppingDetail)

     let order = {
      id:uuidv4(),
      Pending:true,
      Shippingdetail:{
         Address:shoppingDetail.address,
         Email:shoppingDetail.email,
         mobile:shoppingDetail.mobile
      },
      Total:this.Total,
      cart:this.cart
     }
     await updateDoc(OrdersRef, {
    Order: arrayUnion(order)
     });
     
},
async clearLocal(){
    localStorage.removeItem('cart')
    localStorage.removeItem('ShippingDetails')
    localStorage.removeItem('Total')
},
goHome(){
   this.$router.push('/')
}
     },
   computed:{
     ...mapGetters(['GetTotal'])
   },
   created(){
    this.getDetail()
    this.getShippingAddressPrice()
     this.updateOrder()
    //this.getPrice()
     //this.mail()
    //this.docRef()
    //this.getOrders()
   // this.getpaymentinfo()
   }
}
</script>

<style scoped>
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
:root{
    /* color type A */
    --line_color : #555555 ;
    --back_color : #FFECF6  ;

    /* color type B */
    /* --line_color : #1b1919 ;
    --back_color : #E9ECFF  ; */

    /* color type C */
    /* --line_color : #00135C ;
    --back_color : #DEFFFA  ; */
}

.button{
    position : relative ;
    z-index : 0 ;
    width : 240px ;
    height : 56px ;
    text-decoration : none ;
    font-size : 14px ; 
    font-weight : bold ;
    color : var(--line_color) ;
    letter-spacing : 2px ;
    transition : all .3s ease ;
}
.button__text{
    display : flex ;
    justify-content : center ;
    align-items : center ;
    width : 100% ;
    height : 100% ;
}
.button::before,
.button::after,
.button__text::before,
.button__text::after{
    content : '' ;
    position : absolute ;
    height : 3px ;
    border-radius : 2px ;
    background : var(--line_color) ;
    transition : all .5s ease ;
}
.button::before{
    top : 0 ;
    left : 54px ;
    width : calc( 100% - 56px * 2 - 16px ) ;
}
.button::after{
    top : 0 ;
    right : 54px ;
    width : 8px ;
}
.button__text::before{
    bottom : 0 ;
    right : 54px ;
    width : calc( 100% - 56px * 2 - 16px ) ;
}
.button__text::after{
    bottom : 0 ;
    left : 54px ;
    width : 8px ;
}
.button__line{
    position : absolute ;
    top : 0 ;
    width : 56px ;
    height : 100% ;
    overflow : hidden ;
}
.button__line::before{
    content : '' ;
    position : absolute ;
    top : 0 ;
    width : 150% ;
    height : 100% ;
    box-sizing : border-box ;
    border-radius : 300px ;
    border : solid 3px var(--line_color) ;
}
.button__line:nth-child(1),
.button__line:nth-child(1)::before{
    left : 0 ;
}
.button__line:nth-child(2),
.button__line:nth-child(2)::before{
    right : 0 ;
}
.button:hover{
    letter-spacing : 6px ;
}
.button:hover::before,
.button:hover .button__text::before{
    width : 8px ;
}
.button:hover::after,
.button:hover .button__text::after{
    width : calc( 100% - 56px * 2 - 16px ) ;
}
.button__drow1,
.button__drow2{
    position : absolute ;
    z-index : -1 ;
    border-radius : 16px ;
    transform-origin : 16px 16px ;
}
.button__drow1{
    top : -16px ;
    left : 40px ;
    width : 32px ;
    height : 0;
    transform : rotate( 30deg ) ;
}
.button__drow2{
    top : 44px ;
    left : 77px ;
    width : 32px ;
    height : 0 ;
    transform : rotate(-127deg ) ;
}
.button__drow1::before,
.button__drow1::after,
.button__drow2::before,
.button__drow2::after{
    content : '' ;
    position : absolute ;
}
.button__drow1::before{
    bottom : 0 ;
    left : 0 ;
    width : 0 ;
    height : 32px ;
    border-radius : 16px ;
    transform-origin : 16px 16px ;
    transform : rotate( -60deg ) ;
}
.button__drow1::after{
    top : -10px ;
    left : 45px ;
    width : 0 ;
    height : 32px ;
    border-radius : 16px ;
    transform-origin : 16px 16px ;
    transform : rotate( 69deg ) ;
}
.button__drow2::before{
    bottom : 0 ;
    left : 0 ;
    width : 0 ;
    height : 32px ;
    border-radius : 16px ;
    transform-origin : 16px 16px ;
    transform : rotate( -146deg ) ;
}
.button__drow2::after{
    bottom : 26px ;
    left : -40px ;
    width : 0 ;
    height : 32px ;
    border-radius : 16px ;
    transform-origin : 16px 16px ;
    transform : rotate( -262deg ) ;
}
.button__drow1,
.button__drow1::before,
.button__drow1::after,
.button__drow2,
.button__drow2::before,
.button__drow2::after{
    background : var( --back_color ) ;
}
.button:hover .button__drow1{
    animation : drow1 ease-in .06s ;
    animation-fill-mode : forwards ;
}
.button:hover .button__drow1::before{
    animation : drow2 linear .08s .06s ;
    animation-fill-mode : forwards ;
}
.button:hover .button__drow1::after{
    animation : drow3 linear .03s .14s ;
    animation-fill-mode : forwards ;
}
.button:hover .button__drow2{
    animation : drow4 linear .06s .2s ;
    animation-fill-mode : forwards ;
}
.button:hover .button__drow2::before{
    animation : drow3 linear .03s .26s ;
    animation-fill-mode : forwards ;
}
.button:hover .button__drow2::after{
    animation : drow5 linear .06s .32s ;
    animation-fill-mode : forwards ;
}
@keyframes drow1{
    0%   { height : 0 ; }
    100% { height : 100px ; }
}
@keyframes drow2{
    0%   { width : 0 ; opacity : 0 ;}
    10%  { opacity : 0 ;}
    11%  { opacity : 1 ;}
    100% { width : 120px ; }
}
@keyframes drow3{
    0%   { width : 0 ; }
    100% { width : 80px ; }
}
@keyframes drow4{
    0%   { height : 0 ; }
    100% { height : 120px ; }
}
@keyframes drow5{
    0%   { width : 0 ; }
    100% { width : 124px ; }
}






/* 本体には関係ないスタイル */
.container{
    width : 100% ;
    height : 300px ;
    display : flex ;
    flex-direction : column ;
    justify-content : center ;
    align-items : center ;
}
.a {
  text-decoration: none;
  border: 3px solid yellow;
  color: transparent;
  padding: 40px 80px;
  font-size: 28px;
  font-family: sans-serif;
  letter-spacing: 5px;
  transition: all 0.5s;
  position: relative;
}
.a:before {
  content: "HOME";
  display: flex;
  justify-content: center;
  align-items: center;
  color: yellow;
  background: rgb(34, 34, 34);
  font-size: 28px;
  top: 0;
  left: 100%;
  font-family: sans-serif;
  letter-spacing: 5px;
  transition: all 1s;
  height: 100%;
  width: 100%;
  position: absolute;
  transform: scale(0) rotatey(0);
  opacity: 0;
}
.a:hover:before {
  transform: scale(1) rotatey(360deg);
  left: 0;
  opacity: 1;
}
.a:after {
  content: "HOME";
  display: flex;
  justify-content: center;
  align-items: center;
  color: yellow;
  background: rgb(34, 34, 34);
  font-size: 28px;
  top: 0;
  left: 0;
  font-family: sans-serif;
  letter-spacing: 5px;
  transition: all 1s;
  height: 100%;
  width: 100%;
  position: absolute;
  transform: scale(1) rotatey(0);
  opacity: 1;
}
.a:hover:after {
  transform: scale(0) rotatey(360deg);
  left: -100%;
  opacity: 0;
}

</style>





ProcessPayment(state,payload){
    let checksuccess = async function(reference){
       const res = await fetch(`https://api.paystack.co/transaction/verify/:${reference}`)
      //check transaction
       if(res.status.data.status="sucess"){
          return true
        }else{
          return false
        }
      }  
   let handler = PaystackPop.setup({
    key:'pk_live_25efa6b8308a019542749ab1828130194d21553d',
    email:shippingDetail.email, 
    amount:payload.amount,
    ref:''+Math.floor((Math.random() * 1000000000) + 1),
    onClose: function() {
      alert('Transaction was not completed, window closed.');
    },
    callback:function(response){
      let message = 'Payment complete! Reference: ' +response.reference;
        //check for success by using reference else push to check
        if(checksuccess(response.reference)){
         updateOrders()

          alert('Payment completed')
        }else{
          alert('payment Declined')
        }
      alert(message)
    }
  })
  handler.openIframe();
},















basically make payload


//get shipping address from the shipping view and get show here together with the price and add to the final price and as to proceed to pay



let handler = PaystackPop.setup({
  key:'pk_live_25efa6b8308a019542749ab1828130194d21553d',
  email:shippingDetail.email, 
  amount:payload.amount,
  ref:''+Math.floor((Math.random() * 1000000000) + 1),
  onClose: function() {
    alert('Transaction was not completed, window closed.');
  },
  callback:function(response){
    let message = 'Payment complete! Reference: ' +response.reference;
      //check for success by using reference else push to check
      if(checksuccess(response.reference)){
       updateOrders()

        alert('Payment completed')
      }else{
        alert('payment Declined')
      }
    
   
    alert(message)
  }
})
handler.openIframe();