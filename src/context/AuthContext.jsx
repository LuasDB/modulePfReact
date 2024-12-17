import { createContext,useState,useEffect } from 'react'
import  {jwtDecode}  from "jwt-decode";

import axios from 'axios'

const AuthContext = createContext()

const AuthProvider = ({children})=>{

    const [user,setUser] = useState(null)
    const [loading,setLoading] = useState(false)
    

    const login = async (email, password)=>{
       console.log('FUNCION LOGIN')

        
        try {
            setLoading(true)
            const {data} =await axios.post(`http://localhost:3000/api/v1/auth/login`,{email, password})
            console.log('[RESPUESTA ENDPOINT]',data)
            if(data.success){
                const token = data.data.token
                localStorage.setItem('token',token)
                const decoded = jwtDecode(token);
                console.log('TOKEN DECODIFICADO',decoded);
                setUser(decoded);
            }else{  
                setUser(null);
                localStorage.removeItem('token')
                alert('Error no autenticado')
            }
          
           
            
        } catch (error) {
            console.error('Login failed', error);
        }finally{
            setLoading(false)
        }
    }

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        
    };

    useEffect(()=>{
        setLoading(true)
        const token = localStorage.getItem('token')

        if(token){     
            const decoded = jwtDecode(token)
            console.log('Funciona"!',decoded)
            setUser(decoded)         
        }else{
            setUser(null)
        }
        setLoading(false)

       
    },[])


    return(
        <AuthContext.Provider value={{ user, login, logout,loading }}>
            {children}
        </AuthContext.Provider>
    )


}
export { AuthContext, AuthProvider };

