import { FaRegListAlt  } from 'react-icons/fa';

//Componentes Views Calibraciones
import BitacoraCalibracion from './ViewsCalibration/BitacoraCalibracion';
import FormNewEquipment from './Components/Calibrations/FormNewEquipment'


const routes = [
    //Views
   {
    path: "/bitacora",
    name: "Bitacora Calibracion",
    icon: <FaRegListAlt />,
    component: <BitacoraCalibracion />,
    type:'menu'
    },
    //Formularios
    {
    path: "/forms/arribo/:id",
    name: "Nuevo Arribo",
    icon: <FaRegListAlt />,
    component: <FormNewEquipment />,

    },
    
]

export { routes }