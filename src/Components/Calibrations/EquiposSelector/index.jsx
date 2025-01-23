import  { useState } from 'react';
import { Button, Card, CardHeader,CardTitle,CardBody} from 'reactstrap'
import { FaPlusCircle, FaEdit, FaRegTrashAlt,FaEye } from 'react-icons/fa';


export default function EquiposSelector(props){

    const { selectedEquipos,handleSelectEquipo,handleRemoveEquipo,equiposDisponibles} = props

    const [encabezados,setEncabezados] = useState([
        'Cliente','Marca','Modelo','Serie'
    ])
    
  



  return (
    <Card className='m-2 rounded-xl shadow mt-4 mb-2'>
        <CardHeader className="flex flex-col justify-between bg-white">
        <CardTitle className='font-bold text-yellow-500'>Selecciona los equipos para esta orden de servicio:</CardTitle>
        <ul>
        {equiposDisponibles.map((equipo) => (
          <li key={equipo.id} className='m-1'>
            {`${equipo.cliente}  Marca:${equipo.marca}  Modelo:${equipo.modelo}  Serie:${equipo.serie}`}{" "}
            <Button onClick={() => handleSelectEquipo(equipo)}>Agregar</Button>
          </li>
        ))}
      </ul>
        </CardHeader>
      
      

      {selectedEquipos.length > 0 && (
        <CardBody className="text-[12px]">
              <div className="overflow-x-auto overflow-y-hidden">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      {encabezados?.map((encabezado, index) => (
                        <th key={`${index}-e`} className={`px-0 py-2 w-1/${4} text-center`}>{encabezado}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedEquipos?.map((item,index1) => (
                      <tr key={`${index1}-${item.id}`} className="border-b-2 border-stone-200 hover:bg-gray-100">
                        <td className={`px-0 py-2 w-1/${4} text-center`}>{item.cliente}</td>
                        <td className={`px-0 py-2 w-1/${4} text-center`}>{item.marca}</td>
                        <td className={`px-0 py-2 w-1/${4} text-center`}>{item.modelo}</td>
                        <td className={`px-0 py-2 w-1/${4} text-center`}>{item.serie}</td>      
                        <td>
                            <Button className="bg-red-400 text-white" size="sm" onClick={()=>handleRemoveEquipo(item.id)}>
                            <FaRegTrashAlt />
                            </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
      )}
    </Card>
  );
}

