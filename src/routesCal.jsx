import { FaBoxOpen } from 'react-icons/fa';

//Componentes Views Calibraciones
import Arribos from './ViewsCalibration/Arribos';


const routes = [
   {
    path: "/arribos",
    name: "Arribos",
    icon: <FaBoxOpen />,
    component: <Arribos />,
    type:'menu'
    },
    {}
]

export { routes }