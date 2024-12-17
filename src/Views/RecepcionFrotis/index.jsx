import { useEffect, useState } from "react";
import TablaRecepcion from "../../Components/TablaRecepcion";
import { Button, Card, CardBody, CardFooter, CardHeader, Label, Table } from "reactstrap";
import Swal from "sweetalert2";
import { server } from './../../db/servidor.js'
import { fechaCorta } from './../../functions/formats.js'




export default function RecepcionFrotis(){

    const [frotis,setFrotis] = useState([])
    const [errorFetch , setErrorFetch] = useState(null)
    const [isFetched, setIsFetched] = useState(false);

    const handleReceived= (id)=>{
        const year = new Date().getFullYear()
        const froti = frotis.find(item=>item.id === id)

        const htmlMesage = `
            <ul>
            <li style="color:green;"><span style="color:blue;">Isotopo:</span> ${froti.isotopo}</li>
            <li style="color:green;"><span style="color:blue;">Serie:</span> ${froti.serie}</li>
            <li style="color:green;"><span style="color:blue;">Actividad :</span> ${froti.actividad} ${froti.unidades}</li>
            <li style="color:green;"><span style="color:blue;">Fecha Frotis:</span> ${fechaCorta(froti.fecha_frotis)}</li>
        </ul>`;

        Swal.fire({
            position: "center",
            icon: "question",
            title: "¿REVISASTE QUE LA INFORMACION SEA CORRECTA?",
            html:htmlMesage,
            showConfirmButton: true,
            showCancelButton:true,
            confirmButtonText:'Si,coincide',
            cancelButtonText:'No, espera',
            cancelButtonColor:'danger'
        }).then(async(result)=>{
            if(result.isConfirmed){
                console.log('Dame el registro enviado',`${server}api/v1/services/reception/frotis/update-one/${id}/${year}`)
                const res = await fetch(`${server}api/v1/services/reception/frotis/update-one/${id}/${year}`)
                const data = await res.json()
                if(data.success){
                    Swal.fire('REGISTRADO', '', 'success')
                        setFrotis(prev => prev.filter(item=>item.id != id))
                }

            }
            
            }
        )
    }

    useEffect(()=>{
        const fetchData = async()=>{
            try {
                const response = await fetch(`${server}api/v1/services/reception/frotis/2024`)
                const frotis = await response.json()
                
                if(frotis.success){
                    setFrotis(frotis.data)
                }
            } catch (error) {
                setErrorFetch(error)
            }

           
        }

        if (!isFetched) {
            fetchData();
        }


    },[isFetched])

    return(
        <Card className='m-2 rounded-xl shadow mt-4 mb-2' >
                <CardHeader className='flex justify-between border-0'>
                   
                    <Label className="text-black-400">Recepcion de frtois</Label>
                </CardHeader>
                <CardBody >

                    <table className=" table-responsive w-100 text-center text-sm " >
                        <thead >
                            <tr>
                            <th className="text-center py-2 px-4 border-b">OS</th>
                            <th className="text-center py-2 px-4 border-b">Isótopo</th>
                            <th className="text-center py-2 px-4 border-b">Serie</th>
                            <th className="text-center py-2 px-4 border-b">Actividad</th>
                            <th className="text-center py-2 px-4 border-b">Fecha de Frotis</th>
                            <th className="text-center py-2 px-4 border-b">Acciones</th>
                            
                            </tr>
                        </thead>
                        <tbody className="text-center"
                        >
                         {frotis.map((frotis, index) => frotis.status != 'Recibido' && (
                            <tr key={index}>
                            <td className="text-center py-2 px-4 border-b max-w-2/5 text-sm ">{frotis.os}</td>
                            <td className="text-center py-2 px-4 border-b max-w-2/5 text-sm ">{frotis.isotopo}</td>
                            <td className="text-center py-2 px-4 border-b max-w-2/5 text-sm ">{frotis.serie}</td>
                            <td className="text-center py-2 px-4 border-b max-w-2/5 text-sm ">{frotis.actividad} {frotis.unidades}</td>
                            <td className="text-center py-2 px-4 border-b max-w-2/5 text-sm ">{fechaCorta(frotis.fecha_frotis)}</td>
                            <td className="text-center py-2 px-4 border-b">
                                <button
                                onClick={() => handleReceived(frotis.id)}
                                className="bg-blue-500 text-white py-1 px-3 rounded"
                                >
                                Recibido
                                </button>
                            </td>
                            </tr>
                        ))}
                          
                        </tbody>

                    </table>

                   
                </CardBody>
                
            </Card>
    )
}