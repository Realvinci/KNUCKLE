<template>
             <div class="card-body pb-0">
                <h5 class="card-title">All Products</h5>

                <table class="table table-borderless">
                  <thead>
                    <tr>
                      <th scope="col">Preview</th>
                      <th scope="col">Product</th>
                      <th scope="col">Price</th>
                      <!-- <th scope="col">Sold</th>
                      <th scope="col">Revenue</th> -->
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="product in getFirestoredata" :key="product.id">
                      <router-link :to="`/productedit/${product.id}`">
                        <th scope="row"><a ><img :src="product.image" alt=""></a></th>
                      </router-link>
                      <td><a  class="text-primary fw-bold">{{ product.name }}</a></td>
                      <td>{{ product.price }}</td>
                      <!-- <td class="fw-bold">124</td>
                      <td>$5,828</td> -->
                    </tr>
                  </tbody>
                </table>

              </div>
</template>

<script>
import {app as app} from '../../../firebase'
//import { collection, getDocs } from 'firebase/firestore'
import { collection, getDocs,getFirestore,query,where,updateDoc,doc,arrayUnion } from "firebase/firestore"; 
import { mapActions,mapGetters } from 'vuex';
const db = getFirestore(app);
export default{
     name:'Products',
     data(){
        return{
           Products:[]
        }
     },
     methods:{
        ...mapActions(['getProductsfromfirebase'])
     },
     computed:{
    ...mapGetters(['getFirestoredata'])
     },
     created(){
      this.getProductsfromfirebase()
     }
}

</script>


<style scoped>
img{
    width:70px;
}
</style>