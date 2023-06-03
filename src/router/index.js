import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SignUp from '../views/SignUp'
import UploadForm from '../views/UploadForm'
import Cart from '../components/Cart'
import AdminDashboard from '../views/Admin/AdminDashboard.vue'
import AdminOrders from '../views/Admin/AdminOrders'
import Shipping from '../views/Shipping'
import Payment from '../views/Payment'
import Login from '../views/Login'
import NotFound from '../components/NotFound'
import Products from '../views/Admin/Products'
import {app as app} from '../../firebase'
import { collection, query, where,getDocs ,getFirestore} from "firebase/firestore";
let Authenticated = false;
const db = getFirestore(app);
Vue.use(VueRouter)
//import {key as key} from '../../key'
import jwt_decode from "jwt-decode";


async function Admin(){
   let Token = localStorage.getItem('signinToken')
   if(Token){
      let email = jwt_decode(Token).email
       const querySnapshot = await getDocs(collection(db,"users"));
       querySnapshot.forEach((doc)=>{
         if(doc.data().email === email){
            if(doc.data().Admin){
                Authenticated = true
            }
         }
       })
   }
   return Authenticated
}

async function guardRoute(to,from,next){
   let test = await Admin()
   if(test){
    next()
   }else{
    next('/')
   }
}


function reloadPage(){
  window.location.reload()
}

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignUp
  },
  {
    path: '/description/:id',
    name: 'description',
    beforeEnter:guardRoute,
    component: () => import(/* webpackChunkName: "about" */ '../views/Description.vue')
  },
  {
    path: '/order/:id',
    name: 'orderdetail',
    beforeEnter:guardRoute,
    component: () => import(/* webpackChunkName: "OrderDetail" */ '../views/OrderDetail.vue')
  },
  {
    path:'/productedit/:id',
    name:'productedit',
    component: () => import(/* webpackChunkName: "productEdit" */ '../views/ProductEdit.vue')
  },
  {
    path:'/uploadform',
    name:'uploadform',
    beforeEnter:guardRoute,
    component:UploadForm
  },
  {
    path:'/Products',
    name:'Product',
    beforeEnter:guardRoute,
    component:Products
  },
  {
    path:'/cart',
    name:'cart',
   // beforeEnter:reloadPage,
    component:Cart
  },
  {
    path:'/admin',
    beforeEnter:guardRoute,
    component:AdminDashboard,
    children:[
      {
        name:'adminOrders',
        path:'',
        component:AdminOrders
      }
    ]
  },
  {
    path:'/adminOrders',
    name:'AdminOrders',
    beforeEnter:guardRoute,
    component:AdminOrders
  },
  {
    path:'/shipping',
    name:'shipping',
    //beforeEnter:guardRoute, ///work on the check cart and check before alowing you go
    component:Shipping
  },
  {
    path:'/payment',
    name:'payment',
    component:Payment
  },
  {
   path:'/login',
   name:'login',
   component:Login
  },
  {
    path: '/:pathMatch(.*)*', 
    name: 'not-found',
    component: NotFound
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router





// function getEmail(){
//   let signinToken = localStorage.getItem('signinToken');
//      let DecryptedToken = jwt_decode(signinToken)
//       let email = DecryptedToken.email
//       return email
//  }







//  async function Admin(){
//   let email = this.getEmail()
//   const querySnapshot = await getDocs(collection(db, "users"));
//    querySnapshot.forEach((doc)=>{
//     if(doc.data().email===email){
//          if(doc.data().Admin)
//          {
//            Authenticated = true
//          }else{
//             Authenticated = false
//          }
     
//      }
//    })
//    console.log(Authenticated)
//   return Authenticated
// }
//check email and expand role











// async function guardRoutes(to,from,next){
//   let Authenticated = await Admin()
//   console.log(Authenticated)
//    //Check for login token
//   //  const Token = localStorage.getItem('signinToken');
//   //  if(Token){
//   //   let decrypt = jwt_decode(Token);
//   //   let userid = decrypt.user_id
//   //   console.log(typeof(userid))
//   //   console.log(typeof(key))
//   //  // check with saved userid
//   //    if(key===userid)
//   //    Authenticated = true;
//   //    if(Authenticated){
//   //     next()
//   //    }else{
//   //     next('/')
//   //    }
//   //  }else{
//   //     next('/')
//   //  }
// }
