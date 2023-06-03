<template>
    <div class="orders bg-primary-light " style="height:100vh;">
        <div class="card-body bg-light rounded">
                <h5 class="card-title">Orders</h5>
                <button class="btn btn" @click="getCompleted">Completed</button>
                <button class="btn btn" @click="getPending">Pending</button>
                <table class="table table-borderless datatable">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Customer</th>
                      <th scope="col">Address</th>
                      <th scope="col">Price</th>
                      <th scope="col">Pending</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(order,i) in Orders" :key="i">
                      <th scope="row"><a href="#">#{{ i+1}}</a></th>
                      <router-link :to="`/order/${order.id}`"><td>{{ order.Shippingdetail.Email }}</td></router-link>
                      <td><a href="#" class="text-primary">{{ order.Shippingdetail.Address }}</a></td>
                      <td>N{{ order.Total }}</td>
                      <td><span class="badge bg-success">{{ order.Pending }}</span></td>
                    </tr>
                  </tbody>
                </table>

              </div>
    </div>
</template>

<script>
import {app as app} from '../../../firebase'
import { collection, getDocs,getFirestore,query,where,updateDoc,doc,arrayUnion } from "firebase/firestore"; 
const db = getFirestore(app);
export default {
    name:'AdminOrders',
    data(){
      return{
          Orders:[],
          Completed:[],
          Pending:[],
          id:this.$route.params
      }
    },
    methods:{
         async getAllOrders(){
             const querySnapshot = await getDocs(collection(db,"Orders"))
             querySnapshot.forEach((doc)=>{
                 for(let item of doc.data().Order){
                    this.Orders.push(item)
                    if(!item.Pending){
                      this.Completed.push(item)
                    }
                    if(item.Pending){
                       this.Pending.push(item)
                    }
                 }
                
             })
         },
         getCompleted(){
          this.Orders = this.Completed
         },
          getPending(){
              this.Order = this.Pending
         }
    },
    created(){
       this.getAllOrders();
      // this.getCompleted();
    }
}
</script>

<style scoped>
.bg-primary-light {
  background-color: #cfe2ff;
  border-color: #cfe2ff;
}

.bg-secondary-light {
  background-color: #e2e3e5;
  border-color: #e2e3e5;
}

.bg-success-light {
  background-color: #d1e7dd;
  border-color: #d1e7dd;
}

</style>