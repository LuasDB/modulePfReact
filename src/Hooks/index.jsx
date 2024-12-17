import { useNavigate, useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import { server } from './../db/servidor'

const useFormsFunction = ({id,endpoint,form,location})=>{

    const navigator = useNavigate()
    const [isNew,setIsNew] = useState(false)
    const [formData,setFormData] = useState({
       
    })
    const [formError,setFormError] = useState({})

    useEffect(()=>{

        const getResApi = async()=>{
            const resApi = await fetch(`${server}api/v1/lab/${endpoint}/${id}`)
            const res = await resApi.json()

            if(res.success){
                setFormData(res.data)
            }

        }


        if(id === 'new'){
            setIsNew(true)
            setFormData(form)
        }else{
            getResApi()

        }
    },[])
    useEffect(()=>{

        console.log('DATA:',formData)
        console.log('ERROR',formError)

    },[formData])

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
        let empty={}
        
        for(let input in formData){
            if(!formData[input]){
                empty[input]='empty'
            }else{
                formulario.append(input,formData[input])
            }
            //Si esta lleno lo metemos a un elemento FormData.append
        }
        console.log('[EMPTY]:',empty)
        if(Object.keys(empty).length > 0){
            setFormError(empty)
            Swal.fire('Todos los campos deben ser llenados','','warning')
            return
        }
        if(isNew){
            
            formulario.append('data',JSON.stringify(formData))
            formulario.append('document',endpoint)
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
                    const resApi = await fetch(`${server}api/v1/lab`,
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
                                    navigator(location)
                                }
                            })
                    }
                }
            })
             


            
        }else{
            formulario.append('data',JSON.stringify(formData))
            formulario.append('document',endpoint)
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
                    const resApi = await fetch(`${server}api/v1/lab/${endpoint}`,
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

    return {isNew,formError,handleChange,handleSubmit,formData}
}

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


export  {useFormsFunction, useGetLab}