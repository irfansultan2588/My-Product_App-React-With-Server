import './App.css';
import Navbar from './Compoenets/Navbar';
import Profile from './Compoenets/Profile';
import Signup from './Compoenets/Signup';
import Login from './Compoenets/Login';
import Logout from './Compoenets/Logout';
import Products from './Compoenets/Products';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useContext } from 'react'
import { GlobalContext } from './Context';
import axios from 'axios';
import loddingimage from './assets/loading-1.webp'
import Createproducts from './Compoenets/Createproducts';
import UserProduct from './Compoenets/UserProduct';
import AddToCart from './Compoenets/AddToCart'
import CheckOut from './Compoenets/CheckOut';
import CheckoutSuccess from './Compoenets/CheckoutSuccess';
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js"
import MyOrder from './Compoenets/MyOrder';






function App() {

  let { state, dispatch } = useContext(GlobalContext);


  useEffect(() => {


    const getProfile = async () => {

      try {
        let response = await axios({
          url: `${state.baseUrl}/profile`,
          method: "get",
          withCredentials: true
        })
        if (response.status === 200) {
          console.log("response: ", response.data);
          dispatch({
            type: "USER_LOGIN",
            payload: response.data
          })

        } else {
          dispatch({ type: "USER_LOGOUT" })
        }

      } catch (e) {
        console.log("Error in api", e);
        dispatch({
          type: "USER_LOGOUT"
        })
      }
    }
    getProfile();
  }, [])


  const stripePromise = loadStripe('pk_test_51LyAG3FNaO2pyCZjBH1FWkvQqTWRnE5fJ2hh38e4dxiVUC85DeFGtdLmXdatrZq2XpDTLyPpdq0HFGX8lq8U63Uf00supvSUGV');



  return (

    <Elements stripe={stripePromise}>

      <Router>


        <Navbar />



        <Routes>

          {(state.isLogin === true) ?

            <>


              <Route path="/Profile" element={<Profile />} />
              <Route path="/logout" element={<UserProduct />} />
              <Route path="/Createproducts" element={<Createproducts />} />
              <Route path="/Product" element={<Products />} />
              <Route path="/" element={<UserProduct />} />
              <Route path="/login" element={<UserProduct />} />
              <Route path="/AddToCart" element={<AddToCart />} />
              <Route path="/CheckOut" element={<CheckOut />} />
              <Route path="/checkout-success" element={<CheckoutSuccess />} />
              <Route path="/MyOrder" element={<MyOrder />} />

            </>
            :
            null
          }

          {(state.isLogin === false) ?

            <>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/" element={<UserProduct />} />
              <Route path="/AddToCart" element={<AddToCart />} />

            </>
            :
            null
          }


          {(state.isLogin === null) ?

            <>
              <Route path="*" element={
                <div className='image_container234'>
                  <img src={loddingimage} alt='loding_image' />
                </div>
              } />
            </>
            :
            null
          }
        </Routes>
      </Router >

    </Elements>

  );
}

export default App;