import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Card,CardHeader,Form, FormGroup,Row,Col, Input,Label, CardFooter, Button} from "reactstrap"
import Swal from "sweetalert2"
import { AuthContext } from './../../context/AuthContext'
import axios from "axios"
import { server } from './../../db/servidor'


export default function FormNewCustomer(){

    const { id } = useParams()
    const { user } = useContext(AuthContext)
    const [isNew,setIsNew] = useState(false)
    const [formData, setFormData] = useState({
        rfc:'',nombre:'',contacto:'',correo:'',telefono:'',status:'Activo'
    })
    const [formError,setFormError] = useState({})

    useEffect(()=>{
        if(id === 'new'){
            setIsNew(true)
        }

    },[])

    const handleChange = (e)=>{
        e.preventDefault()
        const {name,value} = e.target
        setFormData({
            ...formData,
            [name]:value
        })

    }
    const handleSubmit = async()=>{
        const formulario = new FormData()
        const ano = new Date()

        let empty = {}
        for(let input in formData){
            if(!formData[input]){
                empty[input] = 'empty'
            }else{
                formulario.append(input,formData[input])
            }
        }
        if(Object.keys(empty).length > 0){
            setFormError(empty)
            Swal.fire('Todos los campos deben ser llenados','','warning')
            return
        }
        if(isNew){
            formulario.append('ano',ano.getFullYear())
            formulario.append('fechaAlta',ano.toISOString())
            formulario.append('usuarioCreador',user.user)
        }
        for(let pair of formulario.entries()){
            console.log(pair[0] + ':' + pair[1])
        }
        try {
            const { data } = await axios.post(`${server}api/v1/customers`,formulario)
            if(data.success){
            Swal.fire('Registro exitoso','Tu registro fue guardado correctamente','success')

            }

        } catch (error) {
            // Verificamos si el error tiene un response y si es un 409
            if (error.response && error.response.status === 409) {
                // Mostrar mensaje para cliente duplicado
                Swal.fire('Cliente duplicado', 'El cliente ya se encuentra registrado', 'warning');
            } else {
                // Otros errores generales
                Swal.fire('Algo salió mal', 'Hubo un error al procesar tu solicitud', 'error');
            }
        }

        
    }


    return(
        <Card className='m-2 rounded-xl shadow mt-4 mb-2'>
            <CardHeader>
                <h3>{isNew ? 'Nuevo Cliente':'Editar Cliente'}</h3>
            </CardHeader>
            <CardHeader>
                <Form className="text-yellow-500">
                    <Row>
                        <Col>
                            <FormGroup>
                                <Label>RFC</Label>
                                <Input type="text" name="rfc" value={formData.rfc} onChange={handleChange} className={`${formError.rfc ? 'border-red-600' : ''}`}/>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Label>Razon Social</Label>
                                <Input type="text" name="nombre" value={formData.nombre} onChange={handleChange} className={`${formError.nombre ? 'border-red-600' : ''}`}/>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <FormGroup>
                                <Label>Contacto</Label>
                                <Input type="text" name="contacto" value={formData.contacto} onChange={handleChange} className={`${formError.contacto ? 'border-red-600' : ''}`}/>
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label>Correo</Label>
                                <Input type="email" name="correo" value={formData.correo} onChange={handleChange} className={`${formError.correo ? 'border-red-600' : ''}`}/>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <FormGroup>
                                <Label>Teléfono</Label>
                                <Input type="text" name="telefono" value={formData.telefono} onChange={handleChange} className={`${formError.telefono ? 'border-red-600' : ''}`}/>
                            </FormGroup>
                        </Col>
                       
                    </Row>
                    {!isNew && (
                        <Row>
                        <Col md={6}>
                            <FormGroup>
                                <Label>Status</Label>
                                <Input type="select" name="telefono" value={formData.status} onChange={handleChange} className={`${formError.telefono ? 'border-red-600' : ''}`}>
                                    <option value={'Activo'}>Activo</option>
                                    <option value={'Baja'}>Baja</option>
                                </Input>
                            </FormGroup>
                        </Col>
                       
                    </Row>
                    )}
                </Form>
            </CardHeader>
            <CardFooter>
                <Button type="button" onClick={handleSubmit}>Guardar</Button>
            </CardFooter>

        </Card>
    )
}