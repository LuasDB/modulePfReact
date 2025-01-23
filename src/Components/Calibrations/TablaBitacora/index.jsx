import { Button, Card, CardBody, CardFooter, CardHeader, Input, Label, Modal,CardTitle,
  FormGroup, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { FaPlusCircle, FaEdit, FaRegTrashAlt,FaEye } from 'react-icons/fa';
import { Link } from "react-router-dom";
import { useEffect,useState } from "react";
import {fechaCorta, setStatusColor} from '../../../functions/formats'
import VerServicio from "../VerServicio";


export default function TablaBitacora(props){  

  const { pathNew,data,encabezados,title,selectedYear,handleUpdateTable,columnas} = props

  const [years,setYears] = useState([])
  const [searchValue,setSearchValue] = useState('')
  const [isFirst,setIsFirst] = useState(true)
  const [filtered,setFiltered] = useState(data || [])

  const [modal,setModal] = useState(false)
  const [selectedItem,setSelectedItem] = useState(null)

  useEffect(()=>{
    setYears(yearsGenerate())
    setFiltered(data)

  },[isFirst,data])
    

  const yearsGenerate = ()=>{
    const year = new Date().getFullYear();

    const years = [];
    for (let i = 2023; i <= year; i++) {
      years.push(i);
    }   
    return years;
  }
  const handleChangeSearch = (e)=>{
    e.preventDefault();
    const { value } = e.target;
    setSearchValue(value)

    setFiltered(data.filter(item=>
      item.data[0].toLowerCase().includes(value.toLowerCase()) ||
      item.data[1].toLowerCase().includes(value.toLowerCase()) ||
      item.data[2].toLowerCase().includes(value.toLowerCase()) ||
      item.data[3].toLowerCase().includes(value.toLowerCase()) 
    ))
  }
  const toggleModal = ()=>{
    setModal(!modal)
  }

  const handleViewClick = (item)=>{
    console.log('[VIEW]:',item)
    setSelectedItem(item.content)
    toggleModal()
  }

  

    return (
        <>
          <Card className="m-2 rounded-xl shadow mt-4 mb-2 ">
            <CardHeader className="flex flex-col md:flex-row justify-between items-center border-0">
              <Button className="flex place-items-center w-full max-w-xs md:w-[150px] md:text-sm justify-around mb-2 md:mb-0" tag={Link} to={pathNew}>
                <FaPlusCircle />
                <p>Nuevo arribo</p>
              </Button>
              <Label className="text-yellow-500 font-bold text-center md:text-right">{title}</Label>
            </CardHeader>
            <CardHeader className="flex flex-col md:flex-row justify-between items-center border-0">
              <Input type="select" onChange={(e)=>handleUpdateTable(e.target.value)}>
                <option value={''}>--Seleccion un año--</option>
                {years?.map((item,index)=>(
                  <option key={`${index}-y`} value={item}>{item}</option>
                  ))}
              </Input>
            </CardHeader>
            <CardFooter>
              <Input type="text" placeholder="Buscar por..." onChange={handleChangeSearch} value={searchValue} />
            </CardFooter>
            <CardBody className="text-[12px]">
              <div className="overflow-x-auto overflow-y-hidden">
                <table className="min-w-full">
                  <thead>
                    <tr>
                      {encabezados?.map((encabezado, index) => (
                        <th key={`${index}-e`} className={`px-0 py-2 w-1/${columnas} text-center`}>{encabezado}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered?.map((item,index1) => (
                      <tr key={`${index1}-${item.id}`} className="border-b-2 border-stone-200 hover:bg-gray-100">
                        {item.data?.map((data2, index) => (
                          <td key={`${index}-f`} className={`px-0 py-2 w-1/${columnas} text-center`}><p className={`${setStatusColor(data2)}`}>{data2}</p></td>
                        ))}
                        <td>
                       
                          </td>
                        <td className={`px-4 py-2 space-x-3 w-1/${columnas}`}>
                          <Button className="bg-cyan-950 text-white" size="sm" tag={Link} to={`${pathNew}${selectedYear}/${item.id}`}>
                            <FaEdit />
                          </Button>
                          <Button className="bg-green-950 text-white" size="sm" onClick={() => handleViewClick(item)}>
                            <FaEye />
                          </Button>
                          
                          <Button className="bg-red-400 text-white" size="sm" >
                            <FaRegTrashAlt />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>

          <Modal isOpen={modal} toggle={toggleModal} size="xl" centered={true} fullscreen>
            <VerServicio toggleModal={toggleModal} selectedItem={selectedItem}/>
            <ModalFooter>
              <Button color="secondary" onClick={toggleModal}>Cerrar</Button>
            </ModalFooter>
          </Modal>
        </>
      );
}