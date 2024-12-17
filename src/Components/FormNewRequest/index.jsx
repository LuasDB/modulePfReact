import { useState,useEffect, useContext  } from "react";
import { useParams,useNavigate,Link} from "react-router-dom";
import { Card,CardHeader,CardBody,Button, Form, FormGroup,Label,Input,Row,Col,CardFooter } from "reactstrap"
import Frotis from "../Frotis";
import Swal from 'sweetalert2'
import { server } from './../../db/servidor'

import {AuthContext } from './../../context/AuthContext'


function generateUID(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let uid = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      uid += characters[randomIndex];
    }
    return uid;
  }


const useFormRequest = ({id,endpoint,form,location,frotis})=>{
   

    const navigator = useNavigate()
    const [isNew,setIsNew] = useState(false)
    const [formData,setFormData] = useState({
       
    })
    const [frotisList,setFrotisList] = useState([])
    const [customersList,setCustomersList] = useState([])
    const [formError,setFormError] = useState({})

    useEffect(()=>{
        const ano = new Date().getFullYear()

        const getResApi = async()=>{
           try{ 
            const resApi = await fetch(`${server}api/v1/services/${id}/${ano}`)
            const res = await resApi.json()
            console.log(res)
            if(res.success){

                setFrotisList(res.data.frotis)
                delete res.data.frotis
                setFormData(res.data)

            }}catch(error){
                console.log('[ERROR API]',error)
            }

        }
        const getCustomersApi = async()=>{
            try {
                console.log('SE ENTRA AL COSTUMERS')
                const resApi = await fetch(`${server}api/v1/customers`)
                const res = await resApi.json()
                console.log(res)
                if(res.success){
                    setCustomersList(res.data)
                }
    
            } catch (error) {
                console.log('[ERROR GET CUSTOMERS]',error)
            }
        }


        if(id === 'new'){
            setIsNew(true)
            setFormData(form)
            getCustomersApi()
        }else{
            getCustomersApi()

            getResApi()
            
        }
    },[])
   

    const handleChange = (e)=>{
        e.preventDefault()

        const { name, value } = e.target
        if(isNew){
            setFormData({
                ...formData,
                ['status']:'ACTIVO'
            })
            setFormError(
                {
                    ...formError,
                    ['status']:''
                }
            )
            
        }
        setFormData({
            ...formData,
            [name]:value
        })
        setFormError(
            {
                ...formError,
                [name]:''
            }
        )
    }
    
    const handleSubmit = ()=>{
        const formulario = new FormData();
        const ano = new Date()


        frotis.forEach((item,index) =>{
            console.log('---------------------------')
            for(let key in item){

                formulario.append(`frotis[${index}][${key}]`,item[key])
                
                console.log(`frotis[${index}][${key}]:${item[key]}`)
 
            }
            if(!item.id){
                formulario.append(`frotis[${index}][id]`,generateUID(15))
            }
            
        })
        console.log('A---------------------------')

        for (let [key, value] of formulario.entries()) {
            console.log(key, value);
          }
       

        
        let empty={}
        
        for(let input in formData){
            if(!formData[input]){
                empty[input]='empty'
            }else{
                formulario.append(input,formData[input])
            }
            //Si esta lleno lo metemos a un elemento FormData.append
        }
        if(Object.keys(empty).length > 0){
            setFormError(empty)
            Swal.fire('Todos los campos deben ser llenados','','warning')
            return
        }
        if(isNew){
            formulario.append('ano',ano.getFullYear())
            formulario.append('fecha_solicitud',ano.toLocaleDateString('en-CA'))
            
            
            Swal.fire({
                position: "center",
                icon: "question",
                title: "ALTA EN BASE DE DATOS",
                html:`¿Revisate que la información sea correcta?`,
                showConfirmButton: true,
                showCancelButton:true,
                confirmButtonText:'Si, claro',
                cancelButtonText:'No, espera'
            }).then(async(result)=>{
                if(result.isConfirmed){
                    const resApi = await fetch(`${server}api/v1/services`,
                        {
                            method:'POST',
                            body:formulario
                        })
                    const res = await resApi.json()
                    if(res.success){
                        Swal.fire(
                            {
                              position: "center",
                              icon: "success",
                              title: "Se creo correctamente",
                              html:`${res.message}`,
                              showConfirmButton: true,
                              // timer: 1500
                            }
                            ).then(result=>{
                                if(result.isConfirmed){
                                    // navigator(location)
                                }
                            })
                    }
                }
            })            
        }else{
            console.log('B---------------------------')

        for (let [key, value] of formulario.entries()) {
            console.log(key, value);
          }
            
            Swal.fire({
                position: "center",
                icon: "question",
                title: "ALTA EN BASE DE DATOS",
                html:`¿Revisate que la información sea correcta?`,
                showConfirmButton: true,
                showCancelButton:true,
                confirmButtonText:'Si, claro',
                cancelButtonText:'No, espera',
                cancelButtonColor:'danger'
            }).then(async(result)=>{
                if(result.isConfirmed){
                    

                    const resApi = await fetch(`${server}api/v1/services/${id}/${ano.getFullYear()}`,
                        {
                            method:'PATCH',
                            body:formulario
                        })
                    const res = await resApi.json()
                    if(res.success){
                        Swal.fire(
                            {
                              position: "center",
                              icon: "success",
                              title: "Se creo correctamente",
                              html:`${res.message}`,
                              showConfirmButton: true,
                              // timer: 1500
                            }
                            ).then(result=>{
                                if(result.isConfirmed){
                                    navigator(location)
                                }
                            })
                    }
                }
            })
        }
    }

    return {isNew,formError,handleChange,handleSubmit,formData,frotisListApi:frotisList,customersList}
}


export function FormNewRequest(){
    const { user } = useContext(AuthContext)

      //Pära la lista de frotis
      const [frotisList,setFrotisList] = useState([])
      const handleDeleteFrotis = (index)=>{
          setFrotisList((prev) => {
          const newItems = [...prev]
          newItems.splice(index,1)
          return newItems
       })
       }

    const { id } = useParams()
    const { isNew,formError,handleChange,handleSubmit,formData,frotisListApi,customersList} = useFormRequest({
        id,
        endpoint:'servicios',
        form:{
            os:'',
            razon_social:'',  
            calle:'',
            colonia:'',
            ciudad:'',estado:'',cp:'',pais:'',
            telefono:'',correo:'',fax:'',licencia:'',fecha_vencimiento:'',
            cliente:'',
            status:'ACTIVO',
            creador:user.user || 'No se guardo'
        },
        location,
        frotis:frotisList
    })

    useEffect(()=>{
        if(id !== 'new'){
            console.log('ASI SE RECIBE FROTIS:')
            console.log(frotisListApi)
            setFrotisList(frotisListApi)
        }
    },[frotisListApi])

   

    return (
        <Card className='m-2 rounded-xl shadow mt-4 mb-2'>
            <CardHeader>
                <h3>{isNew ? 'Nueva Solicitud':'Editar Solicitud'}</h3>
            </CardHeader>
            <CardBody>
                <Form className="text-yellow-500" > 
                {isNew && (<Row>
                    <Col md={8}></Col>
                    <Col md={4}>
                    <Link to={'/forms/clientes/new'}>
                        <Button type="button" >Agregar Nuevo cliente</Button>
                    </Link>
                    </Col>
                </Row>)}
                    <Row>
                        <Col md={12}>
                            <FormGroup>
                                <Label for="cliente" >Cliente</Label>
                                <Input type="select" name="cliente" id="cliente"  onChange={handleChange} className={`${formError.cliente ? 'border-red-600' : ''}`} value={formData.cliente}>
                                    <option value=''>--Selecciona cliente--</option>
                                    {customersList?.map((item,index)=>(
                                    <option 
                                        key={`${index}-cliente`}
                                        value={item.id}><span className="font-bold">{item.rfc}</span> {item.nombre}
                                    </option>
                                    ))}
                                </Input>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>              
                        <Col md={6}>
                            <FormGroup>
                                <Label for="os" >Orden de servicio</Label>
                                <Input type="text" name="os" id="os"  onChange={handleChange} className={`${formError.os ? 'border-red-600' : ''}`} value={formData.os}/>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                       <h2 className="text-black">Datos del permisionario</h2>
                        <Col md={12}>
                            <FormGroup>
                                <Label for="razon_social" >Razón Social</Label>
                                <Input type="text" name="razon_social" id="razon_social"  onChange={handleChange} className={`${formError.razon_social ? 'border-red-600' : ''}`} value={formData.razon_social}/>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <h2 className="text-black">Dirección</h2>

                        <Col md={6}>
                            <FormGroup>
                                <Label for="calle" >Calle</Label>
                                <Input type="text" name="calle" id="calle"  onChange={handleChange} className={`${formError.calle ? 'border-red-600' : ''}`} value={formData.calle}/>
                            </FormGroup>
                        </Col>
                        
                        <Col md={6}>
                            <FormGroup>
                                <Label for="colonia" >Colonia</Label>
                                <Input type="text" name="colonia" id="colonia"  onChange={handleChange} className={`${formError.colonia ? 'border-red-600' : ''}`} value={formData.colonia}/>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="ciudad" >Ciudad / Delegación / Municipio</Label>
                                <Input type="text" name="ciudad" id="ciudad"  onChange={handleChange} className={`${formError.ciudad ? 'border-red-600' : ''}`} value={formData.ciudad}/>
                            </FormGroup>
                        </Col>
                        
                        <Col md={6}>
                            <FormGroup>
                                <Label for="estado" >Estado</Label>
                                <Input type="text" name="estado" id="estado"  onChange={handleChange} className={`${formError.estado ? 'border-red-600' : ''}`} value={formData.estado}/>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="cp" >Código Postal</Label>
                                <Input type="number" name="cp" id="cp"  onChange={handleChange} className={`${formError.cp ? 'border-red-600' : ''}`} value={formData.cp}/>
                            </FormGroup>
                        </Col>
                        
                        <Col md={6}>
                            <FormGroup>
                                <Label for="pais" >Páis</Label>
                                <Input type="text" name="pais" id="pais"  onChange={handleChange} className={`${formError.pais ? 'border-red-600' : ''}`} value={formData.pais}/>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4}>
                            <FormGroup>
                                <Label for="telefono" >Teléfono</Label>
                                <Input type="number" name="telefono" id="telefono"  onChange={handleChange} className={`${formError.telefono ? 'border-red-600' : ''}`} value={formData.telefono}/>
                            </FormGroup>
                        </Col>
                        
                        <Col md={4}>
                            <FormGroup>
                                <Label for="correo" >Correo</Label>
                                <Input type="text" name="correo" id="correo"  onChange={handleChange} className={`${formError.correo ? 'border-red-600' : ''}`} value={formData.correo}/>
                            </FormGroup>
                        </Col>
                        <Col md={4}>
                            <FormGroup>
                                <Label for="fax" >Fax</Label>
                                <Input type="text" name="fax" id="fax"  onChange={handleChange} className={`${formError.fax ? 'border-red-600' : ''}`} value={formData.fax}/>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={8}>
                            <FormGroup>
                                <Label for="licencia" >No. de Licencia</Label>
                                <Input type="text" name="licencia" id="licencia"  onChange={handleChange} className={`${formError.licencia ? 'border-red-600' : ''}`} value={formData.licencia}/>
                            </FormGroup>
                        </Col>
                        
                        <Col md={4}>
                            <FormGroup>
                                <Label for="fecha_vencimiento" >Fecha de vencimiento</Label>
                                <Input type="date" name="fecha_vencimiento" id="fecha_vencimiento"  onChange={handleChange} className={`${formError.fecha_vencimiento ? 'border-red-600' : ''}`} value={formData.fecha_vencimiento}/>
                            </FormGroup>
                        </Col>
                       
                    </Row>
                    
                   <Frotis 
                   frotisList={frotisList}
                   handleDeleteFrotis={handleDeleteFrotis}
                   setFrotisList={setFrotisList}

                   />
                    
                </Form>
            </CardBody>
            <CardFooter>
                <Button onClick={handleSubmit}>Guardar</Button>
            </CardFooter>
        </Card>
       
    )
}