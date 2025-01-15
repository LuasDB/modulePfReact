import { useEffect, useState } from 'react'
import Tabla from '../../Components/Tabla'
import './index.css'
import { server } from './../../db/servidor.js'



const useGetLab = () => {

    const [dataLab, setDataLab] = useState([]);
    const [isFetched, setIsFetched] = useState(false);

    const [dataLabLic, setDataLabLic] = useState([]);
    const [dataLabDet, setDataLabDet] = useState([]);
    const [dataLabEqu, setDataLabEqu] = useState([]);
    const [dataLabFue, setDataLabFue] = useState([]);
    const [dataLabPoe, setDataLabPoe] = useState([]);

    useEffect(() => {
        const getApiRes = async () => {
            try {
                const res = await fetch(`${server}api/v1/lab`);
                const data = await res.json();

                if (data.success) {
                    let obj = {};
                    data.data.forEach(item => {
                        obj[item.id] = item.lista;
                    });
                    setDataLab(obj);

                    if (!isFetched) {
                        //Licencias
                        const licencias = obj.licencias || []; // Asegúrate de que obj.licencias esté definido
                        const newLicArray = licencias.map(item => ({
                            id: item.id,
                            data: [item.num_lic, item.fecha_vencimiento, item.status],
                            content:item
                        }));
                        setDataLabLic(newLicArray);

                        //Detectores
                        const detectores = obj.detectores || []; // Asegúrate de que obj.licencias esté definido
                        const newDetArray = detectores.map(item => ({
                            id: item.id,
                            data: [item.marca, item.modelo,item.serie, item.status],
                            content:item
                        }));
                        setDataLabDet(newDetArray);

                        //Equipos
                        const equipos = obj.equipos || []; // Asegúrate de que obj.licencias esté definido
                        const newEquArray = equipos.map(item => ({
                            id: item.id,
                            data: [item.marca, item.modelo,item.serie, item.status],
                            content:item
                        }));
                        setDataLabEqu(newEquArray);

                         //Fuentes
                         const fuentes = obj.fuentes || []; // Asegúrate de que obj.licencias esté definido
                         const newFueArray = fuentes.map(item => ({
                             id: item.id,
                             data: [item.isotopo, item.marca,item.serie, item.status],
                             content:item
                         }));
                         setDataLabFue(newFueArray);

                         //POES
                         const personalPf = obj.personalPf || []; // Asegúrate de que obj.licencias esté definido
                         const newPoeArray = personalPf.map(item => ({
                             id: item.id,
                             data: [`${item.nivel} ${item.nombre}`, item.cargo, item.status],
                             content:item
                         }));
                         setDataLabPoe(newPoeArray);



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

    return { dataLab,gestion:{dataLabLic, dataLabDet, dataLabEqu,dataLabFue,dataLabPoe}};
};


export default function Laboratorio(){

    const {gestion } = useGetLab()
    const path = '/forms/licence/'


    return (
    <>
        <div className='flex flex-col basis-4 scroll-y' > 

            <Tabla 
                className='w-100'
                path={path} 
                encabezados={['Licencia','Vencimiento','Estatus']}
                data={gestion.dataLabLic}
                title={'Licencias'}
                collection={'licencias'}
            />
            <Tabla 
                path={'/forms/detectors/'} 
                encabezados={['Marca','Modelo','Serie','Estatus']}
                data={gestion.dataLabDet}
                title={'Detectores'}
            />
            <Tabla 
                path={'/forms/devices/'} 
                encabezados={['Marca','Modelo','Serie','Estatus']}
                data={gestion.dataLabEqu}
                title={'Equipos'}
            />
            <Tabla 
                path={'/forms/sources/'} 
                encabezados={['Isótopo','Marca','Serie','Estatus']}
                data={gestion.dataLabFue}
                title={'Fuentes'}
            />
             <Tabla 
                path={'/forms/poes/'} 
                encabezados={['Nombre','Cargo','Estatus']}
                data={gestion.dataLabPoe}
                title={'POES'}
            />
          
        </div>
    </>
        
    )

}