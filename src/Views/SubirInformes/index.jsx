import { useState } from "react";                
import { Card, CardBody, CardHeader, CardTitle, FormGroup, Label,Input,Button } from "reactstrap"
import { useDropzone } from 'react-dropzone';
import Swal from "sweetalert2";
import { server } from './../../db/servidor' 
import axios from "axios";

export default function SubirInformes(){
    const [files, setFiles] = useState([]);
    const [year, setYear] = useState('');
    const [archivos,setArchivos] = useState(null)

    const { getRootProps, getInputProps } = useDropzone({
        onDrop: acceptedFiles => {
            setFiles(acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })));
        }
    });

    const handleSubmit = async()=>{
        if (files.length === 0) {
            Swal.fire('Error', 'No has seleccionado ningún archivo.', 'error');
            return;
        }

        if (!year) {
            Swal.fire('Error', 'Por favor selecciona un año.', 'error');
            return;
        }
        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);  
        });
        formData.append('year', year);

        console.log('Estos son los files',files)

        try {
            const { data } = await axios.post(`${server}api/v1/services/uploads-informs/${year}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if(data.success){
                Swal.fire('Accion realizada!',data.message,'success')
            }
        } catch (error) {
            Swal.fire('Algo salio mal ', error,'error')
        }
    }

    return (
        <>
            <Card className='mt-4'>
                <CardHeader className='text-yellow-600'>
                    <CardTitle>
                        Subir achivos al servidor
                    </CardTitle>
                </CardHeader>
                <CardBody>
                    <FormGroup>
                        <Label className='text-yellow-700'>Indica el año del informe o los informes</Label>
                        <Input type="select" onChange={(e)=>setYear(e.target.value)}> 
                            <option value={''}>--Selecciona un año--</option>
                            <option value={2023}>2023</option>
                            <option value={2024}>2024</option>
                        </Input>
                    </FormGroup>
                    <FormGroup>
                    <Label>Subir archivos</Label>
                    <div {...getRootProps({ className: 'dropzone border p-5 text-center bg-gray-200 text-blue-300 rounded-lg cursor-pointer' })}>
                        <input {...getInputProps()} />
                        <p>Arrastra los archivos aquí, o haz clic para seleccionar</p>
                    </div>
                </FormGroup>
                <FormGroup>
                    {files.length > 0 && (
                        <div>
                            <h5>Archivos seleccionados:</h5>
                            <ul>
                                {files.map((file, index) => (
                                    <li key={index}>
                                        {file.name} 
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </FormGroup>
                <Button color="primary" onClick={handleSubmit}>Subir archivos</Button>

                </CardBody>
            </Card>
        </>
    )
}