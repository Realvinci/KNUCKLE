<template>

<div class="container">
    <div class="card">
        <div class="card-body">
            <h3 class="card-title">{{ product[0].name }}</h3>
            <div class="row">
                <div class="col-lg-5 col-md-5 col-sm-6">
                    <div class="white-box text-center"><img :src="product[0].image" class="img-responsive"></div>
                </div>
                <div class="col-lg-7 col-md-7 col-sm-6">
                    <h4 class="box-title mt-5">Product description</h4>
                    <p>{{ product[0].description }}</p>
                    <h2 class="mt-5">
                      Price: N {{ product[0].price }}
                    </h2>
                </div>
                <div class="col-lg-12 col-md-12 col-sm-12">
                    <h3 class="box-title mt-5">Edit Info</h3>
                    <div class="table-responsive">
                        <table class="table table-striped table-product">
                            <tbody>
                                <tr>
                                    <td width="390">Vendor</td>
                                    <td><input type="text" v-model="product[0].vendor"></td>
                                </tr>
                                <tr>
                                    <td>Product Name</td>
                                    <td><input type="text" v-model="product[0].name"></td>
                                </tr>
                                <tr>
                                    <td>Product Price</td>
                                    <td><input type="text" v-model="product[0].price"></td>
                                </tr>
                                <tr>
                                    <td>Product Description</td>
                                    <td><textarea  id="" cols="30" rows="10" v-model="product[0].description"></textarea></td>
                                </tr>
                               
                            </tbody>
                        </table>
                        <button @click="update">update</button>
                        <button @click="deleteproduct">Delete</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
import { collection, getDocs,getFirestore,doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore'
import {app as app} from '../../firebase'
const db = getFirestore(app);
export default {
   data(){
    return{
        id:this.$route.params,
        productObj:{},
        product:[],
        productRef:''
    }
   },
   methods:{
       async getProduct(){
        this.id = ''+this.id.id
           const querySnapshot = await getDocs(collection(db,"products"))
           querySnapshot.forEach((doc)=>{
              for(let product of doc.data().products){
                    if(product.id === this.id){
                        this.product.push(product)
                        Object.assign(this.productObj,product)
                    }
              }
           })
       },
       async update(){
        const ProductRef = doc(db, "products", "products");
          // console.log(this.product[0])
           await updateDoc(ProductRef,{
             products:arrayUnion(this.product[0])
           })
           await updateDoc(ProductRef,{
            products:arrayRemove(this.productObj)
           })
           alert('updated')
           this.$router.push('/Products')
       },
       async deleteproduct(){
          const ProductRef = doc(db,"products","products");
          await updateDoc(ProductRef,{
            products:arrayRemove(this.productObj)
           })
           alert('Product deleted')
           this.$router.push('/Products')
       }
   },
   created(){
       this.getProduct()
     
   }
}
</script>

<style scoped>
body{
    background-color: #edf1f5;
    margin-top:20px;
}
img{
    width: 400px;
}
.card {
    margin-bottom: 30px;
}
.card {
    position: relative;
    display: flex;
    flex-direction: column;
    min-width: 0;
    word-wrap: break-word;
    background-color: #fff;
    background-clip: border-box;
    border: 0 solid transparent;
    border-radius: 0;
}
.card .card-subtitle {
    font-weight: 300;
    margin-bottom: 10px;
    color: #8898aa;
}
.table-product.table-striped tbody tr:nth-of-type(odd) {
    background-color: #f3f8fa!important
}
.table-product td{
    border-top: 0px solid #dee2e6 !important;
    color: #728299!important;
}
</style>