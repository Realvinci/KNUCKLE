<template>
    <div>
        <h2>Order {{ Orders.id }}</h2>
       <div class="container">
          <div class="row">
            <div class="col-8">
                <div class="cartDetail" v-for="(product,i) in Orders.cart" :key="i">
                 <img :src="product.image" alt="">
                 <h3>{{ product.name }}</h3>
                 <h4>N {{ product.price }}</h4>
                 <h4>{{ product.qty }}</h4>
                 <h4>N{{ product.qty*product.price }}</h4>
              </div>
            </div>
            <div class="col-4">
                <div class="customerDetail">
                 <h2>Customer</h2>
                 <h3>{{ Orders.Shippingdetail.Email }}</h3>
                 <h5>Number of Orders</h5>
                 <div class="shippingDetail">
                    <h2>Shipping Details</h2>
                     <h3>{{ Orders.Shippingdetail.Address }}</h3>
                     <h3>{{ Orders.Shippingdetail.mobile }}</h3>
                 </div>
                 <button @click="completeOrder">Complete</button>
             </div>
            </div>
            <div class="col-4">
                <div class="cartDetails">
              <div class="priceSummary">
                 <h4>Subtotal               N {{ Orders.Total }}</h4>
                 <h4>Shipping               N {{  shippingFee }}</h4>
                 <h3>Total                  N {{ Orders.Total + shippingFee }}</h3>
              </div>
          </div>
            </div>
          </div>
          
       </div>
    </div>
</template>

<script>
import {app as app} from '../../firebase'
import { collection, getDocs,getFirestore,doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
const db = getFirestore(app);
export default {
   data(){
      return{
        id:this.$route.params,
        Orders:[],
        orderObject:{},
        shippingFee:0,
        shippingAddress:''
      }
   },
   methods:{
      async getOrderDetail(){ 
            this.id = ''+this.id.id
          const querySnapshot = await getDocs(collection(db,"Orders"))
          querySnapshot.forEach((doc)=>{
              this.Orders=doc.data().Order
          })
          for(let order of this.Orders){
             if(this.id===order.id){  
              Object.assign(this.orderObject,order)
              this.Orders = order
             }
          }
        const addresses = await getDocs(collection(db,"Address"))
        addresses.forEach((doc)=>{
            for(let address of doc.data().Addresses){
                  if(address.Address === this.Orders.Shippingdetail.Address){
                     this.shippingFee= address.Price
                  }
            }
        })
      },
      async completeOrder(){
          const deleteobj = this.orderObject;
          const OrderRef = doc(db, "Orders", "Orders");
          const update = {...this.orderObject,Pending:false}
         // console.log(update)
         await updateDoc(OrderRef,{
            Order:arrayUnion(update)
         })
         await updateDoc(OrderRef,{
            Order: arrayRemove(deleteobj)
         })
         alert('Order completed')
         this.$router.push('/adminOrders')
      }
      
   },
   created(){
    this.getOrderDetail()
  
   },
   beforeMount(){
   
   }
}
</script>

<style>
img{
    width: 100px;
}
.cartDetails{
    display: flex;
}
.cartDetail{
    border:1px solid red;
}
.priceSummary{
    border:1px solid blue;
}
.customerDetail{
    border:1px solid green;
} 
.shippingDetail{
    border:1px solid grey;   
}
</style>