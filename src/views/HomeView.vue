<template>
  <div class="home">
   <Navbar/>
   <div class="overlay" data-overlay data-nav-toggler></div>
   <Hero/>
   <About/>
   <Allproducts/>
   <Trending/>
 <Newsletter/>
<Footer/>
   
  </div>
</template>

<script>
// @ is an alias to /src
import Navbar from '@/components/Navbar.vue';
import Carousel from '@/components/Carousel.vue';
import Trending from '@/components/Trending.vue';
import Heading from '@/components/Heading.vue';
import Newsletter from '@/components/Newsletter.vue';
import About from '@/components/About.vue'
import Products from '@/components/products.vue';
import Allproducts from '@/components/Allproducts.vue';
import Footer from '@/components/Footer.vue'
import Hero from '@/components/Hero.vue'
import { mapActions } from 'vuex';
export default {
  name: 'HomeView',
  data(){
    return{
      loggedIn:false
    }
    
  },
  components: {
   Navbar,Carousel,Trending,Heading,Newsletter,About,Allproducts,
    Products,Hero,Footer
  },
  methods:{
    checklogged(){
          console.log('this is the logged function before check',this.loggedIn)
         let Token = localStorage.getItem('signinToken')
         if(Token){
            this.loggedIn = true
         }
         console.log('this is after the Token found',this.loggedIn)
    },
    createCart(){
        let cart = localStorage.getItem('cart')
        if(!cart){
           let cart = []
           localStorage.setItem('cart',JSON.stringify(cart))
        }
    }
  },
  created(){
    //this.checklogged()
    this.createCart()
  },
  beforeMount(){
    
  },
  onMounted(){
    
  }
}
</script>



//check for loggged in and work from there



