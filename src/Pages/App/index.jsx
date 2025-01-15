import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useContext } from "react";
import CenteredSpinner from './../../Components/CenteredSpinner';
import AdminLayout from './../AdminLayout';
import AdminLayoutCal from './../AdminLayoutCal'; 
import Home from './../Home'; 
import Login from './../Login';
import RestartPassword from './../RestartPassword';
import PasswordResetRequest from './../PasswordResetRequest';
import { AuthContext, AuthProvider } from "../../context/AuthContext";

export default function App(){
  const getRoutes = (routes) => {
    return routes.map((route, index) => {
      console.log(`${route.path}`)
        
        return (
        <Route path={`${route.path}`} element={route.component} key={index} />
    )})
}
  return (
    <div className="w-full h-full">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />      
            <Route path="/login" element={<Login />} />
            <Route path="/sol-password" element={<PasswordResetRequest/> }/> 
            <Route path="/reset-password" element={<RestartPassword />} />
            <Route path="/laboratorio/*" element={<RequireAuth><Home /></RequireAuth>} />
            <Route path="/laboratorio/pruebas-fuga/*" element={<RequireAuth><AdminLayout /></RequireAuth>} />
            <Route path="/laboratorio/calibraciones/*" element={<RequireAuth><AdminLayoutCal /></RequireAuth>} />
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