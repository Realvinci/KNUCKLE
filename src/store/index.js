import Vue from 'vue'
import Vuex from 'vuex'
import {app as app} from '../../firebase'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs,getFirestore,query,where,updateDoc,doc } from "firebase/firestore"; 

import jwt_decode from 'jwt-decode'


//check login first
//first operation get data from product collection in database and push to the products state(state.product)

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
    user:[],
    email:'',
    loggedin:false,
    Admin:false,
    userref:'',
    email:'',
    ShippingAddresses:[],
    pendingOrders:[],
    processed:[],
    Delivery:[],
    SitePick:[],
    shippingDetails:[],
    Orderref:'',
    allOrders:[]
  },
  getters: {
    getFeatured:(state)=>state.featured,
    getCart:(state)=>state.Cart,
    getFirestoredata:(state)=>state.products,
    GetUsers:(state)=>state.user,
    GetTotal:(state)=>state.Total,
    GetRole:(state)=>state.Admin,
    getuserref:(state)=>state.userref,
    getShipping:(state)=>state.ShippingAddresses,
    getPending:(state)=>state.pendingOrders,
    getProcessed:(state)=>state.processed,
    getSitePick:(state)=>state.SitePick,
    getAllOrders:(state)=>state.allOrders
  },
  mutations: {
   check(Token,state){
    if(Token){
      state.loggedin = true
      return true
    }
   },
   firestoredata(state,payload){
    payload.forEach((doc)=>{     
      state.products.push(doc.data());
    })
   },

   async addToFirestore(state,payload){
    let mail =  function(){
     let signinToken = localStorage.getItem('signinToken')
     let DecryptedToken = jwt_decode(signinToken)
      state.email = DecryptedToken.email
    }
    mail()
    let update = async function(cart,usercartref){
      await updateDoc(usercartref,{
        cart:cart
    })
   }
    let docRef = async function (){ 
      try {
        const query = await getDocs(collection(db,"users"))
        query.forEach((doc)=>{
           if(doc.data().email===state.email){
              state.userref = doc.id
           }
        })
      } catch (error) {
        console.log(error)
      } 
      
    }
    await docRef()
   
    const usersRef = collection(db,"users")
    const usercartref = doc(db,"users",state.userref)
    const q = query(usersRef,where("email",'==',state.email))  
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc)=>{
        if(doc.data().email==state.email){
           state.Cart = [...doc.data().cart]
           let found = state.Cart.find(product=>product.id==payload.id)
           if(!found){
               payload.qty=1
               state.Cart.push(payload)
               update(state.Cart,usercartref)
               alert('Added to Cart')
           }
        }
    })
   },
   async removeFromFBCart(state,payload){
      //get user email
      let mail =  function(){
        let signinToken = localStorage.getItem('signinToken')
        let DecryptedToken = jwt_decode(signinToken)
         state.email = DecryptedToken.email
       }
       mail()

  
       //get cart id
       let docRef = async function (){ 
         try {
           const query = await getDocs(collection(db,"users"))
           query.forEach((doc)=>{
              if(doc.data().email===state.email){
                 state.userref = doc.id
              }
           })
         } catch (error) {
           console.log(error)
         } 
       }
        const usersRef = collection(db,"users")
     const usercartref = doc(db,"users",state.userref)
     const q = query(usersRef,where("email",'==',state.email))  
     const querySnapshot = await getDocs(q);
     querySnapshot.forEach((doc)=>{
        if(doc.data().email==state.email){
           state.Cart = [...doc.data().cart]
           let  productIndex = state.Cart.findIndex(product=>product.id==payload.id)
          
               state.Cart.splice(productIndex,1)
                console.log(state.Cart)
          
              updateDoc(usercartref,{
                cart:state.Cart
              })
              window.location.reload()
               alert('Removed from Cart')
           
        }
    })
   },
   async  getUserCart(state){
      //get user email
      let mail =  function(){
        let signinToken = localStorage.getItem('signinToken')
        let DecryptedToken = jwt_decode(signinToken)
         state.email = DecryptedToken.email
       }
       mail()
      //get cart id
      let docRef = async function (){ 
        try {
          const query = await getDocs(collection(db,"users"))
          query.forEach((doc)=>{
             if(doc.data().email===state.email){
                state.userref = doc.id
             }
          })
        } catch (error) {
          console.log(error)
        } 
        
      }
       await docRef()
       const usersRef = collection(db,"users")
       //const usercartref = doc(db,"users",state.userref)
       const q = query(usersRef,where("email",'==',state.email))  
       const querySnapshot = await getDocs(q)
       querySnapshot.forEach((doc)=>{
          if(doc.data().email==state.email){
            state.Cart = [...doc.data().cart]
          }
       })
       console.log(state.Cart)
   },
   async getPrice(state){
    let mail =  function(){
      let signinToken = localStorage.getItem('signinToken')
      let DecryptedToken = jwt_decode(signinToken)
       state.email = DecryptedToken.email
     }
     mail()
     let docRef = async function (){ 
      try {
        const query = await getDocs(collection(db,"users"))
        query.forEach((doc)=>{
           if(doc.data().email===state.email){
              state.userref = doc.id
           }
        })
      } catch (error) {
        console.log(error)
      } 
      
    }
     await docRef()
       const usersRef = collection(db,"users")
       const usercartref = doc(db,"users",state.userref)
       const q = query(usersRef,where("email",'==',state.email))  
       const querySnapshot = await getDocs(q)
       querySnapshot.forEach((doc)=>{
          if(doc.data().email==state.email){
              for(let item of doc.data().cart){
                   state.Total += item.defaultPrice*item.qty
              }
            
          }
       })
       updateDoc(usercartref,{
        TotalPrice:state.Total
       })
   },
   async getAllOrders(state,payload){
     let mail = function(){
        let signinToken = localStorage.getItem('signinToken')
        let DecryptedToken = jwt_decode(signinToken)
         state.email = DecryptedToken.email
     }
     mail()
     let docRef = async function(){
       try {
        const query = await getDocs(collection(db,"users"))
        query.forEach((doc)=>{
          if(doc.data().email === state.email){
            state.userref = doc.id
          }
        })
       } catch (error) {
        console.log(error)
       }
     }
     await docRef()
    payload.forEach((doc)=>{
         if(!doc.data().pending){
             state.pending = [...doc.data().pending]
         }
    payload.forEach((doc)=>{
        state.allOrders = [...doc.data()]
    })     
    })
     
   },
   async getProcessed(state,payload){
       payload.forEach((doc)=>{
        if(doc.data().pending){
            state.processed = [...doc.data().pending]
        }
       })
   },
   async getPending(state,payload){
    let pending = []
      payload.forEach((doc)=>{
         if(!doc.data().Deliverd){
             //change to state later
           pending = [...doc.data()]
         }
      })
   },
   async processed(state,payload){
     let proceessed = []
      payload.forEach((doc)=>{
          if(doc.data().Deliverd){
            proceessed = [...doc.data()]
          }
      })
   },
  async getShippingAddress(state,payload){
    //const querySnapshot = await getDocs(collection(db, "Address"));
     payload.forEach((doc)=>{
        for(let item of doc.data().Addresses){
            state.ShippingAddresses.push(item.Address)
        }
      
     })
  },
  async changedToProceessed(payload){
    let testarray =[]
    //get ref of proceessed so you can update
   const querySnapshot = collection(db,"Orders")
     querySnapshot.forEach((doc)=>{
         if(doc.data().pending)
         {
            for(let item of doc.data().pending)
            {
               if(item.id==payload.id){
                   item.pending = false;
               }
            }
         }
     })
  },
  async getDelivery(state,payload){
      payload.forEach((doc)=>{
         if(doc.data().delivery){
            state.Delivery = [...doc.data()]
         }
  
      })
  },
  async OnsitePickUp(state,payload){
    payload.forEach((doc)=>{
       if(!doc.data().delivery){
         state.SitePick = [...doc.data()]
       }
    }) 
  },
  ProcessPayment(state,payload){
         
    let userdocRef = async function(){
      try {
       const query = await getDocs(collection(db,"users"))
       query.forEach((doc)=>{
         if(doc.data().email === state.email){
           state.userref = doc.id
         }
       })
      } catch (error) {
       console.log(error)
      }
    }
   userdocRef()
        let mail = function(){
          let signinToken = localStorage.getItem('signinToken')
          let DecryptedToken = jwt_decode(signinToken)
          state.email = DecryptedToken.email
        }
        mail()

        let docRef = async function (){ 
          try {
            const query = await getDocs(collection(db,"Orders"))
            query.forEach((doc)=>{
               console.log(doc.id)
               state.Orderref = doc.id
            })
          } catch (error) {
            console.log(error)
          } 
          
        }
        docRef()
        let clearCustomerCart = async function(){
          const usersRef = collection(db,"users")
          const usercartref = doc(db,"users",state.userref)
          const q = query(usersRef,where("email",'==',state.email))  
          const querySnapshot = await getDocs(q)
          querySnapshot.forEach((doc)=>{
             if(doc.data().email==state.email){
               state.Cart = [...doc.data().cart]
             }
             state.Cart = []
          })
          updateDoc(usercartref,{
            cart:state.Cart
          })
        }
        //called on Order complete
        let updateOrders = async function(){
    
           const Orders = await getDocs(collection(db,"Orders"))
           const OrderCartRef = doc(db,"Orders",state.Orderref)
           Orders.forEach((doc)=>{
            state.pendingOrders = [...doc.data().pending]
            state.pendingOrders.push({Address:payload.address,Delivery:true,Deliverd:false,mobile:payload.mobile,email:payload.email,products:[...payload.cart]})
           })
           updateDoc(OrderCartRef,{
            pending:state.pendingOrders
           })
          //get the specific customer and clear and update his cart
          clearCustomerCart()
        }
        
    
      //const querySnapshot = collection()
      let checksuccess = async function(reference){
         const res = await fetch(`https://api.paystack.co/transaction/verify/:${reference}`)
        //check transaction
         if(res.status.data.status="sucess"){
            return true
          }else{
            return false
          }
        }  
     let handler = PaystackPop.setup({
      key:'pk_live_004ba48b4bfb284f5793fb8948e49598bb572744',
      email:payload.email,
      amount:payload.amount,
      ref:''+Math.floor((Math.random() * 1000000000) + 1),
      onClose: function() {
        alert('Transaction was not completed, window closed.');
      },
      callback:function(response){
        let message = 'Payment complete! Reference: ' +response.reference;
          //check for success by using reference else push to check
          if(checksuccess(response.reference)){
           updateOrders()

            alert('Payment completed')
          }else{
            alert('payment Declined')
          }
        
       
        alert(message)
      }
    })
    handler.openIframe();
  },
  async setShipping(state,payload){

    let mail = function (){
      let signinToken = localStorage.getItem('signinToken')
       let DecryptedToken = jwt_decode(signinToken)
       state.email = DecryptedToken.email
    }
    mail()
    let docRef = async function (){ 
      try {
        const query = await getDocs(collection(db,"users"))
        query.forEach((doc)=>{
           if(doc.data().email===state.email){
              state.userref = doc.id
           }
        })
      } catch (error) {
        console.log(error)
      } 
      
    }
     await docRef()
     console.log(state.email,state.userref)
     const usersRef = collection(db,"users")
     const usercartref = doc(db,"users",state.userref)
     const q = query(usersRef,where("email",'==',state.email))  
   
      const querySnapshot = await getDocs(q)
      querySnapshot.forEach((doc)=>{
        for(let item of doc.data().shippingDetails)
        {
          state.shippingDetails.push(item)
        }
      })
      state.shippingDetails[0].shippingAddress = payload.address
      state.shippingDetails[0].shippingEmail =payload.email
      state.shippingDetails[0].shippingmobile = payload.mobile
      updateDoc(usercartref,{
        shippingDetails:state.shippingDetails[0]
      })
      this.$router.push('/payment')
  },
   async userid(state,payload){
     const email = function(){
        let token = localStorage.getItem('signinToken')
        token = jwt_decode(token)
        return token.email
     }
    let em = email()
    let userid;
    const querySnapshot = await getDocs(collection(db, "users"));
     querySnapshot.forEach((doc)=>{
      if(doc.data().email===em){
           userid = doc.id
       }
     })
     return userid
     
   },

  },
  actions: {
   checklogin({commit}){
     let Token = localStorage.getItem('signinToken');
      Token = JSON.stringify(Token);
      commit('check',Token)
   },
   async getProductsfromfirebase({commit}){
    const querySnapshot = await getDocs(collection(db,"products"));
    commit('firestoredata',querySnapshot);
   },
   checkEmail({commit}){
    let signinToken = localStorage.getItem('signinToken');
       let DecryptedToken = jwt_decode(signinToken)
      commit('email',DecryptedToken.email)
   },
  async getDocid({commit}){
    const querySnapshot = await getDocs(collection(db, "users"));
   commit('userid',querySnapshot)
  },
  addToFirestore({commit},payload){
        let signinToken = localStorage.getItem('signinToken')
         if(signinToken){
             let DecryptedToken = jwt_decode(signinToken)
             let email = DecryptedToken.email
           commit('addToFirestore',payload)
         }else{
           alert('sign-in')
         }
  },
  getUserCart({commit}){
      commit('getUserCart')
  },
  removeFromFBCart({commit},payload){
    commit('removeFromFBCart',payload)
  },
  getPrice({commit}){
      commit('getPrice')
  },
   getInputqty({commit},payload,input){
      commit('getInputqty',payload,input)
   },
  async getShippingAddress({commit}){
     try {
      const querySnapshot = await getDocs(collection,(db,"Address"))
      commit('getShippingAddress',payload)
     } catch (error) {
       console.log(error)
     }
   },

   async getProcessed({commit}){
    const querySnapshot = await getDocs(collection(db,"Orders"));
    commit("getProccessed",querySnapshot)
   },
   async changeToProccessed({commit},payload){
    commit('changedToProceessed',payload)
   },
   async getDelivery({commit}){
    try {
      const querySnapshot =  collection(db,"Orders")
      commit("getDelivery",payload)
    } catch (error) {
      console.log(error)
    }
   },
   async OnsitePickUp({commit}){
    try {
      const  querySnapshot = collection(db,"Orders")
      commit("OnsitePickUp",querySnapshot)
    } catch (error) {
      console.log(error)
    }
   },
   ProcessPayment({commit},payload){
     commit("ProcessPayment",payload)
   },
   async setShipping({commit},payload){
      commit('setShipping',payload)
   },
   async getAllOrders({commit}){
    try {
      const querySnapshot = await getDocs(collection(db,"Orders"));
      commit("getAllOrders",querySnapshot)
    } catch (error) {
      console.log(error)
    }
   },
   async getPending({commit}){
    try {
      const querySnapshot = await getDocs(collection(db,"Orders"))
      commit('getPending',querySnapshot)
    } catch (error) {
      console.log(error)
    }
    
   },
    async processed({commit}){
      try {
        const querySnapshot = await getDocs(collection(db,"Orders"))
        commit("processed",querySnapshot)
      } catch (error) {
        console.log(error)
      }
    }
  }
})


//changing pending to allOrders and work with pending diffrently



///work with the quantity
///go to orders and go through it and find pending equal to true




//getPrice


//payload should carry product cart
//2.email
//3.amount
//4.delivery
//5.pending false



//get pending for admin page
// get processed
//function to change pending to processed
//getTobeDelivered
//getnot to be delivered