<template>
  <div class="shipping">
      <h1>Enter Shipping information</h1>
      <h3>Contact information</h3>
      <input type="email" placeholder="Enter valid Email for shipping information " v-model="shippingDetails.Email">
      <div class="box">
        <h4>Shipping Address</h4>
        <div class="form-row">
          <div class="form-group col-md-6">
           <input type="text" class="form-control" placeholder="Enter Name:" v-model="shippingDetails.name">
         </div>
    <div class="form-group col-md-6">
      <input type="number" class="form-control" placeholder="Enter MobileNumber:" v-model="shippingDetails.mobile">
    </div>
  </div>
   <div class="form-row">
    <div class="form-group col-md-12">
        <label for="">Select Shipping Address:</label>
         <select name="" id="address" class="col-md-12" style="padding:7px;" >
            <option :value="address" v-for="(address,i) in getShipping" :key="i">{{ address }}</option>
         </select>
           
         </div>
   </div>
      </div>
      <div class="last">
        <router-link to="/cart">
            Return to Cart
         </router-link>

    <button @click="getshippinDetails">Proceed To Payment</button>
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
         //Address:['Modern-Market','Welfare-Quaters','High-Level','Low-Level(Benue Hotel)','Wadata','Kanshio','North-Bank','Judges Quaters','Wurukum','Airforce base road','International Market Road','Terwase agbado extention(nyon)','Giado Villa suits','Opposite college of health science road'],
         address:'',
         docid:'',
         databasemail:'',
         shippingDetails:{
             Email:'',
             name:'',
             mobile:'',
             address:'',
            
         }
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
        this.shippingDetails.address = Address
         return this.shippingDetails.address
     },
     goTopayment(){
        this.$router.push('/payment')
     },
    
    
     
  },
  created(){
    this.getShippingAddress()
    
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















// updateDoc(usercartref,{
//   Address:this.shippingDetails.address,
//   shippingemail:this.shippingDetails.Email,
//   mobile:this.shippingDetails.mobile,
//   shippingname:this.shippingDetails.name       
// })
// console.log(doc.data())