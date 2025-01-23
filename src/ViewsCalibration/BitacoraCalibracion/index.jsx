import  { useState, useEffect } from 'react'
import CenteredSpinner from '../../Components/CenteredSpinner'
import TablaBitacora from '../../Components/Calibrations/TablaBitacora'
import Swal from 'sweetalert2';
import axios from 'axios';
import { server } from './../../db/servidor'
import { sortByStatus } from './../../functions/orderArrays'
import { fechaCorta } from './../../functions/formats'


export default function BitacoraCalibracion() {

    const [selectedYear,setSelectedYear] = useState()
    const [dataToDb,setDataToDb] = useState();
    const [loading,setLoading] = useState(false)
    const handleUpdateTable = (year)=>{
        setSelectedYear(year)
    }
    const getFetch = async (year) => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${server}api/v1/calibrations/${year}`);
            const orderArray = sortByStatus(data.data);
            console.log(orderArray);

            const newData = orderArray.map(item => {
                return {
                    id: item._id,
                    data: [
                        item.cliente,
                        item.marca,
                        item.modelo,
                        item.serie,
                        fechaCorta(item.fechaIngreso),
                        `${item.datosServicio ? fechaCorta(item.datosServicio.fechaRegistro) : 'Pendiente'}`,
                        `${item.datosServicio ? fechaCorta(item.fechaObjCal) : 'Pendiente'}`,
                        item.status
                    ],
                    content: item
                };
            });
            setDataToDb(newData);
        } catch (error) {
            Swal.fire('Algo salio mal', `No se pudo concretar la consulta. Error:${error.message}`);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        const now = new Date().getFullYear();
        setSelectedYear(now);
        getFetch(now);
    }, []);

    useEffect(() => {
        if (selectedYear) {
            getFetch(selectedYear);
        }
    }, [selectedYear]);
        


    return (
        <>
        {loading && (<CenteredSpinner />)}
         {!loading && (<>
    
        <div className='flex flex-col basis-4 scroll-y' > 
            <TablaBitacora 
            pathNew={'/laboratorio/calibraciones/forms/arribo/new'} 
            title={`Bitacora ${selectedYear}`} 
            selectedYear={selectedYear}
            data={dataToDb}
            encabezados={['Cliente','Marca','Modelo','Serie','Fecha arribo','Fecha O.S.','Fecha Objetivo','Status']}
            handleUpdateTable={handleUpdateTable}
            columnas={8}
            />
    

        </div>
    </>)}
            
        </>
   
        
    )
}