import { BrowserRouter, Route, Routes,Navigate } from "react-router-dom";

import CenteredSpinner from './../../Components/CenteredSpinner'
import AdminLayout from "./../AdminLayout";
import Login from './../Login'
import RestartPassword from './../RestartPassword'
import PasswordResetRequest from './../PasswordResetRequest'
import { AuthContext, AuthProvider } from "../../context/AuthContext";
import { useContext } from "react";
import { routes } from './../../routes.jsx'


export default function App(){
  const getRoutes = (routes) => {
    return routes.map((route, index) => {
      console.log(`${route.path}`)
        
        return (
        <Route path={`${route.path}`} element={route.component} key={index} exact />
    )})
}
  return (
    <div className="w-full h-full">
    <AuthProvider>
      <BrowserRouter>
        <Routes>      
          <Route path="/login" element={<Login />} />
          <Route path="/sol-password" element={<PasswordResetRequest/> }/> 
          <Route path="/reset-password" element={<RestartPassword />} />
          <Route path="/" 
            element={
            <RequireAuth>
              <AdminLayout />
            </RequireAuth>} >
            {getRoutes(routes)}
          </Route>
          
        </Routes>
      </BrowserRouter>
    </AuthProvider>

    </div>
    
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