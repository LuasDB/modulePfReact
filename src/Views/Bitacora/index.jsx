import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import TablaRecepcion from "../../Components/TablaRecepcion";
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Label, Table,Form,Row,Col, FormGroup,Input } from "reactstrap";
import Swal from "sweetalert2";
import { server } from './../../db/servidor.js'
import { orderByProperty,fechaCorta } from './../../functions/formats.js'
import { FaFilePdf } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";


export function Bitacora(){

    const [data,setData] = useState()
    const [isVisible,setIsVisible] = useState(true)
    const [year,setYear] = useState(new Date().getFullYear())
    const [error,setError] = useState(null)
    const [isFetched, setIsFetched] = useState(false);

    const navigator = useNavigate()

    const fetchData = async(year)=>{
        try {
            const response = await fetch(`${server}api/v1/services/all-services/${year}`)
            const data = await response.json()
            
            if(data.success){
                console.log('Informes', data.data)
               setData(orderByProperty(data.data,'num_informe'))
            }else{
                Swal.fire('Algo Salio Mal, vuelva a intentarlo en un momento','','error')
            }
        } catch (error) {
            setError(error)
        }
    }
    const handleSearchYear = ()=>{
        fetchData(year)
    }
    const handleUpdate = ()=>{
        navigator('/laboratorio/pruebas-fuga/subir-informes')
    }

    useEffect(()=>{    

        if (!isFetched) {
            fetchData();
        }


    },[isFetched])

    return(
        <>      
            <Card className='m-2 rounded-xl shadow mt-4 mb-2' >
            <CardHeader className='flex justify-between border-0'>
                <CardTitle className="text-yellow-600">Bitacora de Pruebas de fuga</CardTitle>
                <Button onClick={handleUpdate}>Subir archivos</Button>
                 
            </CardHeader>
            <CardBody >
                <Row>
                    <Col md={6}>
                        <FormGroup>
                            <Label>Ingresa el año de la busqueda</Label>
                            <Input type="number" 
                            onChange={(e)=>setYear(e.target.value)} 
                            value={year}
                            />
                        </FormGroup>
                    </Col>
                    <Col md={3}>
                        <FormGroup>
                            <Button type="button" onClick={handleSearchYear}> Buscar </Button>
                        </FormGroup>
                    </Col>

                </Row>
                { isVisible && (
                    <Table className="table-responsive w-100 text-left text-xs " >
                    <thead >
                        <tr>
                        <th className="text-center   border-b">Informe</th>
                        <th className="text-center   border-b ">OS</th>
                        <th className="text-center   border-b">Razon Social</th>
                        <th className="text-center   border-b">Isótopo</th>
                        <th className="text-center   border-b">Serie</th>
                        <th className="text-center   border-b">Fecha de Frotis</th>
                        </tr>
                    </thead>
                    <tbody className="text-center"
                    >
                    
                    {data?.map((item,index)=>(
                        <tr key={index}>
                            <td>{item.num_informe}</td>                        
                            <td className="w-1/6">{item.os}</td>                        
                            <td className="w-1/4">{item.empresa}</td>                        
                            <td>{item.isotopo}</td>                        
                            <td>{item.num_serie}</td>                        
                            <td>{fechaCorta(item.fecha_frotis)}</td> 
                            {item.isPdf ? (
                                <td>
                                <a href={`${server}uploads/pf/${item.ano}/${item.nombre_pdf}`} target="_blank" rel="noopener noreferrer" className="text-orange-600 text-lg">
                                <FaFilePdf />
                                </a>
                            </td> 
                            ) : ( <td className="text-red-600">
                                sin PDF
                            </td> )}
                            <td>
                                <Link to={`/laboratorio/pruebas-fuga/editar-informes/${item.ano}/${item.num_informe}`}>
                                    <FaEdit className="text-lg text-blue-600 cursor-pointer"/>
                                </Link>
                            </td>                        

                                                
                        </tr>
                    ))}
                        
                    </tbody>

                    </Table>
                )}
                

                
            </CardBody>
            
            </Card>
        </>
        
    )

}

