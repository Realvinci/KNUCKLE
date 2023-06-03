<template>
  <section class="h-100" style="background-color: #eee;">
  <div class="container h-100 py-5">
    <div class="row d-flex justify-content-center align-items-center h-100">
      <div class="col-10">

        <div class="d-flex justify-content-between align-items-center mb-4">
          <h3 class="fw-normal mb-0 text-black">Shopping Cart</h3>
          
        </div>

        <div class="card rounded-3 mb-4" v-for="product in testCart" :key="product.id">
          <div class="card-body p-4">
            <div class="row d-flex justify-content-between align-items-center">
              <div class="col-md-2 col-lg-2 col-xl-2">
                <img
                  :src="product.image"
                  class="img-fluid rounded-3" alt="Cotton T-shirt">
              </div>
              <div class="col-md-3 col-lg-3 col-xl-3">
                <p class="lead fw-normal mb-2">{{ product.name }}</p>
              </div>
              <div class="col-md-3 col-lg-3 col-xl-2 d-flex">
                <button  @click="decreaseqty(product)" class="btn btn-link px-2">
                  <i class="fas fa-minus"></i>
                </button>

                <input id="form1" min="0" name="quantity"  type="number" v-model="product.qty"
                  class="form-control form-control-sm" />

                <button  @click="increaseqty(product)" class="btn btn-link px-2">
                  <i class="fas fa-plus"></i>
                </button>
              </div>
              <div class="col-md-3 col-lg-2 col-xl-2 offset-lg-1">
                <h5 class="mb-0">N {{ product.price }}</h5>
              </div>
              <div class="col-md-1 col-lg-1 col-xl-1 text-end">
                <a href="#!" class="text-danger"><i @click="deleteItem(product)" class="fas fa-trash fa-lg"></i></a>
              </div>
            </div>
          </div>
        </div>
          <div>
              <h3>N{{ Total }}</h3>
          </div>

        <div class="card">
          <div class="card-body">
          <router-link to="/shipping">
            <button type="button" class="btn btn-warning btn-block btn-lg" @click="getFromls">Proceed to Pay</button>
          </router-link>
          </div>
          <router-link to="/">
            <button type="button" class="btn btn-warning btn-block btn-lg" @click="getFromls">Home</button>
          </router-link>
        </div>

      </div>
    </div>
  </div>
</section>
   
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
       Cart:[],
       testCart:[],
       Total:0
    }
   },
   watch:{
     
   },
   methods:{
    // ...mapActions(['getUserCart','removeFromFBCart','getPrice','getInputqty']),
    //  getInput(product){
    //   //  let input = document.getElementById("input").value
    //   //  this.getInputqty(input,product)
    //    let input = document.getElementById("input").value
    //    console.log(input)
    //  },
    //   mail(){
    //     let signinToken = localStorage.getItem('signinToken')
    //     let DecryptedToken = jwt_decode(signinToken)
    //      this.email = DecryptedToken.email
    //    },
    //    async docRef(){ 
    //     try {
    //       const query = await getDocs(collection(db,"users"))
    //       query.forEach((doc)=>{
    //          if(doc.data().email===this.email){
    //             this.userref = doc.id
    //          }
    //       })
    //     } catch (error) {
    //       console.log(error)
    //     } 
        
    //   },
     //get firebase qty and make it the qty on this.qty
    //  async getqty(payload){
    //    const usersRef = collection(db,"users")
    //    let productIndex;
    //    const usercartref = doc(db,"users",this.userref)
    //    const q = query(usersRef,where("email",'==',this.email))  
    //    const querySnapshot = await getDocs(q)
    //    querySnapshot.forEach((doc)=>{
    //        if(doc.data().email===this.email){
    //           this.Cart = [...doc.data().cart]
    //           let product= this.Cart.find(product=>product.id==payload.id)
    //            productIndex = this.Cart.findIndex(product=>product.id==payload.id)
    //        }
    //    })
    //     this.Cart[productIndex].qty = Number(this.qty)
    //     console.log(this.Cart)
    //   },
      // async increase(payload){
      //    const usersRef = collection(db,"users")
         
      //    const q = query(usersRef,where("email","==",this.email))
      //    const usercartref = doc(db,"users",this.userref)
      //    const querySnapshot = await getDocs(q)
      //    querySnapshot.forEach((doc)=>{
      //     if(doc.data().email == this.email){
      //         this.Cart = [...doc.data().cart]
      //        let product = this.Cart.find(product=>product.id==payload.id)
      //        if(product){
      //          product.qty++
      //          updateDoc(usercartref,{
      //           cart:this.Cart
      //         })
      //         window.location.reload()
      //        }
      //     }
      //    })
      //    console.log(this.Cart)
      // },
      // async decrease(payload){
      //    const usersRef = collection(db,"users")
         
      //    const q = query(usersRef,where("email","==",this.email))
      //    const usercartref = doc(db,"users",this.userref)
      //    const querySnapshot = await getDocs(q)
      //    querySnapshot.forEach((doc)=>{
      //     if(doc.data().email == this.email){
      //         this.Cart = [...doc.data().cart]
      //        let product = this.Cart.find(product=>product.id==payload.id)
      //        if(product){
      //           if(product.qty>1){
      //             product.qty--
      //           }else{
      //              product.qty
      //           }
                
      //           updateDoc(usercartref,{
      //           cart:this.Cart
      //         })
      //         window.location.reload()
      //        }
      //     }
      //    })
      //    console.log(this.Cart)
      // },
      getFromls(){
           let cart = localStorage.getItem('cart')
           if(cart){
               this.testCart = JSON.parse(cart)
               console.log('this is from ls',this.testCart)
           }
      },
      deleteItem(payload){
           let cart = localStorage.getItem('cart')
           this.testCart = [...JSON.parse(cart)]
           let index = this.testCart.findIndex(product=>product.id === payload.id)
           this.testCart.splice(index,1)
           const sum = this.testCart.reduce(
            (accumulator, currentValue) => accumulator + (currentValue.defaultPrice*currentValue.qty),
            0,);
            this.Total = sum;
            localStorage.setItem('Total',JSON.stringify(this.Total))
           localStorage.setItem('cart',JSON.stringify(this.testCart)) 
      },
      getCompoundPrice(){
          for(let item of this.testCart){
              this.Total += item.defaultPrice * item.qty
          }
          console.log(this.Total)
          localStorage.setItem('Total',JSON.stringify(this.Total))
      },
      increaseqty(product){
          //get the qty and increase
           product.qty++
           const sum = this.testCart.reduce(
            (accumulator, currentValue) => accumulator + (currentValue.defaultPrice*currentValue.qty),
            0,);
            this.Total = sum;
            localStorage.setItem('Total',JSON.stringify(this.Total))
           localStorage.setItem('cart',JSON.stringify(this.testCart))
      },
      decreaseqty(product){
         if(product.qty>1){
            product.qty--
            const sum = this.testCart.reduce(
              (accumulator,currentValue)=>accumulator + (currentValue.defaultPrice*currentValue.qty),0);
            this.Total = sum;
            localStorage.setItem('Total',JSON.stringify(this.Total))
            localStorage.setItem('cart',JSON.stringify(this.testCart)) 
         }
      }
   },

   computed:{
      
    //...mapGetters(['getCart','GetTotal']),
   },
   created(){
   // this.getUserCart()
    //this.getPrice()
    //this.mail()
    //this.docRef()
    this.getFromls()
    this.getCompoundPrice()
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



