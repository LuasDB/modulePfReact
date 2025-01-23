
import { useEffect, useState } from 'react';
import { useParams,useNavigate } from "react-router-dom"

import { Form, FormGroup, Label, Input, Button, Row, Col ,Card, CardHeader,CardBody} from 'reactstrap';
import CustomFormGroup from '../../utilitys/CustomFormGroup';

import CenteredSpinner from '../../CenteredSpinner';
import Swal from 'sweetalert2';
import axios from 'axios';
import { server } from '../../../db/servidor'

export default function FormNewEquipment(){
    const { id } = useParams()
    const navigator = useNavigate()


    const [formData, setFormData] = useState({
        cliente:'',
        marca: '',
        modelo: '',
        serie: '',
        tipo: '',
        marcaDetector: '',
        modeloDetector: '',
        serieDetector: '',
        tipoDetector: '',
        tipoRadiacion: '',
        unidadesEquipo:'',

        

    });

    const [formError, setFormError] = useState({});
    const [ isNew,setIsNew] = useState(true)
    const [loading,setLoading] = useState(false)
    const [year,setYear] = useState(new Date())
    const [isParamsConfirmated,setIsParamsCOnfirmated] = useState(false)
    

    useEffect(()=>{

        try{
            setLoading(true)
            if(id === 'new'){
                setIsNew(true)
            }else{
                setIsNew(false)
            }

        }finally{
            setLoading(false)
            setIsParamsCOnfirmated(true)

        }

       
    },[])

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
        ...formData,
        [name]: value,
        });

        if (value.trim()) {
        setFormError({
            ...formError,
            [name]: false,
        });
        }
    };

    const validateForm = () => {
        const errors = {};
        Object.keys(formData).forEach((key) => {
        if (!formData[key].trim()) {
            errors[key] = true;
        }
        });
        console.log('Faltantes:',errors)
        setFormError(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) {
            Swal.fire('Hay campos vacios','Por favor asegurate de llenar todos los campos','error')
            return;
        }

        const user = 'currentUser'; // Replace with actual user fetching logic
        const currentDate = new Date();
        const utcDate = new Date(Date.UTC(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate(),
          currentDate.getHours(),
          currentDate.getMinutes(),
          currentDate.getSeconds()
        ));
      
        
        console.log('Fecha de ingreso',utcDate.toISOString())

        const formulario = new FormData();
        Object.keys(formData).forEach((key) => {
        formulario.append(key, formData[key]);
        });
        formulario.append('registradoPor', user);
        formulario.append('fechaIngreso', utcDate.toISOString());
        formulario.append('isArrive',true)

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
                try {
                    const { data } = await axios.post(`${server}api/v1/calibrations/${utcDate.getFullYear()}`,formulario,{
                        headers: {
                          'Content-Type': 'application/json',
                        }
                    })
                if(data.success){
                    Swal.fire(
                        {
                          position: "center",
                          icon: "success",
                          title: "Se creo correctamente",
                          html:`${data.message}`,
                          showConfirmButton: true,
                          // timer: 1500
                        }
                        ).then(result=>{
                            if(result.isConfirmed){
                                navigator('/laboratorio/calibraciones/arribos')
                                console.log('Enviado exitosamente')
                            }
                        })
                }
                } catch (error) {
                    Swal.fire('Algo salio mal', `No se pudo subir la información:${error.message}`,'error')
                }
                
            }
        })
    };

    return (
        <>
        {loading && (<CenteredSpinner />)}
        {isParamsConfirmated && (
            <Card className='m-2 rounded-xl shadow mt-4 mb-2'>
            <CardHeader>
                <h3>{isNew ? 'Nuevo Equipo':'Editar Equipo'}</h3>
            </CardHeader>
            <CardBody>
            <Form onSubmit={handleSubmit} className="text-yellow-500">
                <Row>
                    <Col md={8}>
                        <CustomFormGroup 
                            label={"Cliente"}
                            type={"text"}
                            name={"cliente"}
                            value={formData.cliente.toUpperCase()}
                            onChange={handleChange}
                            error={formError.cliente}
                        />
                    </Col>
                </Row>
                <Col md={4}>
                    <CustomFormGroup
                    label="Tipo de monitor"
                    type="select"
                    name="tipo"
                    options={[{value:'Portatil',label:'Portatil'}, {value:'Area',label:'Area'},{value:'Alarma',label:'Alarma'}]}
                    value={formData.tipo}
                    onChange={handleChange}
                    error={formError.tipo}
                    />
                </Col>
                <Row>
                    <Col md={4}>
                        <CustomFormGroup
                        label="Marca"
                        type="text"
                        name="marca"
                        value={formData.marca}
                        onChange={handleChange}
                        error={formError.marca}
                        />
                    </Col>
                    <Col md={4}>
                        <CustomFormGroup
                        label="Modelo"
                        type="text"
                        name="modelo"
                        value={formData.modelo}
                        onChange={handleChange}
                        error={formError.modelo}
                        />
                    </Col>
                    <Col md={4}>
                        <CustomFormGroup
                        label="Serie"
                        type="text"
                        name="serie"
                        value={formData.serie}
                        onChange={handleChange}
                        error={formError.serie}
                        />
                    </Col>
                </Row>
                <Row>
                 
                <Col md={4}>
                    <CustomFormGroup
                    label="Tipo Detector"
                    type="select"
                    name="tipoDetector"
                    options={[{value:'Interno G.M.',label:'Interno G.M.'}, {value:'Externo G.M.',label:'Externo G.M.'}, {value:'Proporcional',label:'Proporcional'}, {value:'Estado Solido',label:'Estado Solido'}]}
                    value={formData.tipoDetector}
                    onChange={handleChange}
                    error={formError.tipoDetector}
                    />
                </Col>
               
                </Row>
                <Row>
                <Col md={4}>
                    <CustomFormGroup
                    label="Marca Detector"
                    type="text"
                    name="marcaDetector"
                    value={formData.marcaDetector}
                    onChange={handleChange}
                    error={formError.marcaDetector}
                    />
                </Col>
                <Col md={4}>
                    <CustomFormGroup
                    label="Modelo Detector"
                    type="text"
                    name="modeloDetector"
                    value={formData.modeloDetector}
                    onChange={handleChange}
                    error={formError.modeloDetector}
                    />
                </Col>
                <Col md={4}>
                    <CustomFormGroup
                    label="Serie Detector"
                    type="text"
                    name="serieDetector"
                    value={formData.serieDetector}
                    onChange={handleChange}
                    error={formError.serieDetector}
                    />
                </Col>
                </Row>
                <Row>
               
                <Col md={4}>
                    <CustomFormGroup
                    label="Tipo Radiación"
                    type="select"
                    name="tipoRadiacion"
                    options={[{value:'Gamma',label:'Gamma'},{value:'Neutrones',label:'Neutrones'}]}
                    value={formData.tipoRadiacion}
                    onChange={handleChange}
                    error={formError.tipoRadiacion}
                    />
                </Col>
                <Col md={4}>
                    <CustomFormGroup
                    label="Unidades del equipo"
                    type="select"
                    name="unidadesEquipo"
                    options={[{value:'mR/h',label:'mR/h'},{value:'µR/h',label:'µR/h'},{value:'mrem/h',label:'mrem/h'},{value:'µSv/h',label:'µSv/h'},{value:'mSv/h',label:'mSv/h'},{value:'CPM',label:'CPM'},{value:'CPS',label:'CPS'},{value:'mR',label:'mR'},{value:'µSv',label:'µSv'}]}
                    value={formData.unidadesEquipo}
                    onChange={handleChange}
                    error={formError.unidadesEquipo}
                    />
                </Col>
                </Row>
                <Row>
               
                </Row>
    
                <Button type="submit">Enviar</Button>
            </Form>
    
            </CardBody>
    
        </Card>
        )}
        </>
      
   

    );
}

