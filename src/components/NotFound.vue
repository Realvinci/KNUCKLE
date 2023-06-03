<template>
  <div>
     <h1>404</h1>
     <p>Page Not Found!</p>
     <button @click="goHome">Home</button>
  </div>
</template>

<script>
export default {
  methods:{
     goHome(){
          this.$router.push('/')
     }
  }
}
</script>

<style>

</style>