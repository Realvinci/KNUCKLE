<template>
  <section id="store" class="store py-5">
    <div class="container">
      <!-- section title -->
      <div class="row">
        <div class="col-10 mx-auto col-sm-6 text-center">
          <h1 class="text-capitalize">our <strong class="banner-title ">store</strong></h1>
        </div>
      </div>
      <!-- end of section title -->
      <!--filter buttons -->
      <div class="row">
        <div class=" col-lg-8 mx-auto d-flex justify-content-around my-2 sortBtn flex-wrap">
          <a href="#" class="btn btn-outline-secondary btn-black text-uppercase filter-btn m-2" data-filter="all"> all</a>
          <a href="#" class="btn btn-outline-secondary btn-black text-uppercase filter-btn m-2" data-filter="cakes">cakes</a>
          <a href="#" class="btn btn-outline-secondary btn-black text-uppercase filter-btn m-2" data-filter="cupcakes">cupcakes</a>
          <a href="#" class="btn btn-outline-secondary btn-black text-uppercase filter-btn m-2" data-filter="sweets">sweets</a>
          <a href="#" class="btn btn-outline-secondary btn-black text-uppercase filter-btn m-2" data-filter="doughnuts">doughnuts</a>
        </div>
      </div>
      <!-- search box -->
      <div class="row">

        <div class="col-10 mx-auto col-md-6">
          <form>
            <div class="input-group mb-3">
              <div class="input-group-prepend ">
                <span class="input-group-text search-box" id="search-icon"><i class="fas fa-search"></i></span>
              </div>
              <input type="text" class="form-control" placeholder='item....' id="search-item">
            </div>

          </form>
        </div>
      </div>
      <!--end of filter buttons -->
      <!-- store  items-->
       
       <div class="container"> 
        <div class="row row-4">

     
      <div  class="store-items row " v-for="product in getFirestoredata" :key="product.id" id="store-items">
        <!-- single item -->
        <div class="col-10 col-sm-6 col-lg-4 mx-auto my-3 store-item sweets" data-item="sweets">
          <div class="card ">
            <div class="img-container">
              <router-link :to="`/description/${product.id}`">
                   <img class="card-img-top store-img img-fluid" :src="product.image" alt="" >
                </router-link>
              <span class="store-item-icon">
                <i @click="addToFirestore(product)" class="fas fa-shopping-cart"></i>
              </span>
            </div>
            <div class="card-body">
              <div class="card-text d-flex justify-content-between text-capitalize">
                <h5 id="store-item-name">{{ product.name }}</h5>
                <h5 class="store-item-value">N<strong id="store-item-price" class="font-weight-bold">{{ product.price }}</strong></h5>

              </div>
            </div>


          </div>
          <!-- end of card-->
        </div>
        <!--end of single store item-->
     
        <!-- single item -->
        </div>
        </div>
        </div>
      </div>
  </section>
</template>

<script>
import { mapActions,mapGetters } from 'vuex';   
export default {
   name:'Allproducts',
   methods:{
    ...mapActions(['getProductsfromfirebase','lastAdd','addToFirestore']),
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

</style>