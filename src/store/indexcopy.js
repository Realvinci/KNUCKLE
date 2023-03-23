import Vue from 'vue'
import Vuex from 'vuex'
import {app as app} from '../../firebase'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs,getFirestore,addDoc,doc,deleteDoc } from "firebase/firestore"; 
import jwtDecode from 'jwt-decode';



/////Get the defaultPrice function to work

const db = getFirestore(app);
const auth = getAuth(app);

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    products:[],
    featured:[],
    Cart:[],
    product:{},
    firestoredata:[],
    Total:0,
    users:[]
  },
  getters: {
    getFeatured:(state)=>state.featured,
    getCart(state){
       return state.Cart.flat();
    },
    getProduct:(state)=>state.product,
    getFirestoredata:(state)=>state.products,
    GetUsers:(state)=>state.users,
    GetTotal:(state)=>state.Total
  },
  mutations: {
   async add(state,payload){
      //check
     let productExist  = false;
     const querySnapshot = await getDocs(collection(db,"cart"));
     querySnapshot.forEach((doc)=>{
        if(payload.id==doc.data().id){
           productExist = true;
        }
     })
   if(productExist){
      alert('product exist');
   }else{
    state.Cart.push(payload);
       try {
         addDoc(collection(db,"cart"),{
           name:payload.name,
           price:payload.price,
           image:payload.image,
           qty:1,
           id:payload.id
      
        })
       } catch (error) {
         console.log(error)
       }
   }
 }, 
firestoredata(state,payload){
      payload.forEach((doc)=>{
        state.products.push(doc.data());
      })
    },
    getusers(state,payload){
      payload.forEach((doc)=>{
        state.users.push(doc.data());
      })
    },
 cartdata(state,payload){
      payload.forEach((doc)=>{
        state.Cart.push(doc.data())
      })
    },
  delete(state,payload){
     querySnapshot.forEach((doc)=>{

     })
  },
  addTolocalstorage(state,payload){
    let cartItem = localStorage.getItem('cart');
    let parsedCartItem  = JSON.parse(cartItem);
    let find = parsedCartItem.find(p=>p.id==payload.id)
     if(find){
       alert("product exists");
     }else{
       payload.qty = 1;
       console.log(payload)
       
       parsedCartItem.push(payload)
       state.Cart.push(payload);
       cartItem = JSON.stringify(parsedCartItem);
       localStorage.setItem('cart',cartItem);
     }
     
    
  },
  getItemlocalStorage(state)
  {
  let cartItem = localStorage.getItem('cart');
   let stringifiedcartItem = JSON.parse(cartItem);
    state.Cart = [...stringifiedcartItem];
  },
  localstorageTotal(state){
    let total = 0;
    let cart = localStorage.getItem('cart');
     let parsedcart = JSON.parse(cart);
     for(let item of parsedcart){
         total+=item.price;
     }
     state.Total = total;
  },
  deletels(state,payload){
    //get cart item before deleting
    let cartItems = localStorage.getItem('cart');
    let products = JSON.parse(cartItems);

     for(let i =0;i<products.length;i++){
        if(products[i].id===payload.id){
          products.splice(i,1);
          //push new products into state.cart
          state.Cart = products;
          //change localstorage cart
          let parsed = JSON.stringify(products)
          let newCart = localStorage.setItem('cart',parsed)
          //call the total function
         localstorageTotal();
        }
     }
  
  },
  ChangeValue(state,value,id){
    let newCartArray =[];
    console.log(id);
    // for(let item of state.Cart){
    //     //try and get the value changed and work on that dont loop through the whole thing
    //         if(state.Cart.id===id){
    //           item.qty = Number(item.qty);
    //           item.price = item.defaultPrice*item.qty
    //           newCartArray.push(item);
    //         }else{
    //            item.qty = Number(item.qty);
    //            item.price = item.defaultPrice*item.qty
    //            newCartArray.push(item);
    //         }
    //   console.log(newCartArray);
    // }
    //dont use the value to loop through th whole thing
     for(let item of state.Cart){
        if(item.id === state.Cart.id){
          console.log(item.id)
        }  
     }
  },
  
  },
  actions: {
    signUp(){
      createUserWithEmailAndPassword(auth, email,password)
  .then((userCredential) => {
    
    const user = userCredential.user;
    console.log(user);
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });
    },
    addToCart({commit},payload){
       commit('add',payload)
   },
    async getDataFromFirestore({commit}){
      const querySnapshot = await getDocs(collection(db,"products"));
      commit('firestoredata',querySnapshot);
    },
    async getUsersFromFirestore({commit}){
      const querySnapshot = await getDocs(collection(db,"users"));
      commit('getusers',querySnapshot);
    },
    async getDataFromCart({commit}){
      const querySnapshot = await getDocs(collection(db,"cart"));
      commit('cartdata',querySnapshot);
    },
    async DeleteFromCart({commit},payload){
      const querySnapshot  = await getDocs(collection,(db,"cart"))
   
       commit('delete',querySnapshot);
      },
      storeCartInLocalStorage({commit},payload){
        // const parsed = JSON.stringify(payload);
         commit('addTolocalstorage',payload)
       },
     getItemfromLocalstorage({commit}){
        commit('getItemlocalStorage')
     },
     getTotal({commit}){
      commit('localstorageTotal')
     },
     deleteItemfromLocalstorage({commit},payload){
      commit('deletels',payload)
     },
     getValue({commit},value,id){
      commit('ChangeValue',value,id)
    },
    // getDefaultPrice({commit}){
    //     commit('defaultprice')
    //   }
  },
   
})



// localStorage.setItem(parsed)






// deleteFromlocalStorage(payload){
//   let cartItems = localStorage.getItem('cart');
//    let cart = JSON.parse(cartItems);
//    //look for the payload id in the cartItems
//    for( let i = 0; i < cart.length; i++){ 

//    if ( cart[i].id === payload.id) { 

//    cart.splice(i, 1); 
//    console.log(cart);
//     let parsed = JSON.stringify(cart)
//     let newcart = localStorage.setItem('cart',parsed);
//     window.location.reload()
//     this.getTotal(parsed)
   
//    }    
// }

// },



// getvalue(payload){
//   const value = document.getElementById('qty').value;
//   let cart = localStorage.getItem('cart');
//   cart = JSON.parse(cart);
//   for(let i=0;i<cart.length;i++){
//    if(cart[i].id===payload.id){
//        cart[i].qty = value;
//        // let qty =cart[i].qty;
//        // let price =  Number(cart[i].price);
//        // cart[i].price =qty* price;
//        //let parsed = JSON.stringify(cart);
//        localStorage.setItem('cart',parsed);
//        window.location.reload()
//    }
//   }
// }





//get Default price and run it once






// ChangeValue(state,value){
//   let newCartArray =[]
//   let cart = localStorage.getItem('cart');
//   cart = JSON.parse(cart);
//   for(let item of cart){
//       item.qty = Number(value);
//      item.price = item.defaultPrice*item.qty
//      newCartArray.push(item);
//   }
//   let latestcart = JSON.stringify(newCartArray);
//   localStorage.setItem('cart',latestcart);
 
//   console.log(newCartArray);
// },




////operation
/*
1.find if user is logged in 
2.if user is logged in therefore it exist
3.if it exists look for the user role 
4.if the role and grant privilege
5.if is admin it can add and has access to dashboard as well as can upload product and can delete product
6.if is user check for cart and push to local storage 

7.if is not logged in can carryout operation in the  browser only until time for processing payment then it logs the user in or makes acnt for the user 
8.if the payment is complete clear the user cart

9.making an acnt automaticaly the cart is created and checked local storage for possible items and  pushes it to the users firebaase cart

*/

// import jwt_decode from "jwt-decode";
 
// var token = "eyJ0eXAiO.../// jwt token";
// var decoded = jwt_decode(token);
 
// console.log(decoded);
 
// /* prints:
//  * { foo: "bar",
//  *   exp: 1393286893,
//  *   iat: 1393268893  }
//  */
 
// // decode header by passing in options (useful for when you need `kid` to verify a JWT):
// var decodedHeader = jwt_decode(token, { header: true });
// console.log(decodedHeader);
 
// /* prints:
//  * { typ: "JWT",
//  *   alg: "HS256" }
//  */



function checklogin(){
  let tokenExist  = false ;
  let Token = localStorage.getItem('sign-token');
  Token = JSON.stringify(Token);
   return Token
}

function checkuser(){
   let token = checklogin();
   if(token){
      token = jwt_decode(token)
       for(user of token){
          return user.role
       }
   }
}