import { BrowserRouter, Route, Routes,Navigate } from "react-router-dom";

import CenteredSpinner from './../../Components/CenteredSpinner'
import AdminLayout from "./../AdminLayout";
import Login from './../Login'
import { AuthContext, AuthProvider } from "../../context/AuthContext";
import { useContext } from "react";




export default function App(){
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>      
          <Route path="/login" element={<Login />} />
          <Route path="*" element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>
            } />  
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
 

function RequireAuth({children}){
  const { user, loading } = useContext(AuthContext)

  if(loading){
    return (
      <CenteredSpinner />
    )
  }

  if(!user){
    return <Navigate to='/login' />
  }
  return children

}