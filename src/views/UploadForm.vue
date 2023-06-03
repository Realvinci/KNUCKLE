<template>
  <div>
      <h1>Upload Product</h1>
    <form @submit.prevent="">
    <div class="form-row">
    <div class="form-group col-md-6">
      <label for="productname">ProductName:</label>
      <input type="text" class="form-control" id="productname" v-model="product.name">
    </div>
    <div class="form-group col-md-6">
      <label for="inputPassword4">Price</label>
      <input type="number" class="form-control" id="price" v-model="product.price">
    </div>
  </div>
  <div class="form-row">
    <div class="form-group col-md-6">
    <label for="exampleFormControlSelect1">Category</label>
    <select class="form-control" id="exampleFormControlSelect1">
      <option>Product</option>
      <option>Featured</option>
    </select>
    </div>
    <div class="form-group col-md-6">
        <form @submit.prevent="uploadImage">
       <div class="form-group">
       <label for="exampleFormControlFile1">Image:</label>
       <input type="file" class="form-control-file" @change="getFile()" name="file" id="file">
       <button class="btn btn-primary" @click="uploadImage">Upload</button>
  </div>
</form>
    </div>
  </div>
  <div class="form-row">
    <div class="form-group col-md-6">
      <label for="productname">Vendor:</label>
      <input type="text" class="form-control" id="vendor" v-model="product.vendor">
    </div>
    <div class="form-group col-md-6">
      <label for="inputPassword4">id(auto-generated)</label>
      <input type="number" class="form-control" id="price" disabled>
    </div>
  </div>
  <div class="form-group">
    <label for="exampleFormControlTextarea1">Product Description</label>
    <textarea class="form-control" id="exampleFormControlTextarea1" v-model="product.description" rows="3"></textarea>
  </div>
  <button @click="AddToDatabase" class="btn btn-primary" type="submit">Submit form</button>
</form>
  </div>
</template>

<script>
import {app as app } from '../../firebase'
import { getStorage, ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import {collection,addDoc,updateDoc,doc,arrayUnion,getFirestore } from "firebase/firestore"
import {v4 as uuidv4} from 'uuid';
const db = getFirestore(app);

const storage = getStorage(app);
export default {
   name:'uploadform',
   data(){
    return{
        product:{
          name:'',
          price:'',
          vendor:'',
          description:'',
        },
        file:null,
        imageurl:''
    }
   },
   methods:{
    getFile(){
     this.file = event.target.files[0];
    },
     uploadImage(){
        const metadata ={
            contentType:'image/jpegs'
        }
        //Upload file and metadata to the object 'images'
        const storageRef = ref(storage,'products/'+this.file.name);
        const uploadTask = uploadBytesResumable(storageRef,this.file,metadata)

        //Listen for state change
        uploadTask.on('state_changed',
        (snapshot) => {
       // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
       const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
       console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
      case 'running':
        console.log('Upload is running');
        break;
    }
  }, 
  (error) => {
     console.log(error);
  }, 
  () => {
    // Upload completed successfully, now we can get the download URL
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      console.log('File available at', downloadURL);
      this.imageurl = downloadURL
    });
  }
);
     },
async AddToDatabase(){
  const productsRef = doc(db,"products","products");
try {
    if(this.product.name=='' || this.product.price=='' || this.product.vendor =='' || this.product.description=='' ){
     alert('Fill all inputs');
     return;
    }else{
    
    await updateDoc(productsRef, {
    products:arrayUnion({name: this.product.name,
    price: Number(this.product.price),
    image:this.imageurl,
    vendor:this.product.vendor,
    description:this.product.description,
    id:uuidv4(),
    defaultPrice:Number(this.product.price)})
  })
  
  this.ClearField();
  //console.log("Document written with ID: ", docRef.id);
}
 
} catch (e) {
  console.error("Error adding document: ", e);
}
},
ClearField(){
    this.product.name = '';
    this.product.price = '';
    this.product.vendor = '';
    this.product.description = '';
    this.imageurl = '';
    this.file = null;
}
   
   }
}
</script>

<style>

</style>