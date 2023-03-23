<template>
  <div class="home">
   <Navbar/>
   <About/>
   <Allproducts/>
   <Heading heading="Trending."/>
   <Trending/>
   
  </div>
</template>

<script>
// @ is an alias to /src
import Navbar from '@/components/Navbar.vue';
import Carousel from '@/components/Carousel.vue';
import Trending from '@/components/Trending.vue';
import Heading from '@/components/Heading.vue';
import advert from '@/components/advert.vue';
import About from '@/components/About.vue'
import Products from '@/components/products.vue';
import Allproducts from '@/components/Allproducts.vue';
export default {
  name: 'HomeView',
  data(){
    return{
     
    }
    
  },
  components: {
   Navbar,Carousel,Trending,Heading,advert,About,Allproducts,
    Products
  },
  methods:{
   
  },
  created(){
  
  },
  beforeMount(){
    
  },
  onMounted(){
    
  }
}
</script>
