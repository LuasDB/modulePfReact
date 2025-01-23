import { Button, Card, CardBody, CardFooter, CardHeader, Input, Label, Modal,CardTitle,
    FormGroup, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import SemaphorStatus from './../StatusSemaphore'
import {fechaCorta, setStatusColor} from './../../../functions/formats'


export default function VerServicio({selectedItem,toggleModal}){

    return (
        <>
 <ModalHeader toggle={toggleModal} >Detalles del Servicio
 <SemaphorStatus 
            status={{
                'Arribo': selectedItem.isArrived,
                'O.S.': selectedItem.isOs || false,
                'Condiciones Fis.': selectedItem.isConditions || false,
                'Notificacion llegada':selectedItem.isNotification || false,
                'Calibración': selectedItem.isCalibration || false,
                'Envio': selectedItem.isSend || false
            }}

            />
 </ModalHeader>
            <ModalBody>
              {selectedItem && (
                <Card className="m-1 rounded-xl shadow p-2">
                  <CardHeader className="flex flex-col justify-between bg-white">
                    <CardTitle className='font-bold text-yellow-500'>Datos del cliente</CardTitle>
                    <FormGroup className='flex flex-row gap-10'>
                        <div className='w-1/2'> 
                            <span className='text-blue-700'>Cliente</span> 
                            <h2 className={`font-medium text-gray-600`} >
                              {selectedItem.cliente || 'PENDIENTE'}
                            </h2>

                        </div>
                    </FormGroup> 
                    <FormGroup className='flex flex-row gap-10'>
                        <div className='w-1/3'> 
                            <span className='text-blue-700'>Contacto</span> 
                            <h2 className={`font-medium  ${!selectedItem.datosServicio?'text-orange-600':'text-gray-600' }`}>{!selectedItem.datosServicio? 'Pendiente':selectedItem.datosServicio.contacto.nombre}</h2>
                        </div>
                        <div className='w-1/3'>
                            <span className='text-blue-700'>Correo de contacto</span> 
                            <h2 className={`font-medium  ${!selectedItem.datosServicio?'text-orange-600':'text-gray-600' }`}>{!selectedItem.datosServicio? 'Pendiente':selectedItem.datosServicio.contacto.correoContacto}</h2>
                        </div> 
                        <div className='w-1/3'>
                            <span className='text-blue-700'>Telefono de contacto</span> 
                            <h2 className={`font-medium  ${!selectedItem.datosServicio?'text-orange-600':'text-gray-600' }`}>{!selectedItem.datosServicio? 'Pendiente':selectedItem.datosServicio.contacto.telefonoContacto}</h2>
                        </div>    
                                
                    </FormGroup>   
                    <CardTitle className='font-bold text-yellow-500'>Datos del Permisionario para el certificado</CardTitle>
                    <FormGroup className='flex flex-row gap-10'>
                        <div className='w-1/2'> 
                            <span className='text-blue-700'>Razón Social</span> 
                            <h2 className={`font-medium  ${!selectedItem.datosServicio?'text-orange-600':'text-gray-600' }`}>{!selectedItem.datosServicio? 'Pendiente':selectedItem.datosServicio.permisionario.razonSocial}</h2>
                        </div>
                        <div className='w-1/2'>
                            <span className='text-blue-700'>Dirección</span> 
                            <h2 className={`font-medium  ${!selectedItem.datosServicio?'text-orange-600':'text-gray-600' }`}>{!selectedItem.datosServicio? 'Pendiente':selectedItem.datosServicio.permisionario.domicilio}</h2>
                        </div> 
                        
                    </FormGroup>
                                          
                  </CardHeader>
                  <CardHeader className="flex flex-col justify-between bg-white">
                    <CardTitle className='font-bold text-yellow-500'>Datos del equipo</CardTitle>
                    <FormGroup className='flex flex-row gap-10'>
                        <div className='w-1/4'> 
                            <span className='text-blue-700'>Marca</span> 
                            <h2 className={`font-medium  ${!selectedItem.datosServicio?'text-gray-600':'text-gray-600' }`}>{selectedItem.marca}</h2>
                        </div>
                        <div className='w-1/4'>
                            <span className='text-blue-700'>Modelo</span> 
                            <h2 className={`font-medium  ${!selectedItem.datosServicio?'text-gray-600':'text-gray-600' }`}>{selectedItem.modelo}</h2>
                        </div> 
                        <div className='w-1/4'>
                            <span className='text-blue-700'>Serie</span> 
                            <h2 className={`font-medium  ${!selectedItem.datosServicio?'text-gray-600':'text-gray-600' }`}>{selectedItem.serie}</h2>
                        </div> 
                        <div className='w-1/4'>
                            <span className='text-blue-700'>Tipo</span> 
                            <h2 className={`font-medium  ${!selectedItem.datosServicio?'text-gray-600':'text-gray-600' }`}>{selectedItem.tipo}</h2>
                        </div>             
                    </FormGroup>    
                    <FormGroup className='flex flex-row gap-10'>
                        <div className='w-1/4'> 
                            <span className='text-blue-700'>Marca Detector</span> 
                            <h2 className='font-medium text-gray-600'>{selectedItem.marcaDetector}</h2>
                        </div>
                        <div className='w-1/4'>
                            <span className='text-blue-700'>Modelo Detector</span> 
                            <h2 className='font-medium text-gray-600'>{selectedItem.modeloDetector}</h2>
                        </div> 
                        <div className='w-1/4'>
                            <span className='text-blue-700'>Serie Detector</span> 
                            <h2 className='font-medium text-gray-600'>{selectedItem.serieDetector}</h2>
                        </div>    
                        <div className='w-1/4'>
                            <span className='text-blue-700'>Tipo Detector</span> 
                            <h2 className='font-medium text-gray-600'>{selectedItem.tipoDetector}</h2>
                        </div>          
                    </FormGroup>
                    <FormGroup className='flex flex-row gap-10'>
                        <div className='w-1/4'> 
                            <span className='text-blue-700'>Unidades del equipo</span> 
                            <h2 className='font-medium text-gray-600'>{selectedItem.unidadesEquipo}</h2>
                        </div>
                        <div className='w-1/4'> 
                            <span className='text-blue-700'>Tipo de radiación</span> 
                            <h2 className='font-medium text-gray-600'>{selectedItem.tipoRadiacion}</h2>
                        </div>                           
                    </FormGroup>                        
                  </CardHeader>
                  <CardHeader className="flex flex-col justify-between bg-white">
                    <CardTitle className='font-bold text-yellow-500'>Datos del servicio</CardTitle>
                    <FormGroup className='flex flex-row gap-10'>
                        <div className='w-1/4'> 
                            <span className='text-blue-700'>Orden de Servicio</span> 
                            <h2 className={`font-medium  ${!selectedItem.datosServicio?'text-orange-600':'text-gray-600' }`}>{!selectedItem.datosServicio? 'Pendiente':selectedItem.datosServicio.os}</h2>
                        </div>
                        <div className='w-1/4'>
                            <span className='text-blue-700'>Fecha de Asignacion O.S.</span> 
                            <h2 className={`font-medium  ${!selectedItem.datosServicio?'text-orange-600':'text-gray-600' }`}>{!selectedItem.datosServicio? 'Pendiente':fechaCorta(selectedItem.datosServicio.fechaRegistro)}</h2>
                        </div> 
                        <div className='w-1/4'>
                            <span className='text-blue-700'>Asignado por</span> 
                            <h2 className={`font-medium  ${!selectedItem.datosServicio?'text-orange-600':'text-gray-600' }`}>{!selectedItem.datosServicio? 'Pendiente':selectedItem.datosServicio.usarioRegistro.nombre}</h2>
                        </div> 
                                  
                    </FormGroup>   
                    <FormGroup className='flex flex-row gap-10'>
                        <div className='w-1/4'> 
                            <span className='text-blue-700'>Tipo de servicio</span> 
                            <h2 className={`font-medium  ${!selectedItem.datosServicio?'text-orange-600':'text-gray-600' }`}>{!selectedItem.datosServicio? 'Pendiente':selectedItem.datosServicio.tipoServicio}</h2>
                        </div>
                        <div className='w-1/4'>
                            <span className='text-blue-700'>Certificado impreso</span> 
                            <h2 className={`font-medium  ${!selectedItem.datosServicio?'text-orange-600':'text-gray-600' }`}>{!selectedItem.datosServicio? 'Pendiente':selectedItem.datosServicio.certificadoImpreso}</h2>
                        </div> 
                        <div className='w-1/4'>
                            <span className='text-blue-700'>Certificado con contraseña</span> 
                            <h2 className={`font-medium  ${!selectedItem.datosServicio?'text-orange-600':'text-gray-600' }`}>{!selectedItem.datosServicio? 'Pendiente':selectedItem.datosServicio.certificadoPassword}</h2>
                        </div> 
                                  
                    </FormGroup> 
                                          
                  </CardHeader>
                  <CardHeader className="flex flex-col justify-between bg-white">
                    <CardTitle className='font-bold text-yellow-500'>Informacion del Anexo</CardTitle>
                    <FormGroup className='flex flex-row gap-10'>
                        <div className='w-1/4'> 
                            <span className='text-blue-700'>Periodo de calibración</span> 
                            <h2 className={`font-medium  ${!selectedItem.datosServicio?'text-orange-600':'text-gray-600' }`}>{!selectedItem.datosServicio? 'Pendiente':selectedItem.datosServicio.anexo.periodoCal} meses</h2>
                        </div>
                        <div className='w-1/4'>
                            <span className='text-blue-700'>Indicar proxima Calibración</span> 
                            <h2 className={`font-medium  ${!selectedItem.datosServicio?'text-orange-600':'text-gray-600' }`}>{!selectedItem.datosServicio? 'Pendiente':selectedItem.datosServicio.anexo.proximaCal}</h2>
                        </div> 
                        <div className='w-1/4'>
                            <span className='text-blue-700'>Declaración de conformidad</span> 
                            <h2 className={`font-medium  ${!selectedItem.datosServicio?'text-orange-600':'text-gray-600' }`}>{!selectedItem.datosServicio? 'Pendiente':selectedItem.datosServicio.anexo.declaracionConformidad}</h2>
                        </div> 
                        <div className='w-1/4'>
                            <span className='text-blue-700'>Descripción de conformidad</span> 
                            <h2 className={`font-medium  ${!selectedItem.datosServicio?'text-orange-600':'text-gray-600' }`}>{!selectedItem.datosServicio? 'Pendiente':selectedItem.datosServicio.anexo.descripcionDeclaracion}</h2>
                        </div> 
                                  
                    </FormGroup>   
                    <FormGroup className='flex flex-row gap-10'>
                        <div className='w-1/4'> 
                            <span className='text-blue-700'>Norma de referencia</span> 
                            <h2 className={`font-medium  ${!selectedItem.datosServicio?'text-orange-600':'text-gray-600' }`}>{!selectedItem.datosServicio? 'Pendiente':selectedItem.datosServicio.anexo.normaReferencia}</h2>
                        </div>
                        <div className='w-1/4'>
                            <span className='text-blue-700'>Ajuste de ser necesario</span> 
                            <h2 className={`font-medium  ${!selectedItem.datosServicio?'text-orange-600':'text-gray-600' }`}>{!selectedItem.datosServicio? 'Pendiente':selectedItem.datosServicio.anexo.ajuste}</h2>
                        </div>                                   
                    </FormGroup> 
                                          
                  </CardHeader>
                  <CardHeader className="flex flex-col justify-between bg-white">
                    <CardTitle className='font-bold text-yellow-500'>Información de entrega</CardTitle>
                    <FormGroup className='flex flex-row gap-10'>
                        <div className='w-1/4'> 
                            <span className='text-blue-700'>Tipo de entrega</span> 
                            <h2 className={`font-medium  ${!selectedItem.datosServicio?'text-orange-600':'text-gray-600' }`}>{!selectedItem.datosServicio? 'Pendiente':selectedItem.datosServicio.datosEntrega.tipoEntrega}</h2>
                        </div>
                        <div className='w-1/4'>
                            <span className='text-blue-700'>Tipo de envío</span> 
                            <h2 className={`font-medium  ${!selectedItem.datosServicio?'text-orange-600':'text-gray-600' }`}>{!selectedItem.datosServicio? 'Pendiente':selectedItem.datosServicio.datosEntrega.tipoEnvio}</h2>
                        </div> 
                        <div className='w-1/4'>
                            <span className='text-blue-700'>EL cliente envia su guia</span> 
                            <h2 className={`font-medium  ${!selectedItem.datosServicio?'text-orange-600':'text-gray-600' }`}>{!selectedItem.datosServicio? 'Pendiente':selectedItem.datosServicio.datosEntrega.guiaCliente}</h2>
                        </div> 
                        
                                  
                    </FormGroup>   
                    <FormGroup className='flex flex-row gap-10'>
                        <div className='w-1/3'> 
                            <span className='text-blue-700'>Razón social</span> 
                            <h2 className={`font-medium  ${!selectedItem.datosServicio?'text-orange-600':'text-gray-600' }`}>{!selectedItem.datosServicio? 'Pendiente':selectedItem.datosServicio.datosEntrega.razonSocial}</h2>
                        </div>
                        <div className='w-1/3'>
                            <span className='text-blue-700'>Dirección</span> 
                            <h2 className={`font-medium  ${!selectedItem.datosServicio?'text-orange-600':'text-gray-600' }`}>{!selectedItem.datosServicio? 'Pendiente':selectedItem.datosServicio.datosEntrega.direccion}</h2>
                        </div> 
                        <div className='w-1/3'>
                            <span className='text-blue-700'>Atención a</span> 
                            <h2 className={`font-medium  ${!selectedItem.datosServicio?'text-orange-600':'text-gray-600' }`}>{!selectedItem.datosServicio? 'Pendiente':selectedItem.datosServicio.datosEntrega.atencion}</h2>
                        </div>                                  
                    </FormGroup>                         
                  </CardHeader>
                  <CardHeader className="flex flex-col justify-between bg-white">
                    <CardTitle className='font-bold text-yellow-500'>Condiciones Físicas</CardTitle>
                    <FormGroup  className='flex flex-row gap-10'>
                    <div className='w-1/5'>
                    <span className='text-green-700 capitalize'>Entrada</span>
                    </div>
                    <div className='w-1/5'>
                    <span className='text-red-700 capitalize'>Salida</span>
                    </div>
                    
                    </FormGroup>
                    
                    {selectedItem.datosCondiciones?(Object.entries(selectedItem.datosCondiciones.condicionesFisicas).map(([key, value],index) => (
                      
                      <FormGroup key={key} className='flex flex-row gap-10'>
                        <div className='w-1/5'>
                          <span className='text-blue-700 capitalize'>{key}</span> 
                          <h2 className={`font-medium ${value.entrada === null ? 'text-orange-600' : 'text-gray-600'}`}>
                            {value.entrada}
                          </h2>
                        </div>
                        <div className='w-1/5'>
                        <span className='text-blue-700 capitalize'>{key}</span> 
                          <h2 className={`font-medium ${value.salida === null ? 'text-orange-600' : 'text-gray-600'}`}>
                            {value.salida === null ? 'Pendiente' : `${value.salida}`}
                          </h2>
                        </div>
                      </FormGroup>
                      
                      
                    ))):(<CardTitle className='font-bold text-orange-500'>Aun no se suben las condiciones fisicas</CardTitle>
                    )
                    
                    }
                    {selectedItem.datosCondiciones && (<FormGroup className='flex flex-row gap-10'>
                          <div className='w-1/4'> 
                              <span className='text-blue-700'>Responsable de la revisión de entrada</span> 
                              <h2 className={`font-medium  ${!selectedItem.datosCondiciones?'text-orange-600':'text-gray-600' }`}>{!selectedItem.datosCondiciones.responsableEntrada? 'Pendiente':selectedItem.datosCondiciones.responsableEntrada}</h2>
                          </div>
                          <div className='w-1/4'> 
                              <span className='text-blue-700'>Responsable de la revisión de salida</span> 
                              <h2 className={`font-medium  ${!selectedItem.datosCondiciones.responsableSalida?'text-orange-600':'text-gray-600' }`}>{!selectedItem.datosCondiciones.responsableSalida? 'Pendiente':selectedItem.datosCondiciones.responsableSalida}</h2>
                          </div>  
                      </FormGroup> )}
                  </CardHeader>
                  <CardHeader className="flex flex-col justify-between bg-white">
                    <CardTitle className='font-bold text-yellow-500'>Acciones</CardTitle>
                    <FormGroup className='flex flex-row gap-10 text-center'>
                        <div className='w-1/4 flex flex-col items-center'> 
                            <span className='text-blue-700'>Enviar notificación de arribo</span> 
                            <Button className="w-1/2 align-middle">Enviar</Button>
                        </div>
                        <div className='w-1/4 flex flex-col items-center'> 
                            <span className='text-blue-700'>Solicitar guia de envio</span> 
                            <Button className="w-1/2 align-middle">Enviar</Button>
                        </div>
                        <div className='w-1/4 flex flex-col items-center'> 
                            <span className='text-blue-700'>Calibrar</span> 
                            <Button className="w-1/2 align-middle">Comenzar</Button>
                        </div>
                        <div className='w-1/4 flex flex-col items-center'> 
                            <span className='text-blue-700'>Enviar correo de finalización</span> 
                            <Button className="w-1/2 align-middle">Comenzar</Button>
                        </div>
                        
                                  
                    </FormGroup>   
                                            
                  </CardHeader>

                
                  
                </Card>
              )}
            </ModalBody>
        </>
       
    )
}