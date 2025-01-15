import { Card,CardHeader,CardBody,Button, Form, FormGroup,Label,Input,Row,Col, CardFooter } from "reactstrap"
import { useParams } from "react-router-dom"

import { useFormsFunction } from "../../Hooks"

export function FormLicences(){
    
    const { id } = useParams()
    const location = '/laboratorio'

    const {isNew,formError,handleChange,handleSubmit,formData} = useFormsFunction({
        id,
        endpoint:'licencias',
        form:{
            num_lic:'',
            fecha_emision:'',
            fecha_vencimiento:'',
            razon_social:'',
            calle:'',
            colonia:'',
            ciudad:'',estado:'',cp:'',pais:'',
            telefono:'',correo:'',fax:'',
            status:'ACTIVO'
        },
        location
    })
 

    return (
        <Card className='m-2 rounded-xl shadow mt-4 mb-2'>
            <CardHeader>
                <h3>{isNew ? 'Nueva Licencia':'Editar Licencia'}</h3>
            </CardHeader>
            <CardBody>
                <Form className="text-yellow-500" > 
                    <Row>
                        <Col md={4}>
                            <FormGroup>
                                <Label for="num_lic" >No.Licencia</Label>
                                <Input type="text" name="num_lic" id="num_lic" placeholder="Ej. A00.200/1988/2020" onChange={handleChange} className={`${formError.num_lic ? 'border-red-600' : ''}`} value={formData.num_lic}/>
                            </FormGroup>
                        </Col>
                        <Col md={4}>
                            <FormGroup>
                                <Label for="fecha_emision">Fecha de emisión</Label>
                                <Input type="date" name="fecha_emision" id="fecha_emision" placeholder="Ej. A00.200/1988/2020" onChange={handleChange} className={`${formError.fecha_emision ? 'border-red-600' : ''}`} value={formData.fecha_emision}/>
                            </FormGroup>
                        </Col>
                        <Col md={4}>
                            <FormGroup>
                                <Label for="fecha_vencimiento">Fecha de vencimiento</Label>
                                <Input type="date" name="fecha_vencimiento" id="fecha_vencimiento" placeholder="Ej. A00.200/1988/2020" onChange={handleChange} className={`${formError.fecha_vencimiento ? 'border-red-600' : ''}`} value={formData.fecha_vencimiento}/>
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
                    {!isNew && (
                        <Row>
                        <Col md={12}>
                            <FormGroup>
                                <Label for="status" >Estatus</Label>
                                <Input type="select" name="status" id="status" onChange={handleChange} className={`${formError.status ? 'border-red-600' : ''}`} value={formData.status}>
                                    <option value={'ACTIVO'}>ACTIVO</option>
                                    <option value={'BAJA'}>BAJA</option>
                                </Input>
                            </FormGroup>
                        </Col>
                    </Row>
                    )}
                    
                </Form>
            </CardBody>
            <CardFooter>
                <Button onClick={handleSubmit}>Guardar</Button>
            </CardFooter>


        </Card>
    )
}

export function FormDetectors(){

    const { id } = useParams()
    const location = '/laboratorio'

    const {isNew,formError,handleChange,handleSubmit,formData} = useFormsFunction({
        id,
        endpoint:'detectores',
        form:{
            marca:'',
            modelo:'',
            serie:'',
            tipo:'',
            hv:'',
            status:'ACTIVO'
        },
        location
    })
 

    return (
        <Card className='m-2 rounded-xl shadow mt-4 mb-2'>
            <CardHeader>
                <h3>{isNew ? 'Nuevo Detector':'Editar Detector'}</h3>
            </CardHeader>
            <CardBody>
                <Form className="text-yellow-500" >
                    <Row>
                        <Col md={4}>
                            <FormGroup>
                                <Label for="marca" >Marca</Label>
                                <Input type="text" name="marca" id="marca" placeholder="Ej. Ludlum" onChange={handleChange} className={`${formError.marca ? 'border-red-600' : ''}`} value={formData.marca}/>
                            </FormGroup>
                        </Col>
                        <Col md={4}>
                            <FormGroup>
                                <Label for="modelo">Modelo</Label>
                                <Input type="text" name="modelo" id="modelo" placeholder="Ej. 44-10" onChange={handleChange} className={`${formError.modelo ? 'border-red-600' : ''}`} value={formData.modelo}/>
                            </FormGroup>
                        </Col>
                        <Col md={4}>
                            <FormGroup>
                                <Label for="serie">Serie</Label>
                                <Input type="text" name="serie" id="serie" placeholder="Ej. PR232569" onChange={handleChange} className={`${formError.serie ? 'border-red-600' : ''}`} value={formData.serie}/>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="tipo" >Tipo</Label>
                                <Input type="text" name="tipo" id="tipo" placeholder="Ej. Centelleo" onChange={handleChange} className={`${formError.tipo ? 'border-red-600' : ''}`} value={formData.tipo}/>
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="hv" >Alto voltaje [V]</Label>
                                <Input type="number" name="hv" id="hv" placeholder="Ejemplo: 900" onChange={handleChange} className={`${formError.hv ? 'border-red-600' : ''}`} value={formData.hv}/>
                            </FormGroup>
                        </Col>
                    </Row>
                    {!isNew && (
                        <Row>
                        <Col md={12}>
                            <FormGroup>
                                <Label for="status" >Estatus</Label>
                                <Input type="select" name="status" id="status" onChange={handleChange} className={`${formError.status ? 'border-red-600' : ''}`} value={formData.status}>
                                    <option value={'ACTIVO'}>ACTIVO</option>
                                    <option value={'BAJA'}>BAJA</option>
                                </Input>
                            </FormGroup>
                        </Col>
                    </Row>
                    )}
                   
                    
                </Form>
            </CardBody>
            <CardFooter>
                <Button onClick={handleSubmit}>Guardar</Button>
            </CardFooter>


        </Card>
    )
}

export function FormDevices(){

    const { id } = useParams()
    const location = '/laboratorio'

    const {isNew,formError,handleChange,handleSubmit,formData} = useFormsFunction({
        id,
        endpoint:'equipos',
        form:{
            marca:'',
            modelo:'',
            serie:'',
            tipo:'',
            resolución:'',
            status:'ACTIVO'
        },
        location
    })
 

    return (
        <Card className='m-2 rounded-xl shadow mt-4 mb-2'>
            <CardHeader>
                <h3>{isNew ? 'Nuevo Equipo':'Editar Equipo'}</h3>
            </CardHeader>
            <CardBody>
                <Form className="text-yellow-500" >
                    <Row>
                        <Col md={4}>
                            <FormGroup>
                                <Label for="marca" >Marca</Label>
                                <Input type="text" name="marca" id="marca" placeholder="Ej. S.E. INTERNATIONAL" onChange={handleChange} className={`${formError.marca ? 'border-red-600' : ''}`} value={formData.marca}/>
                            </FormGroup>
                        </Col>
                        <Col md={4}>
                            <FormGroup>
                                <Label for="modelo">Modelo</Label>
                                <Input type="text" name="modelo" id="modelo" placeholder="Ej. URSA II" onChange={handleChange} className={`${formError.modelo ? 'border-red-600' : ''}`} value={formData.modelo}/>
                            </FormGroup>
                        </Col>
                        <Col md={4}>
                            <FormGroup>
                                <Label for="serie">Serie</Label>
                                <Input type="text" name="serie" id="serie" placeholder="Ej. 2023565" onChange={handleChange} className={`${formError.serie ? 'border-red-600' : ''}`} value={formData.serie}/>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="tipo" >Tipo</Label>
                                <Input type="text" name="tipo" id="tipo" placeholder="Ej. MULTICANAL" onChange={handleChange} className={`${formError.tipo ? 'border-red-600' : ''}`} value={formData.tipo}/>
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="resolucion" >Resolución [V]</Label>
                                <Input type="number" name="resolucion" id="resolucion" placeholder="Ejemplo: 0.1" onChange={handleChange} className={`${formError.resolucion ? 'border-red-600' : ''}`} value={formData.resolucion}/>
                            </FormGroup>
                        </Col>
                    </Row>
                    {!isNew && (
                        <Row>
                        <Col md={12}>
                            <FormGroup>
                                <Label for="status" >Estatus</Label>
                                <Input type="select" name="status" id="status" onChange={handleChange} className={`${formError.status ? 'border-red-600' : ''}`} value={formData.status}>
                                    <option value={'ACTIVO'}>ACTIVO</option>
                                    <option value={'BAJA'}>BAJA</option>
                                </Input>
                            </FormGroup>
                        </Col>
                    </Row>
                    )}
                    
                </Form>
            </CardBody>
            <CardFooter>
                <Button onClick={handleSubmit}>Guardar</Button>
            </CardFooter>


        </Card>
    )
}

export function FormSources(){

    const { id } = useParams()
    const location = '/laboratorio'

    const {isNew,formError,handleChange,handleSubmit,formData} = useFormsFunction({
        id,
        endpoint:'fuentes',
        form:{
            actividad_original:'',
            energia:'',
            fecha_cal:'',
            isotopo:'',
            marca:'',
            rendimiento:'',
            serie:'',
            unidades:'',
            vida_media:'',
            status:'ACTIVO'
        },
        location
    })
 

    return (
        <Card className='m-2 rounded-xl shadow mt-4 mb-2'>
            <CardHeader>
                <h3>{isNew ? 'Nueva fuente':'Editar fuente'}</h3>
            </CardHeader>
            <CardBody>
                <Form className="text-yellow-500" >
                <Row>
                        <Col md={4}>
                            <FormGroup>
                                <Label for="isotopo" >Isótopo</Label>
                                <Input type="text" name="isotopo" id="isotopo" placeholder="Ej. S.E. INTERNATIONAL" onChange={handleChange} className={`${formError.isotopo ? 'border-red-600' : ''}`} value={formData.isotopo}/>
                            </FormGroup>
                        </Col>
                        <Col md={4}>
                            <FormGroup>
                                <Label for="marca">Marca</Label>
                                <Input type="text" name="marca" id="marca" placeholder="Ej. URSA II" onChange={handleChange} className={`${formError.marca ? 'border-red-600' : ''}`} value={formData.marca}/>
                            </FormGroup>
                        </Col>
                        <Col md={4}>
                            <FormGroup>
                                <Label for="serie">Serie</Label>
                                <Input type="text" name="serie" id="serie" placeholder="Ej. 2023565" onChange={handleChange} className={`${formError.serie ? 'border-red-600' : ''}`} value={formData.serie}/>
                            </FormGroup>
                        </Col>
                        
                    </Row>
                    <Row>
                        <Col md={4}>
                            <FormGroup>
                                <Label for="energia">Energía</Label>
                                <Input type="text" name="energia" id="energia" placeholder="Ej. 662 KeV" onChange={handleChange} className={`${formError.energia ? 'border-red-600' : ''}`} value={formData.energia}/>
                            </FormGroup>
                        </Col>
                        <Col md={4}>
                            <FormGroup>
                                <Label for="actividad_original">Actividad</Label>
                                <Input type="number" name="actividad_original" id="actividad_original" placeholder="Ej. 5000" onChange={handleChange} className={`${formError.actividad_original ? 'border-red-600' : ''}`} value={formData.actividad_original}/>
                            </FormGroup>
                        </Col>
                        <Col md={4}>
                            <FormGroup>
                                <Label for="unidades">Unidades</Label>
                                <Input type="select" name="unidades" id="unidades"  onChange={handleChange} className={`${formError.unidades ? 'border-red-600' : ''}`} value={formData.unidades} >
                                <option value='Bq'>Bq</option>
                                <option value='KBq'>KBq</option>
                                <option value='MBq'>MBq</option>
                                <option value='GBq'>GBq</option>
                                </Input>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="rendimiento" >Rendimiento</Label>
                                <Input type="number" name="rendimiento" id="rendimiento" placeholder="Ej. 2" onChange={handleChange} className={`${formError.rendimiento ? 'border-red-600' : ''}`} value={formData.rendimiento}/>
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label for="vida_media" >Vida media [años]</Label>
                                <Input type="number" name="vida_media" id="vida_media" placeholder="Ejemplo: 5.3" onChange={handleChange} className={`${formError.vida_media ? 'border-red-600' : ''}`} value={formData.vida_media}/>
                            </FormGroup>
                        </Col>
                    </Row>
                    {!isNew && (
                        <Row>
                        <Col md={12}>
                            <FormGroup>
                                <Label for="status" >Estatus</Label>
                                <Input type="select" name="status" id="status" onChange={handleChange} className={`${formError.status ? 'border-red-600' : ''}`} value={formData.status}>
                                    <option value={'ACTIVO'}>ACTIVO</option>
                                    <option value={'BAJA'}>BAJA</option>
                                </Input>
                            </FormGroup>
                        </Col>
                    </Row>
                    )}
                    
                </Form>
            </CardBody>
            <CardFooter>
                <Button onClick={handleSubmit}>Guardar</Button>
            </CardFooter>


        </Card>
    )
}

export function FormPoes(){

    const { id } = useParams()
    const location = '/laboratorio'

    const {isNew,formError,handleChange,handleSubmit,formData} = useFormsFunction({
        id,
        endpoint:'personalPf',
        form:{
            cargo:'',
            nivel:'',
            nombre:'',
            status:'ACTIVO'
        },
        location
    })
 

    return (
        <Card className='m-2 rounded-xl shadow mt-4 mb-2'>
            <CardHeader>
                <h3>{isNew ? 'Nuevo POE':'Editar POE'}</h3>
            </CardHeader>
            <CardBody>
                <Form className="text-yellow-500" >
                    <Row>
                        <Col md={3}>
                            <FormGroup>
                                <Label for="nivel">Titulo /nivel</Label>
                                <Input type="select" name="nivel" id="nivel" onChange={handleChange} className={`${formError.nivel ? 'border-red-600' : ''}`} value={formData.nivel}>
                                    <option value=''>Selecciona una opcion</option> 
                                    <option value='Ing.'>Ing.</option>
                                    <option value='Lic.'>Lic.</option>
                                    <option value='Tec.'>Tec.</option>
                                    <option value='Sr.'>Sr.</option>
                                    
                                </Input>
                            </FormGroup>
                        </Col>
                        <Col md={8}>
                            <FormGroup>
                                <Label for="nombre" >nombre</Label>
                                <Input type="text" name="nombre" id="nombre"  onChange={handleChange} className={`${formError.nombre ? 'border-red-600' : ''}`} value={formData.nombre}/>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={4}>
                            <FormGroup>
                                <Label for="cargo">Cargo</Label>
                                <Input type="select" name="cargo" id="cargo" placeholder="Ej. 662 KeV" onChange={handleChange} className={`${formError.cargo ? 'border-red-600' : ''}`} value={formData.cargo}>
                                    <option value=''>Selecciona una opcion</option> 
                                    
                                    <option value='P.O.E'>P.O.E</option>
                                    <option value='E.S.R.'>E.S.R.</option>
                                </Input>
                            </FormGroup>
                        </Col>
                      
                    </Row>
                    
                    {!isNew && (
                        <Row>
                        <Col md={12}>
                            <FormGroup>
                                <Label for="status" >Estatus</Label>
                                <Input type="select" name="status" id="status" onChange={handleChange} className={`${formError.status ? 'border-red-600' : ''}`} value={formData.status}>
                                    <option value={'ACTIVO'}>ACTIVO</option>
                                    <option value={'BAJA'}>BAJA</option>
                                </Input>
                            </FormGroup>
                        </Col>
                    </Row>
                    )}
                    
                </Form>
            </CardBody>
            <CardFooter>
                <Button onClick={handleSubmit}>Guardar</Button>
            </CardFooter>


        </Card>
    )
}


