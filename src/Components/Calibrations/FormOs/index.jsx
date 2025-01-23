import { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { Form, Row, Col, Button, Card, CardHeader, CardBody } from 'reactstrap';
import CustomFormGroup from '../../utilitys/CustomFormGroup';
import CenteredSpinner from '../../CenteredSpinner';
import Swal from 'sweetalert2';
import axios from 'axios';
import { server } from '../../../db/servidor';
import EquiposSelector from '../EquiposSelector';

export default function FormOs() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
      permisionario: {
          razonSocial: '',
          domicilio: ''
      },
      anexo: {
          proximaCal: '',
          periodoCal: '',
          declaracionConformidad: '',
          descripcionDeclaracion: '',
          normaReferencia: '',
          ajuste: ''
      },
      datosEntrega: {
          razonSocial: '',
          direccion: '',
          seguro: '',
          guiaCliente: '',
          tipoEnvio: '',
          tipoEntrega: '',
          atencion: ''
      },
      contacto: {
          nombre: '',
          correoContacto: '',
          telefonoContacto: ''
      },
      os: '',
      tipoServicio: '',
      certificadoImpreso: '',
      certificadoPassword: '',
      fechaRegistro: '',
      usarioRegistro: {
          nombre: '',
          correo: ''
      }
  });

  const [formError, setFormError] = useState({});
  const [isNew, setIsNew] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isParamsConfirmed, setIsParamsConfirmed] = useState(false);

  useEffect(() => {
      try {
          setLoading(true);
          setIsNew(id === 'new');
      } finally {
          setLoading(false);
          setIsParamsConfirmed(true);
      }
  }, [id]);

  const handleChange = (field, subfield) => (e) => {
      const value = e.target.value;
      setFormData((prevData) => ({
        ...prevData,
        [field]: {
          ...prevData[field],
          [subfield]: value,
        },
      }));

      if(value.trim()){
        setFormError({...formError, [field]: { ...formError[field], [subfield]: '' }});
      }
    };

    const validateForm = () => {
      const errors = {};
      Object.keys(formData).forEach(field => {
        if (typeof formData[field] === 'object') {
          Object.keys(formData[field]).forEach(subfield => {
            if (!formData[field][subfield].trim()) {
              if (!errors[field]) errors[field] = {};
              errors[field][subfield] = 'Este campo es obligatorio';
            }
          });
        } else {
          if (!formData[field].trim()) {
            errors[field] = 'Este campo es obligatorio';
          }
        }
      });
      setFormError(errors);
      return Object.keys(errors).length === 0;
    };
  

  const handleSubmit = async (e) => {
      e.preventDefault();
      if (!validateForm()) {
          Swal.fire('Hay campos vacíos', 'Por favor asegúrate de llenar todos los campos', 'error');
          return;
      }

      const currentDate = new Date();
      formData.fechaRegistro = currentDate.toISOString();
      formData.usarioRegistro = {
          nombre: 'Monica Mingia',
          correo: 'monica.mungia@siradiacion.com.mx'
      };
      const jsonData = {
          equiposList: selectedEquipos,
          data: {
            ...formData
          }
        };

      Swal.fire({
          position: "center",
          icon: "question",
          title: "ALTA EN BASE DE DATOS",
          html: "¿Revisaste que la información sea correcta?",
          showConfirmButton: true,
          showCancelButton: true,
          confirmButtonText: 'Sí, claro',
          cancelButtonText: 'No, espera'
      }).then(async (result) => {
          if (result.isConfirmed) {
              try {
                  // const { data } = await axios.post(`${server}api/v1/calibrations/${currentDate.getFullYear()}`, jsonData, {
                  //     headers: {
                  //         'Content-Type': 'application/json',
                  //     }
                  // });
                  console.log(jsonData)

                  // if (data.success) {
                  //     Swal.fire({
                  //         position: "center",
                  //         icon: "success",
                  //         title: "Se creó correctamente",
                  //         html: `${data.message}`,
                  //         showConfirmButton: true,
                  //     }).then(result => {
                  //         if (result.isConfirmed) {
                  //             navigate('/laboratorio/calibraciones/arribos');
                  //         }
                  //     });
                  // }
              } catch (error) {
                  Swal.fire('Algo salió mal', `No se pudo subir la información: ${error.message}`, 'error');
              }
          }
      });
  };

  //de prueba
  const [selectedEquipos, setSelectedEquipos] = useState([]);
  const equiposDisponibles = [
      { id: "678c98cb9b497e58a7edba4c", cliente: "Equipo 1", marca:'Ludlum',modelo:'12-4',serie:'12345' },
      { id: "678c4e2bc027bd2c343dbf93", cliente: "Equipo 2", marca:'Ludlum',modelo:'12-4',serie:'44444' },
      { id: "678c534f9b497e58a7edba4a", cliente: "Equipo 3", marca:'Ludlum',modelo:'12-4',serie:'111111' },
      // Agrega más equipos según sea necesario
    ];
    
  const handleSelectEquipo = (equipo) => {
      if (!selectedEquipos.some(e => e.id === equipo.id)) {
      setSelectedEquipos([...selectedEquipos, equipo]);
      }
  };

  const handleRemoveEquipo = (id) => {
      console.log(id)
      setSelectedEquipos(selectedEquipos.filter(equipo => equipo.id !== id));

  };
     
  return (
    <>
      {loading && (<CenteredSpinner />)}
      {isParamsConfirmed && (
          <Card className='m-2 rounded-xl shadow mt-4 mb-2'>
              <CardHeader>
                  <h3 className='text-blue-600'>{isNew ? 'Datos para la O.S.' : 'Editar Equipo'}</h3>
              </CardHeader>
              <CardBody className='p-2'>
              <Form onSubmit={handleSubmit} className="text-yellow-500">
                <Row>
                  <h3 className='text-blue-600'>Permisionario</h3>

                  <Col md={6}>
                    <CustomFormGroup
                      label="Razón Social"
                      value={formData.permisionario.razonSocial}
                      onChange={handleChange('permisionario', 'razonSocial')}
                      error={formError.permisionario?.razonSocial}
                    />
                  </Col>
                  <Col md={6}>
                    <CustomFormGroup
                      label="Domicilio"
                      value={formData.permisionario.domicilio}
                      onChange={handleChange('permisionario', 'domicilio')}
                      error={formError.permisionario?.domicilio}
                    />
                  </Col>
                </Row>
                <Row>
                  <h3 className='text-blue-600'>Anexo</h3>
                  <Col md={6}></Col>


                </Row>

                <CustomFormGroup
                  label="¿Indicar Próxima Calibración en certificado?"
                  type={'select'}
                  options={[{value:'Sí',label:'Sí'}, {value:'No',label:'No'}]}
                  value={formData.anexo.proximaCal}
                  onChange={handleChange('anexo', 'proximaCal')}
                  error={formError.anexo?.proximaCal}
                />
                <CustomFormGroup
                  label="Periodo Calibración"
                  type={'select'}
                  options={[{value:12,label:'12 meses'}, {value:6,label:'6 meses'}]}
                  value={formData.anexo.periodoCal}
                  onChange={handleChange('anexo', 'periodoCal')}
                  error={formError.anexo?.periodoCal}
                />
                <CustomFormGroup
                  label="Declaración Conformidad"
                  value={formData.anexo.declaracionConformidad}
                  onChange={handleChange('anexo', 'declaracionConformidad')}
                  error={formError.anexo?.declaracionConformidad}
                />
                <CustomFormGroup
                  label="Descripción Declaración"
                  value={formData.anexo.descripcionDeclaracion}
                  onChange={handleChange('anexo', 'descripcionDeclaracion')}
                  error={formError.anexo?.descripcionDeclaracion}
                />
                <CustomFormGroup
                  label="Norma Referencia"
                  value={formData.anexo.normaReferencia}
                  onChange={handleChange('anexo', 'normaReferencia')}
                  error={formError.anexo?.normaReferencia}
                />
                <CustomFormGroup
                  label="Ajuste"
                  value={formData.anexo.ajuste}
                  onChange={handleChange('anexo', 'ajuste')}
                  error={formError.anexo?.ajuste}
                />

                <h3 className='text-blue-600'>Datos Entrega</h3>
                <CustomFormGroup
                  label="Razón Social"
                  value={formData.datosEntrega.razonSocial}
                  onChange={handleChange('datosEntrega', 'razonSocial')}
                  error={formError.datosEntrega?.razonSocial}
                />
                <CustomFormGroup
                  label="Dirección"
                  value={formData.datosEntrega.direccion}
                  onChange={handleChange('datosEntrega', 'direccion')}
                  error={formError.datosEntrega?.direccion}
                />
                <CustomFormGroup
                  label="Seguro"
                  value={formData.datosEntrega.seguro}
                  onChange={handleChange('datosEntrega', 'seguro')}
                  error={formError.datosEntrega?.seguro}
                />
                <CustomFormGroup
                  label="Guía Cliente"
                  value={formData.datosEntrega.guiaCliente}
                  onChange={handleChange('datosEntrega', 'guiaCliente')}
                  error={formError.datosEntrega?.guiaCliente}
                />
                <CustomFormGroup
                  label="Tipo Envío"
                  value={formData.datosEntrega.tipoEnvio}
                  onChange={handleChange('datosEntrega', 'tipoEnvio')}
                  error={formError.datosEntrega?.tipoEnvio}
                />
                <CustomFormGroup
                  label="Tipo Entrega"
                  value={formData.datosEntrega.tipoEntrega}
                  onChange={handleChange('datosEntrega', 'tipoEntrega')}
                  error={formError.datosEntrega?.tipoEntrega}
                />
                <CustomFormGroup
                  label="Atención"
                  value={formData.datosEntrega.atencion}
                  onChange={handleChange('datosEntrega', 'atencion')}
                  error={formError.datosEntrega?.atencion}
                />

                <h3 className='text-blue-600'>Contacto</h3>
                <CustomFormGroup
                  label="Nombre"
                  value={formData.contacto.nombre}
                  onChange={handleChange('contacto', 'nombre')}
                  error={formError.contacto?.nombre}
                />
                <CustomFormGroup
                  label="Correo Contacto"
                  value={formData.contacto.correoContacto}
                  onChange={handleChange('contacto', 'correoContacto')}
                  error={formError.contacto?.correoContacto}
                />
                <CustomFormGroup
                  label="Teléfono Contacto"
                  value={formData.contacto.telefonoContacto}
                  onChange={handleChange('contacto', 'telefonoContacto')}
                  error={formError.contacto?.telefonoContacto}
                />

                <h3 className='text-blue-600'>Otros</h3>
                <CustomFormGroup
                  label="OS"
                  value={formData.os}
                  onChange={handleChange('formData', 'os')}
                  error={formError.os}
                />
                <CustomFormGroup
                  label="Tipo Servicio"
                  value={formData.tipoServicio}
                  onChange={handleChange('formData', 'tipoServicio')}
                  error={formError.tipoServicio}
                />
                <CustomFormGroup
                  label="Certificado Impreso"
                  value={formData.certificadoImpreso}
                  onChange={handleChange('formData', 'certificadoImpreso')}
                  error={formError.certificadoImpreso}
                />
                <CustomFormGroup
                  label="Certificado Password"
                  value={formData.certificadoPassword}
                  onChange={handleChange('formData', 'certificadoPassword')}
                  error={formError.certificadoPassword}
                />
                <CustomFormGroup
                  label="Fecha Registro"
                  value={formData.fechaRegistro}
                  onChange={handleChange('formData', 'fechaRegistro')}
                  error={formError.fechaRegistro}
                />
                <CustomFormGroup
                  label="Usuario Registro"
                  value={formData.usarioRegistro.nombre}
                  onChange={handleChange('usarioRegistro', 'nombre')}
                  error={formError.usarioRegistro?.nombre}
                />
                <CustomFormGroup
                  label="Correo Usuario Registro"
                  value={formData.usarioRegistro.correo}
                  onChange={handleChange('usarioRegistro', 'correo')}
                  error={formError.usarioRegistro?.correo}
                />

<button type="submit" className="btn btn-primary">Enviar</button>
              </Form>
              </CardBody>
          </Card>
      )}
    </>
  );
}
