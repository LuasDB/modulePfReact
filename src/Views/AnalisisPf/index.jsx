import { useEffect, useState } from "react";
import TablaRecepcion from "../../Components/TablaRecepcion";
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Label, Table,Form,Row,Col, FormGroup,Input } from "reactstrap";
import Swal from "sweetalert2";
import { server } from './../../db/servidor.js'

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { saveAs } from 'file-saver';
import pdfTemplate from './../../assets/MachoteInforme.pdf';
import pdfTemplateData from './../../assets/MachoteHoja.pdf';

import {formatFecha} from './../../functions/formats'
import { useGetLab } from "../../Hooks";

const originalActivityBq = (actividad,unidades)=>{
    const unitConversions = {
        Bq: 1,
        KBq: 1000,
        MBq: 1000000,
        GBq: 1000000000,
        Ci: 37000000000,
        mCi: 37000000,
        μCi: 37000,
        nCi: 37
    };

    return parseFloat(actividad) * parseFloat(unitConversions[unidades])

}

const dateFormatShort=(dateString)=>{

    const date = new Date(dateString)
    // Obtener el día, mes y año del objeto Date
    const day = date.getDate();
    const month = date.getMonth() + 1; // Los meses van de 0 a 11
    const year = date.getFullYear();

// Añadir un cero al día y mes si son menores a 10
const formattedDay = day < 10 ? `0${day}` : day;
const formattedMonth = month < 10 ? `0${month}` : month;

// Formatear la fecha como 'DD-MM-YYYY'
return `${formattedDay}-${formattedMonth}-${year}`;

}


export default function AnalisisPf(){

    const [frotis,setFrotis] = useState([])
    const [errorFetch , setErrorFetch] = useState(null)
    const [isFetched, setIsFetched] = useState(false);
    const [isFormActive,setIsFormActive] = useState(false)
    const [elementsToDo,setElementsToDo] = useState({})
    const [isMultiChanel,setIsMultiChanel] = useState(null)
    //Manejo de los inputs creados dinamicamente
    const [inputValues, setInputValues] = useState({});
    // Maneja el cambio de los inputs
    const handleInputChange = (index, event) => {
        const { value } = event.target;
        setInputValues({
            ...inputValues,
            [index]: value,
        });
    };
    //Controlar el wheel
    const handleWheel = (e)=>{
        if (document.activeElement === e.target) {
            e.preventDefault();
          }
    }

    //Para verificar el formulario
    const [formData,setFormData]=useState({
        licencia:'',
        equipo:'',
        detector:'',
        fuente:'',
        personalRealiza:'',
        personalAutoriza:'',
        conteosFondo:'',
        conteosFuente:'',
        tiempoConteo:'',
        hv:'',
        ganancia:'',th:''
    })
    const [formError, setFormError] = useState({})

    const { dataLab } = useGetLab()

   

    const getInformationLab=(id,collection)=>{
        return dataLab[collection].find(item=>item.id === id)
    }

    const calculatePf = ({fuente,formData,conteosFrotis})=>{
        const unitConversions = {
            Bq: 1,
            KBq: 1000,
            MBq: 1000000,
            GBq: 1000000000,
            Ci: 37000000000,
            mCi: 37000000,
            μCi: 37000,
            nCi: 37
        };
        


        const originalActivityBq = parseFloat(fuente.actividad_original) * parseFloat(unitConversions[fuente.unidades])
        const currentDate = new Date()
        const timeElapsed = ((currentDate - new Date(fuente.fecha_cal))/(365*24*3600*1000)).toFixed(2)
        const halfLife = parseFloat(fuente.vida_media)
        const decayConstant = Math.log(2) / halfLife;
        const currentActivity =( originalActivityBq * Math.exp(-decayConstant * timeElapsed)).toFixed(0);

        const flux = 60 * currentActivity * parseFloat(fuente.rendimiento)
        let efficencyDetection = ((parseInt(formData.conteosFuente) - parseFloat(formData.conteosFondo)) / (parseFloat(formData.tiempoConteo) * flux) * 100).toFixed(2)
        // efficencyDetection=efficencyDetection / flux

        const countsBq = ((parseInt(formData.conteosFuente) - parseInt(formData.conteosFondo) ) / currentActivity).toFixed(0)

        const lld = ((4.66 * Math.sqrt(formData.conteosFondo) ) / countsBq).toFixed(0)
        return {
            conteosFondo:formData.conteosFondo,
            conteosFuente:formData.conteosFuente,
            conteosFrotis,
            originalActivityBq,
            currentDate,
            timeElapsed,
            halfLife,
            decayConstant,
            currentActivity,
            flux,
            efficencyDetection,
            countsBq,
            lld
        }
    }
    
    const generateInform = async ({certificado,calculos,element,dataService,num_informe,ano,nombre_pdf,conteosFrotis}) => {

           console.log('CERTIFICADO:',certificado)
           console.log('CALCULOS:',calculos)
           console.log('ELEMNTO:',element)
           console.log('service:',dataService)
        
            // Cargar el machote PDF desde una URL
            const pdfBytes = await fetch(pdfTemplate).then(res => res.arrayBuffer());
            
            // Cargar el PDF en pdf-lib
            const pdfDoc = await PDFDocument.load(pdfBytes);
            
            // Obtener la primera página del PDF
            const pages = pdfDoc.getPages();
            const firstPage = pages[0];''
        

            // Añadir texto a la primera página
            const { width, height } = firstPage.getSize();
            
            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
            const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
            const sizeStandar = 8
            let sizeData = 7
            
            const printLine =(text,x,y,font,fontmini)=>{
                let textW =0
                let sizeFont = sizeData
                textW = font.widthOfTextAtSize(text, sizeData);
                if(textW > 300){
                    sizeFont = sizeData - 1 - 1
                }else if(textW > 187  ){
                    sizeFont = sizeData--
                }else if(fontmini){

                    if(textW > 80 ){
                        sizeFont = sizeData - 3
                    }else if(textW > 142 ){
                        sizeFont = sizeData - 4
                    }
                    else{
                        sizeFont = sizeData--
                    }
                    
                }
                firstPage.drawText(text, {
                x,
                y: height - y,
                size: sizeFont,
                font: font,
                color: rgb(0, 0, 0),
                });

            }
            const parseDate=(fechaStr)=> {
                const [year, month, day] = fechaStr.split('-').map(Number);
                // El mes en el constructor Date es 0-indexed (enero es 0, diciembre es 11)
                return new Date(year, month - 1, day);
              }
            
            
            
            firstPage.drawText(`SIR${ano}-PF-${num_informe}`, {
            x: 350,
            y: height - 118,
            size: sizeStandar,
            font: fontBold,
            color: rgb(0, 0, 0),
            });                     
            firstPage.drawText(`${formatFecha(calculos.currentDate)}`, {
            x: 465,
            y: height - 118,
            size: sizeStandar,
            font: font,
            color: rgb(0, 0, 0),
            });
            firstPage.drawText(`${dataService.razon_social}`, {
            x: 100,
            y: height - 146,
            size: sizeData,
            font: fontBold,
            color: rgb(0, 0, 0),
            });
            let saltosLinea = 9
            //DATOS DEL PERMISIONARIO
            printLine(`${dataService.calle.toUpperCase()}`,100,154,font,false)
            printLine(`${dataService.colonia.toUpperCase()}`,100,154 + saltosLinea,font,false)
            printLine(`${dataService.ciudad.toUpperCase()}`,100,154 + saltosLinea *2,font,false)
            printLine(`${dataService.telefono.toUpperCase()}`,100,154 + saltosLinea *3,font,false)

            printLine(`${dataService.cp.toUpperCase()}`,306,154 + saltosLinea,font,false)
            printLine(`${dataService.estado.toUpperCase()}`,306,154 + saltosLinea *2,font,false)
            printLine(`${dataService.fax.toUpperCase()}`,306,154 + saltosLinea *3,font,false)
            printLine(`${dataService.licencia.toUpperCase()}`,306,152 + saltosLinea *4,font,false)

            printLine(`${dataService.correo.toLowerCase()}`,465,152 + saltosLinea * 3,font,true)
            printLine(`${formatFecha(parseDate(dataService.fecha_vencimiento))}`,465,152 + saltosLinea * 4,font,false)

            //DATOS DE LA FUENTE SELLADA
            saltosLinea=8
            printLine(`${element.marca.toUpperCase()}`,130,214,font,false)
            printLine(`${element.isotopo}`,130,214 + saltosLinea,font,false)
            printLine(`${element.serie}`,130,214 + saltosLinea *2,fontBold,false)
            printLine(`${element.actividad} ${element.unidades}`,130,214 + saltosLinea *3,font,false)
            
            // DATOS DEL TITULAR DE AUTORIZACION
            let inicio= 265
            printLine(`${certificado.licencia.razon_social.toUpperCase()}`,100,inicio ,fontBold,false)
            printLine(`${certificado.licencia.num_lic.toUpperCase()}`,390,inicio + saltosLinea *1,fontBold,false)
            printLine(`${formatFecha(parseDate(certificado.licencia.fecha_vencimiento.toUpperCase()))}`,470,inicio + saltosLinea *2,fontBold,false)

            inicio=282
            
            printLine(`${certificado.licencia.calle.toUpperCase()}`,100,inicio,font,false)
            printLine(`${certificado.licencia.colonia.toUpperCase()}`,100,inicio + saltosLinea,font,false)
            printLine(`${certificado.licencia.ciudad.toUpperCase()}`,100,inicio + saltosLinea *2,font,false)
            printLine(`${certificado.licencia.telefono.toUpperCase()}`,100,inicio + saltosLinea *3,font,false)

            printLine(`${certificado.licencia.cp.toUpperCase()}`,306,inicio + saltosLinea,font,false)
            printLine(`${certificado.licencia.estado.toUpperCase()}`,306,inicio + saltosLinea *2,font,false)
            printLine(`${certificado.licencia.fax.toUpperCase()}`,306,inicio + saltosLinea *3,font,false)

            printLine(`${certificado.licencia.correo.toLowerCase()}`,465,inicio + saltosLinea * 3,font,true)

            //DATOS DEL SISTEMA DE MEDICION 
            saltosLinea=8.5
            inicio = 332
            printLine(`${certificado.equipo.tipo.toUpperCase()} / ${certificado.detector.tipo.toUpperCase()}`,200,inicio ,font,false)
            printLine(`${certificado.equipo.marca.toUpperCase()} / ${certificado.detector.marca.toUpperCase()}`,200,inicio  + saltosLinea ,font,false)
            printLine(`${certificado.equipo.modelo.toUpperCase()},${certificado.equipo.serie} / ${certificado.detector.modelo.toUpperCase()},${certificado.equipo.serie}`,200,inicio + saltosLinea * 2,font,false)
            printLine(`0 - 2.0 KV (4096 canales)`,200,inicio + saltosLinea * 3,font,false)
            printLine(`${certificado.equipo.resolucion.toUpperCase()}`,200,inicio + saltosLinea * 4,font,false)
            printLine(`${calculos.efficencyDetection} %`,200,inicio + saltosLinea * 5,font,false)
            printLine(`${formatFecha(calculos.currentDate)}`,200,inicio + saltosLinea * 6,font,false)
            printLine(`FUENTE PUNTUAL`,200,inicio + saltosLinea * 7,font,false)
            printLine(`${certificado.fuente.marca}`,200,inicio + saltosLinea * 8,font,false)
            printLine(`${certificado.fuente.isotopo}`,200,inicio + saltosLinea * 9,font,false)
            printLine(`${certificado.fuente.serie}`,200,inicio + saltosLinea * 10,font,false)
            printLine(`${certificado.fuente.actividad_original} ${certificado.fuente.unidades}`,200,inicio + saltosLinea * 11,font,false)
            printLine(`${formatFecha(certificado.fuente.fecha_cal)}`,200,inicio + saltosLinea * 12,font,false)
            //DATOS DE LA PRUEBA DE FUGA
            saltosLinea=8.5
            inicio = 458
            let margen=225
           
           
            printLine(`${formatFecha(parseDate(element.fecha_frotis))}`,margen,inicio ,font,false)
            printLine(`Tlalnepanla, Estado de México a ${formatFecha(calculos.currentDate)}`,margen,inicio + saltosLinea,font,false)
            printLine(` ${element.metodo}`,margen,inicio + saltosLinea * 2,font,false)
            printLine(` ${certificado.tiempoConteo} min.`,margen + 100,inicio + saltosLinea  * 3,font,false)
            printLine(` ${certificado.conteosFondo} CPM`,margen,inicio + saltosLinea * 4,font,false)
            printLine(` ${certificado.tiempoConteo} min.`,margen + 100,inicio + saltosLinea  * 5,font,false)
            printLine(` ${certificado.tiempoConteo} min.`,margen + 100,inicio + saltosLinea  * 6,font,false)
            printLine(` ${calculos.lld} Bq`,margen + 100,inicio + saltosLinea  * 7,font,false)
            printLine(` ${calculos.lld} Bq`,margen + 100,inicio + saltosLinea  * 8,font,false)
            //RESULTADOS DE LA PRUEBA DE FUGA
            inicio = 567
            
            const centerText= (inicio,minWidth,maxWidth,textToCenter,fontBold)=>{
                const textWidth = fontBold.widthOfTextAtSize(textToCenter, 7);
                const availableWidth = maxWidth -minWidth
                const x = (availableWidth - textWidth) / 2; 
                
                
                firstPage.drawText(textToCenter, {
                    x: minWidth + x,
                    y:height - inicio,
                    size: 7,
                    font: fontBold,
                });
            }

            centerText(inicio,120,200,`${element.isotopo}`,fontBold)
            centerText(inicio,275,410,`${element.serie}`,fontBold)
            centerText(inicio,430,500,`SI`,fontBold)

            inicio=655
            centerText(inicio,120,275,`${certificado.personalRealiza.nivel} ${certificado.personalRealiza.nombre}`,fontBold)
            centerText(inicio,390,500,`${certificado.personalAutoriza.nivel} ${certificado.personalAutoriza.nombre}`,fontBold)
            inicio=inicio + 8
            centerText(inicio,120,275,`${certificado.personalRealiza.cargo} `,fontBold)
            centerText(inicio,390,500,`${certificado.personalAutoriza.cargo} `,fontBold)

            
                       
            // Serializar el PDF a bytes
            const pdfBytesEdited = await pdfDoc.save();
            
            // Descargar el PDF editado
            const blob = new Blob([pdfBytesEdited], { type: 'application/pdf' });
            saveAs(blob,`${nombre_pdf}`);

            // CREACION DE LA HOJA DE DATOS 
            // Cargamos el machote PDF 

            const pdfBytesHoja = await fetch(pdfTemplateData).then(res => res.arrayBuffer());
            //cargamos el PDF en pdf-lib
            const pdfDocHoja = await PDFDocument.load(pdfBytesHoja)
            // obtenemos la primer hoja 
            const pagesHoja = pdfDocHoja.getPages()
            const hoja = pagesHoja[0]

            sizeData = 8
            const printLineH =(text,x,y,font,fontmini)=>{
                let textW =0
                let sizeFont = sizeData
                textW = font.widthOfTextAtSize(text, sizeData);
                if(textW > 300){
                    sizeFont = sizeData - 1 - 1
                }else if(textW > 187  ){
                    sizeFont = sizeData--
                }else if(fontmini){

                    if(textW > 80 ){
                        sizeFont = sizeData - 3
                    }else if(textW > 142 ){
                        sizeFont = sizeData - 4
                    }
                    else{
                        sizeFont = sizeData--
                    }
                    
                }
                hoja.drawText(text, {
                x,
                y: height - y,
                size: sizeFont,
                font: font,
                color: rgb(0, 0, 0),
                });

            }
            //Tabla de fuente calibración
            inicio = 350
            margen= 192
            saltosLinea =11
            printLineH(` ${certificado.fuente.isotopo}`,margen ,inicio ,font,false)
            printLineH(` ${originalActivityBq(certificado.fuente.actividad_original,certificado.fuente.unidades)} `,margen ,inicio + saltosLinea  * 1,font,false)
            printLineH(` ${dateFormatShort(certificado.fuente.fecha_cal)} `,margen ,inicio + saltosLinea  * 2,font,false)
            printLineH(` ${dateFormatShort(calculos.currentDate)} `,margen ,inicio + saltosLinea  * 3,font,false)
            printLineH(` ${parseFloat(calculos.timeElapsed) * parseFloat(365.5)} `,margen ,inicio + saltosLinea  * 4,font,false)
            printLineH(` ${parseFloat(calculos.timeElapsed)} `,margen ,inicio + saltosLinea  * 5,font,false)
            printLineH(` ${calculos.halfLife} `,margen ,inicio + saltosLinea  * 6,font,false)
            printLineH(` ${certificado.fuente.rendimiento} `,margen ,inicio + saltosLinea  * 7,font,false)
            printLineH(` ${parseFloat(calculos.decayConstant).toFixed(2)} `,margen ,inicio + 2 + saltosLinea  * 8,font,false)
            printLineH(` ${calculos.currentActivity} `,margen ,inicio + 2 + saltosLinea  * 9,font,false)
            //Tabla de fuente calibración
            margen=390
            sizeData = 4
            printLineH(` ${dataService.razon_social} `,margen ,inicio + saltosLinea  * 2,font,false)
            sizeData=7
            printLineH(` ${element.isotopo} `,margen ,inicio + saltosLinea  * 3,font,false)
            printLineH(` ${dateFormatShort(element.fecha_frotis)} `,margen ,inicio + saltosLinea  * 4,font,false)
            printLineH(` ${dateFormatShort(calculos.currentDate)} `,margen ,inicio + saltosLinea  * 5,font,false)
            printLineH(` SIR${ano}-PF-${num_informe}`,margen ,inicio + saltosLinea  * 6,font,false)
            //Datos del equipo
            margen=675
            inicio = 350
            printLineH(` ${certificado.equipo.marca} `,margen ,inicio ,font,false)
            printLineH(` ${certificado.equipo.modelo} `,margen ,inicio + saltosLinea  ,font,false)
            printLineH(` ${certificado.equipo.serie} `,margen ,inicio + saltosLinea  * 2,font,false)
            printLineH(` ${certificado.th} mV`,margen ,inicio + saltosLinea  * 3,font,false)
            printLineH(`${certificado.ganancia}`,margen ,inicio + saltosLinea  * 4,font,false)
            printLineH(` ${certificado.hv} V `,margen ,inicio + saltosLinea  * 5,font,false)
            printLineH(` ${certificado.tiempoConteo} min.`,margen ,inicio + saltosLinea  * 6,font,false)
            printLineH(` ${certificado.detector.modelo} `,margen ,inicio + saltosLinea  * 7,font,false)
            printLineH(` ${certificado.detector.serie} `,margen ,inicio + saltosLinea  * 8,font,false)
            //Datos de la muestra
            margen=185
            inicio=510
            printLineH(` ${certificado.conteosFondo} `,margen ,inicio ,font,false)
            printLineH(` ${certificado.conteosFuente} `,margen ,inicio + saltosLinea  ,font,false)
            printLineH(` ${conteosFrotis} `,margen ,inicio + saltosLinea  * 2,font,false)
            printLineH(` ${element.serie} `,margen - 145,inicio + saltosLinea  * 2,font,false)

            //xm
            margen=460
            printLineH(` ${certificado.conteosFondo} `,margen ,inicio ,font,false)
            printLineH(` ${certificado.conteosFuente} `,margen ,inicio + saltosLinea  ,font,false)
            printLineH(` ${conteosFrotis} `,margen ,inicio + saltosLinea  * 2,font,false)
            //S
            margen=520
            printLineH(` ${Math.sqrt(parseFloat(certificado.conteosFondo)).toFixed(0)} `,margen ,inicio ,font,false)
            printLineH(` ${Math.sqrt(parseFloat(certificado.conteosFuente)).toFixed(0)} `,margen ,inicio + saltosLinea  ,font,false)
            printLineH(` ${Math.sqrt(parseFloat(conteosFrotis)).toFixed(0)} `,margen ,inicio + saltosLinea  * 2,font,false)
            //Xm-Xf
            margen=580
            let resultFondo=parseFloat(certificado.conteosFondo).toFixed(0) - parseFloat(certificado.conteosFondo).toFixed(0)
            printLineH(` ${resultFondo < 0 ? 0 : resultFondo} `,margen ,inicio ,font,false)
            let resultFuente=parseFloat(certificado.conteosFuente).toFixed(0) - parseFloat(certificado.conteosFondo).toFixed(0)
            printLineH(` ${resultFuente < 0 ? 0 : resultFuente}  `,margen ,inicio + saltosLinea  ,font,false)
            let resultFrotis=parseFloat(conteosFrotis).toFixed(0) - parseFloat(certificado.conteosFondo).toFixed(0)
            printLineH(` ${resultFrotis < 0 ? 0 : resultFrotis} `,margen ,inicio + saltosLinea  * 2,font,false)

            //Actividad en Bq
            margen=640
            resultFondo=resultFondo * (parseFloat(calculos.currentActivity)/parseFloat(certificado.conteosFuente))
            printLineH(` ${resultFondo < 0 ? 0 : resultFondo.toFixed(0)} `,margen ,inicio ,font,false)
            resultFuente=resultFuente * (parseFloat(calculos.currentActivity)/parseFloat(certificado.conteosFuente))
            printLineH(` ${resultFuente < 0 ? 0 : resultFuente.toFixed(0)}  `,margen ,inicio + saltosLinea  ,font,false)
            resultFrotis=resultFrotis * (parseFloat(calculos.currentActivity)/parseFloat(certificado.conteosFuente))
            printLineH(` ${resultFrotis < 0 ? 0 : resultFrotis.toFixed(0)} `,margen ,inicio + saltosLinea  * 2,font,false)
            //Coef de variacion
            margen=700
            printLineH(` ${((Math.sqrt(parseFloat(certificado.conteosFondo)).toFixed(0) / parseFloat(certificado.conteosFondo)) * 200).toFixed(2)} `,margen ,inicio ,font,false)
            printLineH(` ${((Math.sqrt(parseFloat(certificado.conteosFuente)).toFixed(0) / parseFloat(certificado.conteosFuente)) * 200).toFixed(2)} `,margen ,inicio + saltosLinea  ,font,false)
            printLineH(` ${((Math.sqrt(parseFloat(conteosFrotis)).toFixed(0) / parseFloat(conteosFrotis)) * 200).toFixed(2)} `,margen ,inicio + saltosLinea  * 2,font,false)

            //Resultados
            margen=185
            inicio=663
            printLineH(` ${calculos.efficencyDetection} `,margen ,inicio ,font,false)
            printLineH(` ${calculos.countsBq} `,margen ,inicio + saltosLinea  ,font,false)
            printLineH(` ${calculos.lld} `,margen ,inicio + saltosLinea  * 2,font,false)

             // Serializar el PDF a bytes
             const pdfBytesEditedHoja = await pdfDocHoja.save();
            
             // Descargar el PDF editado
             const blobHoja = new Blob([pdfBytesEditedHoja], { type: 'application/pdf' });
             saveAs(blobHoja,`${nombre_pdf}_hoja_datos.pdf`);
            










    };

    const handleReceived= (todo)=>{
        setIsFormActive(true)
        setElementsToDo(todo)

    }

    const handleChange = (e)=>{
        e.preventDefault()

        const { name, value } = e.target

        if(name === 'equipo'){
            const equipo = dataLab.equipos.filter(item => item.id === value)
            if(equipo[0].tipo === 'Multicanal'){
                console.log('Es multicanal')
                setIsMultiChanel(true)
            }else{
                setIsMultiChanel(false)
                console.log('Es Monocanal')
             }

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

    const handleSubmit = async(e)=>{
        e.preventDefault()
        const formulario = new FormData();
        const ano = new Date().getFullYear()
        const certificado ={}

        let empty={}
        
        for(let input in formData){
            if(!formData[input]){
                empty[input]='empty'
            }else{
                certificado[input] = formData[input]
            }
            //Si esta lleno lo metemos a un elemento FormData.append
        }
        if(Object.keys(empty).length > 0){
            setFormError(empty)
            Swal.fire('Todos los campos deben ser llenados','','warning')
            return
        }
        certificado['licencia'] = getInformationLab(formData.licencia,'licencias')
        certificado['equipo'] = getInformationLab(formData.equipo,'equipos')
        certificado['detector'] = getInformationLab(formData.detector,'detectores')
        certificado['fuente'] = getInformationLab(formData.fuente,'fuentes')
        certificado['personalRealiza'] = getInformationLab(formData.personalRealiza,'personalPf')
        certificado['personalAutoriza'] = getInformationLab(formData.personalAutoriza,'personalPf')
        certificado['tiempoConteo'] = formData.tiempoConteo

        const ultimos = await fetch(`${server}api/v1/services/last-inform/p/o/i/u/y/${ano}`)
        const num = await ultimos.json()
        let num_informe = 0
        if(num.success){
            console.log(num)
            num_informe = parseInt(num.data)
        }else{
            Swal.fire('Algo salio mal al obtener el ultimo numero de informe','','error')
            return
        }
        const newFrotis = elementsToDo.frotis.map(element => {
            //Realización de los calculos necesarios para el certificado
            const calculos = calculatePf({
                fuente:certificado.fuente,
                conteosFrotis:inputValues[element.id],
                formData

            })
            const datosServicio=elementsToDo.data_service
            delete datosServicio.frotis
            //ASIGNAMOS EL NUMERO DE INFORME NUEVO
            num_informe=num_informe + 1
            //CREAMOS EL NOMBRE DEL PDF CON LA NOMENCLATURA:
            //NUMINFORME_NOMBRE EMPRESA_ISOTOPO_SERIE
            let nombre_pdf = `${num_informe.toString().padStart(3, '0')}_${datosServicio.razon_social}_${element.isotopo}_${element.serie}.pdf`
                nombre_pdf = nombre_pdf.replace('/','-')

            generateInform({certificado,calculos,element,dataService:elementsToDo.data_service,num_informe:num_informe.toString().padStart(3, '0'),ano,nombre_pdf,conteosFrotis:inputValues[element.id]})
        
            return ({
            ...element,
            certificado:{conteosFrotis:inputValues[element.id],...certificado},
            num_informe:num_informe.toString().padStart(3, '0'),
            calculos,
            datosServicio,nombre_pdf,
            status:'Realizado',
            })}
        ); 
        elementsToDo.frotis=newFrotis
        
        console.log('[LO ULTIMO]',elementsToDo.frotis)

        formulario.append('id_service',elementsToDo.data_service.id)
        formulario.append('frotisRealizados',JSON.stringify(newFrotis))
        //------Creacion de array para alta de informes----------------------------------------------------------------

        const informes = newFrotis.map(element=>(
            {
                actividad:`${element.actividad} ${element.unidades}`,
                empresa:`${element.datosServicio.razon_social}`,
                fecha_frotis:element.fecha_frotis,
                fecha_informe:element.calculos.currentDate,
                isotopo:element.isotopo,
                licencia:element.datosServicio.licencia,
                marca_fuente:element.marca,
                nombre_pdf:element.nombre_pdf,
                num_informe:element.num_informe,
                num_serie:element.serie,
                os:elementsToDo.os,
                ano,
                clienteId:element.datosServicio.cliente,
                isPdf:false,
                datosServicio:element.datosServicio,
                calculos:element.calculos,
                certificado,froti:element.element

            }
        ))

        try {
            const response = await fetch(`${server}api/v1/services/frotis-list/in-progress/${ano}`,
                {
                    method:'PATCH',
                    body:formulario
                }
            )
            await fetch(`${server}api/v1/services/create-inform/${ano}`,
                {
                    method:'POST',
                    headers: {
                        'Content-Type': 'application/json' // Asegúrate de incluir cualquier otro encabezado necesario
                    },
                    body:JSON.stringify(informes)
                }
            ).then(res=>res.json()).then(data=>console.log(data)).catch(e=>console.log(e))

            const frotis = await response.json()
            
            if(frotis.success){
                Swal.fire(frotis.message,'','success')
                
            }else{
                Swal.fire('Algo Salio Mal, vuelva a intentarlo en un momento','','error')
            }
        } catch (error) {
            setErrorFetch(error)
        }
    }

    useEffect(()=>{

        const ano = new Date().getFullYear()
        const fetchData = async()=>{
            try {
                const response = await fetch(`${server}api/v1/services/frotis-list/in-progress/${ano}`)
                const frotis = await response.json()
                
                if(frotis.success){
                    setFrotis(frotis.data)
                }else{
                    Swal.fire('Algo Salio Mal, vuelva a intentarlo en un momento','','error')
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
        <>
            {!isFormActive && (
                <Card className='m-2 rounded-xl shadow mt-4 mb-2' >
                    

                <CardHeader className='flex justify-between border-0'>
                    <CardTitle className="text-yellow-600">Frotis listos para Analisis</CardTitle>
                   
                </CardHeader>
                <CardBody >

                    <table className=" table-responsive w-100 text-center text-xs " >
                        <thead >
                            <tr>
                            <th className="text-center   border-b ">OS</th>
                            <th className="text-center   border-b">Razon Social</th>
                            <th className="text-center   border-b">Isótopo</th>
                            <th className="text-center   border-b">Fecha de Frotis</th>
                            <th className="text-center   border-b">Cantidad</th>
                            </tr>
                        </thead>
                        <tbody className="text-center"
                        >
                        {
                            frotis.map((frotis, index) => {
                                if(frotis.status !== 'Realizado')
                                {
                                    return (
                                    <tr key={index}>
                                    <td className="text-center  border-b max-w-2/5">{frotis.os}</td>
                                    <td className="text-center  border-b max-w-2/5">{frotis.razon_social}</td>
                                    <td className="text-center  border-b max-w-2/5">{frotis.isotopo}</td>
                                    <td className="text-center  border-b max-w-2/5">{frotis.fecha_frotis}</td>
                                    <td className="text-center  border-b max-w-2/5">{frotis.frotis.length}</td>

                                    <td className="text-center  border-b">
                                        <button
                                        onClick={() => handleReceived(frotis)}
                                        className="bg-yellow-600 text-white py-1 px-3 rounded hover:bg-yellow-400"
                                        >
                                        Realizar
                                        </button>
                                    </td>
                                    </tr>
                                    )
                                }
                            })
                        }
                          
                        </tbody>

                    </table>

                   
                </CardBody>
                
                </Card>

            )}
            {isFormActive && (
                <Card className='m-2 rounded-xl shadow mt-4 mb-2' >
                    <CardHeader className='flex justify-between border-0'>
                        <CardTitle className="text-yellow-600">Realización de Prueba de Fuga</CardTitle>  
                    </CardHeader>
                    <CardBody >
                        <Row >
                            <Col>
                            <FormGroup>
                                <Label className="text-yellow-600">Orden de servicio</Label>
                                <p>{elementsToDo?.os}</p>
                            </FormGroup>
                            </Col>
                        </Row>
                        <Row >
                            <Col >
                            <FormGroup>
                                <Label className="text-yellow-600">Razón Social</Label>
                                <p>{elementsToDo?.razon_social}</p>
                            </FormGroup>
                            </Col>

                        </Row>
                        <Row >
                            <Col >
                            <FormGroup>
                                <Label className="text-yellow-600">Dirección</Label>
                                <p>{elementsToDo?.data_service.calle}, {elementsToDo?.data_service.colonia}, {elementsToDo?.data_service.ciudad}, {elementsToDo?.data_service.estado},C.P. {elementsToDo?.data_service.cp},{elementsToDo?.data_service.pais}</p>
                            </FormGroup>
                            </Col>

                        </Row>
                        <Row >
                            <Col md={6}>
                            <FormGroup>
                                <Label className="text-yellow-600">Licencia de operacion</Label>
                                <p>{elementsToDo?.data_service.licencia}</p>
                            </FormGroup>
                            </Col>
                            <Col md={6}>
                            <FormGroup>
                                <Label className="text-yellow-600">Fecha de vencimiento</Label>
                                <p>{elementsToDo?.data_service.fecha_vencimiento}</p>
                            </FormGroup>
                            </Col>

                        </Row>

                        <Form className="text-yellow-600">
                            <Row>
                                <h2 className="text-blue-500 mb-4">DATOS DEL ANÁLISIS DE PRUEBA DE FUGA</h2>
                                <Col >
                                    <FormGroup>
                                        <Label for="licencia">Licencia de operacion del laboratorio</Label>
                                        <Input type="select" name="licencia" value={formData.licencia} onChange={handleChange} className={`${formError.licencia ? 'border-red-600' : ''}`}>
                                            <option value=''>--Seleccione licencia--</option>
                                            {
                                                dataLab?.licencias.map((item,index)=>(
                                                    <option key={`${index}-lic`} value={item.id}>{item.num_lic}</option>
                                                ))
                                            }
                                        </Input>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label for="equipo">Equipo a utilizar</Label>
                                        <Input type="select" name="equipo" value={formData.equipo} onChange={handleChange} className={`${formError.equipo ? 'border-red-600' : ''}`}>
                                            <option value=''>--Seleccione Equipo--</option>
                                            {
                                                dataLab?.equipos.map((item,index)=>(
                                                    <option key={`${index}-equipo`} value={item.id}>{item.marca} {item.modelo},serie {item.serie}</option>
                                                ))
                                            }
                                        </Input>
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label for="detector">Detector a utilizar</Label>
                                        <Input type="select" name="detector" value={formData.detector} onChange={handleChange} className={`${formError.detector ? 'border-red-600' : ''}`}>
                                            <option value=''>--Seleccione detector--</option>
                                            {
                                                dataLab?.detectores.map((item,index)=>(
                                                    <option key={`${index}-detector`} value={item.id}>{item.marca} {item.modelo},serie {item.serie}</option>
                                                ))
                                            }
                                        </Input>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label for="fuente">Fuente de referencia para {elementsToDo.isotopo}</Label>
                                        <Input type="select" name="fuente" value={formData.fuente} onChange={handleChange} className={`${formError.fuente ? 'border-red-600' : ''}`}>
                                            <option value=''>--Seleccione fuente--</option>
                                            {
                                                dataLab?.fuentes.map((item,index)=>(
                                                    <option key={`${index}-fuentes`} value={item.id}>{item.isotopo} {item.modelo},serie {item.serie}</option>
                                                ))
                                            }
                                        </Input>
                                    </FormGroup>
                                </Col>
                               
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label for="personalRealiza">Personal que realiza la Prueba de Fuga</Label>
                                        <Input type="select" name="personalRealiza" value={formData.personalRealiza} onChange={handleChange} className={`${formError.personalRealiza ? 'border-red-600' : ''}`}>
                                            <option value=''>--Seleccione una Persona--</option>
                                            {
                                                dataLab?.personalPf.map((item,index)=>(
                                                    <option key={`${index}-personal`} value={item.id}>{item.cargo} {item.nivel} {item.nombre}</option>
                                                ))
                                            }
                                        </Input>
                                    </FormGroup>
                                </Col>
                                <Col md={6}>
                                    <FormGroup>
                                        <Label for="personalAutoriza">Personal que Autoriza Prueba de Fuga</Label>
                                        <Input type="select" name="personalAutoriza" value={formData.personalAutoriza} onChange={handleChange} className={`${formError.personalAutoriza ? 'border-red-600' : ''}`} >
                                            <option value=''>--Seleccione una Persona--</option>
                                            {
                                                dataLab?.personalPf.map((item,index)=>(
                                                    <option key={`${index}-personal2`} value={item.id}>{item.cargo} {item.nivel} {item.nombre}</option>
                                                ))
                                            }
                                        </Input>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <h2 className="text-blue-500 mb-8">Resultados de analisis</h2>
                                
                                <Col md={3}>
                                    <FormGroup>
                                        <Label>Tiempo de conteo en minutos</Label>
                                        <Input type="number" name="tiempoConteo" value={formData.tiempoConteo} min={0} onChange={handleChange} className={`${formError.tiempoConteo ? 'border-red-600' : ''}`} onWheel={()=>handleWheel}/>           
                                    </FormGroup>
                                </Col>
                                <Col md={3}>
                                    <FormGroup>
                                        <Label>Threshold en mV </Label>
                                        <Input type="number" name="th" value={formData.th} onChange={handleChange} className={`${formError.th ? 'border-red-600' : ''}`} onWheel={()=>handleWheel} />       
                                        
                                    </FormGroup>
                                </Col>
                                <Col md={3}>
                                    <FormGroup>
                                        <Label>Alto voltaje (HV) </Label>
                                        <Input type="number" name="hv" value={formData.hv} onChange={handleChange} className={`${formError.hv ? 'border-red-600' : ''}`} onWheel={()=>handleWheel} min={0}/>       
                                        
                                    </FormGroup>
                                </Col>
                                <Col md={3}>
                                    <FormGroup>
                                        <Label>Ganancia </Label>
                                        <Input type="text" name="ganancia" value={formData.ganancia} onChange={handleChange} className={`${formError.ganancia ? 'border-red-600' : ''}`} onWheel={()=>handleWheel} />       
                                        
                                    </FormGroup>
                                </Col>

                            </Row>
                            
                            <Col md={6}>
                                <FormGroup>
                                    <Label>Conteos de fuente</Label>
                                    <Input type="number" name="conteosFuente" value={formData.conteosFuente} onChange={handleChange} className={`${formError.conteosFuente ? 'border-red-600' : ''}`} min={0}>       
                                    </Input>
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label>Conteos de fondo</Label>
                                    <Input type="number" name="conteosFondo" value={formData.conteosFondo} onChange={handleChange} className={`${formError.conteosFondo ? 'border-red-600' : ''}`} min={0}>       
                                    </Input>
                                </FormGroup>
                            </Col>
                            
                            <Row>
                                <h2 className="text-blue-500 mb-8">CONTEOS DE FROTIS</h2>
                                <Col md={4}>
                                    {elementsToDo.frotis?.map((item,index)=>(
                                        <FormGroup key={`${index}-f`}>
                                        <Label>{item.serie}</Label>
                                        <Input type="number"
                                            value={inputValues[item.id] || ''}
                                         onChange={(event)=>handleInputChange(item.id,event)}
                                         min={0}
                                         />       
                                    </FormGroup>
                                    ))}
                                </Col>
                              
                            </Row>
                            <Row>
                            
                                <Col md={4}>
                                   <Button type="button " className="bg-green-900 hover:bg-green-600" onClick={handleSubmit}>Finalizar</Button>
                                </Col>
                              
                            </Row>
                            
                        </Form>     
                    </CardBody>
                    
                </Card>
            )}
        </>
        
    )
}