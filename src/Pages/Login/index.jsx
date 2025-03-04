import  { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './../../context/AuthContext';
import { Container, Card,CardTitle, CardImg,FormGroup,
  Label,
  Input,
  Button} from 'reactstrap'

export default function Login(){
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()



  const handleSubmit = async(e)=>{
    console.log('BTN INICIO')
      e.preventDefault()
      await login(email,password)
      navigate('/laboratorio')

  }
  return (
      <Container className='flex items-center justify-center min-h-screen '>
          <Card className='w-80 p-10 flex shadow-lg'>
              <CardTitle className="mt-auto self-center  p-4 rounded">
              <CardImg
                  alt="Card image cap"
                  src="https://siradiacion.com.mx/wp-content/uploads/2022/04/Logo-SIRSA-2.svg"
                  
                  top
                  width="100%"
                  />

                  
              </CardTitle>
              <form onSubmit={handleSubmit} className="flex flex-col">
                  <FormGroup>
                      <Label>Correo</Label>
                      <Input 
                          type="text" 
                          value={email}
                          onChange={(e)=> setEmail(e.target.value)}
                          placeholder="Correo"
                          required
                          />
                  </FormGroup>
                  <FormGroup>
                      <Label>Contraseña</Label>
                      <Input 
                          type="password" 
                          value={password}
                          onChange={(e)=> setPassword(e.target.value)}
                          placeholder="Correo"
                          required
                          />
                  </FormGroup>
                  <Button className="mt-auto self-center">Ingresar</Button>
                  <a href="/sol-password" className='w-full text-center mb-4 text-sm text-gray-400 pt-6'>Olvide mi contraseña</a>



              </form>
          </Card>
      </Container>

  )
}