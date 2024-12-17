import { useEffect, useState } from 'react'
import Tabla from '../../Components/Tabla'
import axios from 'axios';
import { server } from './../../db/servidor.js'



const useGetServices = () => {

    const [dataLab, setDataLab] = useState([]);
    const [isFetched, setIsFetched] = useState(false);

    const [services, setServices] = useState([]);



    useEffect(() => {
        
        const getApiRes = async () => {
            const year = new Date()
            try {
                const {data} = await axios.get(`${server}api/v1/services/${year.getFullYear()}`);
                

                if (data.success) {
                    setServices(data.data)
                    console.log('DATA TRAIDA',data.data)

                    if (!isFetched) {
                        const newArrayServices = data.data.map(item=>{


                            return {
                                id: item.id,
                                data: [item.os,item.razon_social,item.frotis.length],
                                content:item
                            }
                        })
                        setDataLab(newArrayServices)
                        setIsFetched(true);
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        if (!isFetched) {
            getApiRes();
        }
    }, [isFetched]);

    return { gestion:{dataLab}};
};
export default function Solicitudes(){

    const { gestion } = useGetServices()
    


    return (
    <>
        <div className='flex flex-col basis-4 scroll-y' > 

            <Tabla 
                className='w-100 text-center'
                path={'/forms/solicitudes/'} 
                encabezados={['O.S.','Razón Social','Cantidad de frotis']}
                data={gestion.dataLab}
                title={'Solicitudes'}
                collection={'services'}
            />
            
          
        </div>
    </>
        
    )

}