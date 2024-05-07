import { RouterProvider } from 'react-router-dom'
import './App.css'
import router from '../routes'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

function App() {
  axios.defaults.baseURL = import.meta.env.VITE_BASE_URL
  return (
    <>
      <ToastContainer />
      <RouterProvider router={router}/>
    </>
  )
}

export default App
