import {React,useContext} from 'react'
import MenuBar from './components/MenuBar/MenuBar'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home'
import ExploreFood  from './pages/Explore/ExploreFood'
import  Contact  from './pages/Contact/Contact'
import FoodDetails from './pages/FoodDetails/FoodDetails'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Login from './components/Login/Login'
import Register from './components/Register/Register'

import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MyOrders from './MyOrders/MyOrders'
import { StoreContext } from './context/StoreContext'

const App = () => {

   const { token } = useContext(StoreContext);

  return (
    <div>
      <MenuBar />
      <ToastContainer/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/explore' element={<ExploreFood />} />
        <Route path='/food/:id' element={<FoodDetails/>}/>
         <Route path='/cart' element={<Cart/>}/>
         <Route path='/order' element={<PlaceOrder/>}/>
         <Route path='/login' element={<Login/>}/>
         <Route path='/register' element={<Register/>}/>
          <Route path="/myorders" element={token ? <MyOrders /> : <Login />} />
      </Routes>
      
    </div>
  )
}

export default App
