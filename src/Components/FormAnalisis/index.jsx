import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Card, CardBody, CardFooter, CardHeader, CardTitle, Label, Table,Form,Row,Col, FormGroup,Input } from "reactstrap";
import Swal from "sweetalert2";
import { server } from "./../../db/servidor"


import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { saveAs } from 'file-saver';
import pdfTemplate from './../../assets/MachoteInforme.pdf';
import pdfTemplateData from './../../assets/MachoteHoja.pdf';

import {formatFecha} from './../../functions/formats'

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

const generateInform = async ({certificado,calculos,element,dataService,num_informe,ano,nombre_pdf,conteosFrotis}) => {

    console.log('CERTIFICADO:',certificado)
    console.log('CALCULOS:',calculos)
    console.log('ELEMNTO:',element)
    console.log('service:',dataService)
 
    try{ // Cargar el machote PDF desde una URL
     const pdfBytes = await fetch(pdfTemplate).then(res => res.arrayBuffer());
     
     // Cargar el PDF en pdf-lib
     const pdfDoc = await PDFDocument.load(pdfBytes);
     
     // Obtener la primera página del PDF
     const pages = pdfDoc.getPages();
     const firstPage = pages[0];''
 

     // Añadir texto a la primera página
     const {  height } = firstPage.getSize();
     
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
      saveAs(blobHoja,`${nombre_pdf}_hoja_datos.pdf`);}
      catch(err){
        console.log(err)
        Swal.fire('Algo salio mal',err,'error')
      }
     










};

export default function FormAnalisis(){

    const [inform, setInform] = useState({})
    const [formData,setFormData] = useState({

    })
    const [formError,setFormError] = useState({

    })
    const { a,num } = useParams()




    useEffect(()=>{
       const callInform = async()=>{
        try {
            const { data } = await axios.get(`${server}api/v1/services/edit/informs/in/a/data/for/one/${a}/${num}`)
            console.log('[INICIO]:',data)
            setInform(data)
            const newData = {
                razon_social:data.datosServicio.razon_social,
                calle:data.datosServicio.calle,
                colonia:data.datosServicio.colonia,
                ciudad:data.datosServicio.ciudad,
                correo:data.datosServicio.correo,
                cp:data.datosServicio.cp,
                estado:data.datosServicio.estado,
                fax:data.datosServicio.fax,
                licencia:data.datosServicio.licencia,
                os:data.datosServicio.os,
                pais:data.datosServicio.pais,
                telefono:data.datosServicio.telefono,
                fecha_frotis:data.fecha_frotis,
                fecha_vencimiento:data.datosServicio.fecha_vencimiento,
                isotopo:data.isotopo,
                marca_fuente:data.marca_fuente,
                num_serie:data.num_serie,
                actividad:data.actividad
               
            }
            console.log('DATOS A MODIFICAR----------->',newData)
            setFormData(newData) 
            
        } catch (error) {
            Swal.fire('Algo salio mal ', error,'error')
            return
        }
       }
       callInform()
        },[])

    const handleChange = (e)=>{
        e.target.preventDefault
        const {name,value} = e.target

        setFormData({
            ...formData,
            [name]:value
        })

        

    }

    const handleSubmit =async()=>{
        console.log('NUEVOS DATOS',formData)
        const actualizacion={
            ...inform,
            datosServicio:{
                razon_social:formData.razon_social,
                calle:formData.calle,
                colonia:formData.colonia,
                ciudad:formData.ciudad,
                correo:formData.correo,
                cp:formData.cp,
                estado:formData.estado,
                fax:formData.fax,
                licencia:formData.licencia,
                os:formData.os,
                pais:formData.pais,
                telefono:formData.telefono,
                fecha_frotis:formData.fecha_frotis,
                fecha_vencimiento:formData.fecha_vencimiento,
            },
            isotopo:formData.isotopo,
            marca_fuente:formData.marca_fuente,
            num_serie:formData.num_serie,
            actividad:formData.actividad,
            fecha_frotis:formData.fecha_frotis,
            empresa:formData.razon_social,
        }

        setInform(actualizacion)
        console.log('[ACTUALIZACION]:',actualizacion)

        try {
            const { data } = await axios.post(`${server}api/v1/services/edit/informs/in/a/data/for/one/${inform.ano}/${inform.num_informe}`,actualizacion)
            console.log('[RESPUESTA]',data)

            if(data.success){
               

                const act =actualizacion.actividad
                let nvoActividad = act.split(' ')

                console.log(nvoActividad)
                const element={
                    marca:actualizacion.marca_fuente,
                    isotopo:actualizacion.isotopo,
                    serie:actualizacion.num_serie,
                    actividad:nvoActividad[0],
                    unidades:nvoActividad[1],
                    metodo:'Vía humeda sobre una superficie equivalente',
                    fecha_frotis:actualizacion.datosServicio.fecha_frotis
                }
                console.log('[RESPUESTA]',data)


                generateInform({
                    certificado:actualizacion.certificado,
                    calculos:actualizacion.calculos,
                    element,
                    dataService:actualizacion.datosServicio,
                    num_informe:actualizacion.num_informe,
                    ano:actualizacion.ano,
                    nombre_pdf:actualizacion.nombre_pdf,
                    conteosFrotis:actualizacion.calculos.conteosFrotis})

                    Swal.fire('Actualizado',data.message,'success')
            }
        } catch (error) {
            Swal.fire('Algo salio mal',error,'error')
            
        }
    }
    return(
    <>    
        <Card className='m-2 rounded-xl shadow mt-4 mb-2' >
            <CardHeader className='flex justify-between border-0'>
                <CardTitle className="text-yellow-600">Edición de informe de Prueba de Fuga</CardTitle>  
            </CardHeader>
            <CardBody >
                
                <Row className="text-yellow-600">
                       <h2 className="text-black">Datos del permisionario</h2>
                        <Col md={12}>
                            <FormGroup>
                                <Label for="razon_social" className="text-yellow-600">Razón Social</Label>
                                <Input type="text" name="razon_social" id="razon_social"  onChange={handleChange} className={`${formError.razon_social ? 'border-red-600' : ''}`} value={formData.razon_social}/>
                            </FormGroup>
                        </Col>
                </Row>
                <Row>
                    <h2 className="text-black">Dirección</h2>

                    <Col md={6}>
                        <FormGroup>
                            <Label for="calle" className="text-yellow-600">Calle</Label>
                            <Input type="text" name="calle" id="calle"  onChange={handleChange} className={`${formError.calle ? 'border-red-600' : ''}`} value={formData.calle}/>
                        </FormGroup>
                    </Col>
                    
                    <Col md={6}>
                        <FormGroup>
                            <Label for="colonia" className="text-yellow-600">Colonia</Label>
                            <Input type="text" name="colonia" id="colonia"  onChange={handleChange} className={`${formError.colonia ? 'border-red-600' : ''}`} value={formData.colonia}/>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="ciudad" className="text-yellow-600">Ciudad / Delegación / Municipio</Label>
                            <Input type="text" name="ciudad" id="ciudad"  onChange={handleChange} className={`${formError.ciudad ? 'border-red-600' : ''}`} value={formData.ciudad}/>
                        </FormGroup>
                    </Col>
                    
                    <Col md={6}>
                        <FormGroup>
                            <Label for="estado" className="text-yellow-600">Estado</Label>
                            <Input type="text" name="estado" id="estado"  onChange={handleChange} className={`${formError.estado ? 'border-red-600' : ''}`} value={formData.estado}/>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md={6}>
                        <FormGroup>
                            <Label for="cp" className="text-yellow-600">Código Postal</Label>
                            <Input type="number" name="cp" id="cp"  onChange={handleChange} className={`${formError.cp ? 'border-red-600' : ''}`} value={formData.cp}/>
                        </FormGroup>
                    </Col>
                    
                    <Col md={6}>
                        <FormGroup>
                            <Label for="pais" className="text-yellow-600">Páis</Label>
                            <Input type="text" name="pais" id="pais"  onChange={handleChange} className={`${formError.pais ? 'border-red-600' : ''}`} value={formData.pais}/>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md={4}>
                        <FormGroup>
                            <Label for="telefono" className="text-yellow-600">Teléfono</Label>
                            <Input type="number" name="telefono" id="telefono"  onChange={handleChange} className={`${formError.telefono ? 'border-red-600' : ''}`} value={formData.telefono}/>
                        </FormGroup>
                    </Col>
                    
                    <Col md={4}>
                        <FormGroup>
                            <Label for="correo" className="text-yellow-600">Correo</Label>
                            <Input type="text" name="correo" id="correo"  onChange={handleChange} className={`${formError.correo ? 'border-red-600' : ''}`} value={formData.correo}/>
                        </FormGroup>
                    </Col>
                    <Col md={4}>
                        <FormGroup>
                            <Label for="fax" className="text-yellow-600">Fax</Label>
                            <Input type="text" name="fax" id="fax"  onChange={handleChange} className={`${formError.fax ? 'border-red-600' : ''}`} value={formData.fax}/>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                        <Col md={4}>
                            <FormGroup>
                                <Label for="licencia" >No.Licencia</Label>
                                <Input type="text" name="licencia" id="licencia" placeholder="Ej. A00.200/1988/2020" onChange={handleChange} className={`${formError.licencia ? 'border-red-600' : ''}`} value={formData.licencia}/>
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
                    <h2 className="text-black">Datos del frotis</h2>

                    <Col md={4}>
                        <FormGroup>
                            <Label for="isotopo" className="text-yellow-600">Isótopo</Label>
                            <Input type="text" name="isotopo" id="isotopo"  onChange={handleChange} className={`${formError.isotopo ? 'border-red-600' : ''}`} value={formData.isotopo}/>
                        </FormGroup>
                    </Col>
                    
                    <Col md={4}>
                        <FormGroup>
                            <Label for="marca_fuente" className="text-yellow-600">Marca</Label>
                            <Input type="text" name="marca_fuente" id="marca_fuente"  onChange={handleChange} className={`${formError.marca_fuente ? 'border-red-600' : ''}`} value={formData.marca_fuente}/>
                        </FormGroup>
                    </Col>
                    <Col md={4}>
                        <FormGroup>
                            <Label for="num_serie" className="text-yellow-600">Serie</Label>
                            <Input type="text" name="num_serie" id="num_serie"  onChange={handleChange} className={`${formError.num_serie ? 'border-red-600' : ''}`} value={formData.num_serie}/>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                   
                    <Row >
                <Col md={10}>
                    
                   
                    <FormGroup className='flex flex-row gap-4 justify-center text-yellow-600'>
                        <Label >Actividad Original</Label>
                        <Input type='text' name='actividad' onChange={handleChange} className={`${formData.actividad ? 'border-red-600': ''}`} value={formData.actividad}/>
                    </FormGroup>
                    
                   
                    <FormGroup className='flex flex-row gap-4 justify-center text-yellow-600'>
                        <Label >Fecha de toma de frotis</Label>
                        <Input type='date' name='fecha_frotis' onChange={handleChange} className={`${formData.fecha_frotis ? 'border-red-600': ''}`} value={formData.fecha_frotis}/>
                    </FormGroup>
                    
                </Col>
            </Row>
                </Row>
            </CardBody>
            <CardFooter>
                <Button onClick={handleSubmit}>
                    Actualizar
                </Button>
            </CardFooter>
            
        </Card>
        
    </>
        
    )
}