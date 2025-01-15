import { useState } from 'react'
import { Card, Row,Col, CardTitle, FormGroup, Label, Input, Table, Button} from 'reactstrap'
import { FaRegTrashAlt } from "react-icons/fa";
import PropTypes from 'prop-types';


import Footer from '../Footer'
import Swal from 'sweetalert2'




export default function Frotis({ frotisList,handleDeleteFrotis,setFrotisList }){


    const [newFrotis, setNewFrotis] = useState(false)
    /*PARA FORMULARIO DE UN SOLO FROTIS*/
    const [formDataFrotis,setFormDataFrotis] = useState({
        marca:'',isotopo:'',serie:'',actividad:'',unidades:'',metodo:'',fecha_frotis:''
    })
    const [errorDataFrotis,setErrorDataFrotis] = useState({})

   
    const handleChange = (e)=>{
        e.preventDefault()
        const {name, value} = e.target
        setFormDataFrotis({...formDataFrotis,[name]:value})
    }


    const handleNewFrotis = ()=>{
        setNewFrotis(true)
    }
    const handleAddFrotis = ()=>{
        //Creamos el FormData donde enviaremos la informacion

        //Creamos una variable para los errores
        const empty ={}
        const dataFrotis = {}


        for(let name in formDataFrotis ){
            if(!formDataFrotis[name]){
                empty[name]='empty'
            }else{
               dataFrotis[name]=formDataFrotis[name]

            }
        } 
        if(Object.keys(empty).length > 0){
            setErrorDataFrotis(empty)
            Swal.fire('Todos los campos deben ser llenados','','error')
        }else{
            dataFrotis['status']='Registro'
            setFrotisList([...frotisList,dataFrotis])
            setFormDataFrotis( {marca:'',isotopo:'',serie:'',actividad:'',unidades:'',metodo:'',fecha_frotis:''})
            setNewFrotis(false)
            setErrorDataFrotis({})
        }

    }
    


    return (
       
        <Card className='p-8'>
            <CardTitle>
                <h2>Listado de Frotis</h2>
            </CardTitle>
            <Col md={4}>
                <Button type='button' onClick={handleNewFrotis}>Agregar un Fortis</Button>
            </Col>
            <Table >
            <thead >
                <tr className='text-center'>
                    <th className='text-sm'>Fabricante/Marca</th>
                    <th className='text-sm'>Isótopo</th>
                    <th className='text-sm'>Serie</th>
                    <th className='text-sm'>Actividad Original</th>
                    <th className='text-sm'>Método</th>
                    <th className='text-sm'>Fecha de fortis</th>
                    <th className='text-sm'></th>
                </tr>
            </thead>
            <tbody>
                {frotisList?.map((froti,index)=>(
                    <tr key={index} className='text-center'>
                        <td className='text-sm'>{froti.marca}</td>
                        <td className='text-sm'>{froti.isotopo}</td>
                        <td className='text-sm'>{froti.serie}</td>
                        <td className='text-sm'>{froti.actividad} {froti.unidades}</td>
                        <td className='text-sm w-1/5' >{froti.metodo}</td>
                        <td className='text-sm'>{froti.fecha_frotis}</td>
                        <td  className='text-sm'><FaRegTrashAlt className='text-red-500 cursor-pointer' onClick={()=>handleDeleteFrotis(index)}/></td>
                    </tr>
                ))}
            </tbody>

            </Table>
            {newFrotis && (
            <Card className='p-8'>
            <Row >
                <Col md={10}>
                    <FormGroup className='flex flex-row gap-4 justify-center text-yellow-600'>
                        <Label >Fabricante</Label>
                        <Input type='text' name='marca' onChange={handleChange} className={`${errorDataFrotis.marca ? 'border-red-600': ''}`} value={formDataFrotis.marca}/>
                    </FormGroup>
                    <FormGroup className='flex flex-row gap-4 justify-center text-yellow-600'>
                        <Label >Isótopo</Label>
                        <Input type='text' name='isotopo' onChange={handleChange} className={`${errorDataFrotis.isotopo ? 'border-red-600': ''}`} value={formDataFrotis.isotopo}/>
                    </FormGroup>
                    <FormGroup className='flex flex-row gap-4 justify-center text-yellow-600'>
                        <Label >No. Serie</Label>
                        <Input type='text' name='serie' onChange={handleChange} className={`${errorDataFrotis.serie ? 'border-red-600': ''}`} value={formDataFrotis.serie}/>
                    </FormGroup>
                    <FormGroup className='flex flex-row gap-4 justify-center text-yellow-600'>
                        <Label >Actividad Original</Label>
                        <Input type='number' name='actividad' onChange={handleChange} className={`${errorDataFrotis.actividad ? 'border-red-600': ''}`} value={formDataFrotis.actividad}/>
                    </FormGroup>
                    <FormGroup className='flex flex-row gap-4 justify-center text-yellow-600'>
                        <Label >Unidades</Label>
                        <Input type='select' name='unidades' onChange={handleChange} className={`${errorDataFrotis.unidades ? 'border-red-600': ''}`} value={formDataFrotis.unidades}>
                            <option value=''>---Unidades---</option>
                            <option value='Bq'>Bq</option>
                            <option value='KBq'>KBq</option>
                            <option value='MBq'>MBq</option>
                            <option value='GBq'>GBq</option>
                            <option value='Ci'>Ci</option>
                            <option value='mCi'>mCi</option>
                            <option value='µCi'>µCi</option>
                            <option value='nCi'>nCi</option>
                        </Input>
                    </FormGroup>
                    <FormGroup className='flex flex-row gap-4 justify-center text-yellow-600'>
                        <Label >Metodo de Frotis </Label>
                        <Input type='select' name='metodo' onChange={handleChange} className={`${errorDataFrotis.metodo ? 'border-red-600': ''}`} value={formDataFrotis.metodo}>
                            <option value=''>---Metodo---</option>

                            <option value='Vía humeda sobre la fuente'>Vía humeda sobre la fuente</option>
                            <option value='Vía humeda sobre una superficie equivalente'>Vía humeda sobre una superficie equivalente</option>
                            
                        </Input>
                    </FormGroup>
                    <FormGroup className='flex flex-row gap-4 justify-center text-yellow-600'>
                        <Label >Fecha de toma de frotis</Label>
                        <Input type='date' name='fecha_frotis' onChange={handleChange} className={`${errorDataFrotis.fecha_frotis ? 'border-red-600': ''}`} value={formDataFrotis.fecha_frotis}/>
                    </FormGroup>
                    <Button type='button' onClick={handleAddFrotis}>Agregar</Button>
                </Col>
            </Row>

            </Card>
            
            )}
            

        </Card>
    )
}

//Definimos las proptypes
Frotis.propTypes ={
    frotisList:PropTypes.array,
    handleDeleteFrotis:PropTypes.func.isRequired

}
