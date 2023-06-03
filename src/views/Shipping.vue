<template>
  <div class="shipping">
      <h1>Enter Shipping information</h1>
      <h3>Contact information</h3>
      <div class="box">
        <h4>Shipping Address</h4>
        <div class="form-row">
          <div class="form-group col-md-6">
           <input type="email" class="form-control" placeholder="Enter valid Email:" v-model="email">
           {{ email }}
         </div>
    <div class="form-group col-md-6">
      <input type="number" class="form-control" placeholder="Enter MobileNumber:" v-model="mobile">
     {{ mobile }}
    </div>
  </div>
   <div class="form-row">
    <div class="form-group col-md-12">
        <label for="">Select Shipping Address:</label>
         <select name="" id="address" class="col-md-12" style="padding:7px;" >
            <option :value="address" v-for="(address,i) in Address" :key="i">{{ address }}</option>
         </select>
           
         </div>
   </div>
      </div>
      <div class="last">
        <router-link to="/cart">
            Return to Cart
         </router-link>

    <button @click="shipDetails">Proceed To Payment</button>
      </div>
    
  </div>
</template>

<script>
import jwtDecode from 'jwt-decode'
import { mapActions, mapGetters } from 'vuex'
import {app as app} from '../../firebase'
import { collection, getDocs,getFirestore,query,where,updateDoc,doc } from "firebase/firestore"; 
const db = getFirestore(app);
export default {
  data(){
    return{        
             email:'',
             mobile:'',
             address:'',
             Address:[],
             EnteredDetails:{}
        }
  },
  computed:{
   ...mapGetters(['getShipping'])
  },
  methods:{
     ...mapActions(['getShippingAddress','setShipping']),
     getshippinDetails(){
      let shippingaddress = this.getAddress()
      let shippingDetails = {
        address:shippingaddress,
        email:this.shippingDetails.Email,
        mobile:this.shippingDetails.mobile,
      }
      this.setShipping(shippingDetails)
     },
     getAddress(){
        let selected = document.getElementById("address")
        let Address = selected.options[selected.selectedIndex].value;
        this.address = Address
         return this.address
     },
     goTopayment(){
        this.$router.push('/payment')
     },
    async getShipaddress(){
      
      const querySnapshot = await getDocs(collection(db,"Address"))
       querySnapshot.forEach((doc)=>{
          for(let item of doc.data().Addresses){
               this.Address.push(item.Address)
          }
       })
    },
    shipDetails(){
         if(this.email=='' || this.mobile == '' ){
              alert('fill all the inputs')
         }else{
          this.address = this.getAddress()
           if(!this.address)
            this.address='None'
            this.EnteredDetails ={
              address:this.address,
              email:this.email,
              mobile:this.mobile
            }
            localStorage.setItem('ShippingDetails',JSON.stringify(this.EnteredDetails))
            this.goTopayment()
         }
    }
     
  },
  computed:{
     // ...mapGetters(['getShipping'])
  },
  created(){
    //this.getShippingAddress()
    this.getShipaddress()
  }
}
</script>

<style>
.box{
    margin-top: 70px;
}
.last{
    display: flex;
    justify-content: space-between;
    margin:0 auto;
}
</style>





//add after
const usersRef = collection(db,"users")
const usercartref = doc(db,"users",this.docid)
const q = query(usersRef,where("email",'==',this.databaseemail))  
const querySnapshot = await getDocs(q);
querySnapshot.forEach((doc)=>{
    if(doc.data().email==this.databaseemail){
      updateDoc(usercartref,{
        Address:this.shippingDetails.address,
        shippingemail:this.shippingDetails.Email,
        shippingname:this.shippingDetails.name,
        mobile:this.shippingDetails.mobile
      })
      console.log(doc.data())
    }
})





//get the whole input and push to an object and work from there









// updateDoc(usercartref,{
//   Address:this.shippingDetails.address,
//   shippingemail:this.shippingDetails.Email,
//   mobile:this.shippingDetails.mobile,
//   shippingname:this.shippingDetails.name       
// })
// console.log(doc.data())