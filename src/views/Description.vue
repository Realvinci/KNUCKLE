<template>
  <div class="description my-4 border border-dark p-2">
    <div class="container">
       <div class="row">
          <div class="col-4">
              <img :src="product.image" class="fluid" style="width:18rem" alt="">
              <h3>N{{ product.price }}</h3>
              <h1><a href="#">{{ product.vendor }}</a></h1>
          </div>
          <div class="col-8">
              <h2 class="lead">{{ product.name }}</h2>
                <p class="lead">{{ product.description }}</p>
                <h4>Rate:<i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star-half"></i></h4>
                <button @click="addToCart(product)" class="btn btn-danger"><i class="fa-solid fa-cart-shopping"></i></button>
           </div>
       </div>
    </div>
  </div>
</template>

<script>
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";
import { mapGetters,mapActions } from 'vuex';
import {app as app} from '../../firebase'
const db = getFirestore(app);
export default {
    name:'Description',
    data(){
      return {
        id:this.$route.params,
        product:{
           name:'',
           price:'',
           description:'',
           image:'',
           vendor:''
        }
      }
    },
   computed:{
    //...mapGetters(['getProduct'])
   },
   methods:{
    async getProd(){
       try {
        let id = this.id.id
       const data = await fetch(`https://fakestoreapi.com/products/${id}`).then(res=>res.json())
        console.log(data);
            this.product = {
              name:data.title,
              price:data.price,
              description:data.description,
              image:data.image
            }
      } catch (error) {
        console.log(error)
      }
    },
     async getParticular(){
      let id = this.id.id
      const allProducts = collection(db,"products");
     const product = query(allProducts,where("id","==",id))
     console.log(9);
      const querySnapshot = await getDocs(product);
      querySnapshot.forEach((doc)=>{
          console.log(doc.data());
          this.product = {
            name:doc.data().name,
            price:doc.data().price,
            description:doc.data().description,
            image:doc.data().image,
            vendor:doc.data().vendor
          }
      })
     },
    ...mapActions(['addToCart'])
   },
   created(){
   // this.getProd();
    this.getParticular();
   }
}

</script>

<style scoped>
  .fa-star{
    color:gold;
  }
</style>