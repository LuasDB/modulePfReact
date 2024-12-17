import { FaClipboardList,FaRegChartBar,FaBook    } from 'react-icons/fa'

import { BsScrewdriver  } from "react-icons/bs";

import Laboratorio from './Views/Laboratorio';
import Solicitudes from './Views/Solicitudes';
import { FormLicences,FormDetectors,FormDevices,FormSources,FormPoes } from './Components/Forms/index.jsx'
import { FormNewRequest } from './Components/FormNewRequest'
import RecepcionFrotis from './Views/RecepcionFrotis/index.jsx';
import AnalisisPf  from './Views/AnalisisPf/index.jsx';
import { Bitacora } from './Views/Bitacora/index.jsx';
import SubirInformes from './Views/SubirInformes/index.jsx';
import FormNewCustomer from './Components/FormNewCustomer/index.jsx';
import FormAnalisis from './Components/FormAnalisis/index.jsx'


const routes = [
    {
        path: "/solicitudes",
        name: "Solicitudes",
        icon: <FaClipboardList />,
        component: <Solicitudes />,
        type:'menu'
    },
    {
        path: "/reception-frotis",
        name: "Recepción Frotis ",
        icon: <BsScrewdriver />,
        component: <RecepcionFrotis />,
        type:'menu'
    },
    {
        path: "/analisis",
        name: "Análisis de P.F.",
        icon: <FaRegChartBar />,
        component: <AnalisisPf />,
        type:'menu'
    },
    {
        path: "/bitacora",
        name: "Bitacora de P.F.",
        icon: <FaBook  />,
        component: <Bitacora />,
        type:'menu'
    },
    {
        path: "/laboratorio",
        name: "Laboratorio de P.F.",
        icon: <FaBook  />,
        component: <Laboratorio />,
        type:'menu'
    },
    {
        path: "/forms/licence/:id",
        name: "Licencias P.F.",
        icon: <FaClipboardList />,
        component: <FormLicences />
    },
    {
        path: "/forms/detectors/:id",
        name: "Licencias P.F.",
        icon: <FaClipboardList />,
        component: <FormDetectors />
    },
    {
        path: "/forms/devices/:id",
        name: "Licencias P.F.",
        icon: <FaClipboardList />,
        component: <FormDevices />
    },
    {
        path: "/forms/sources/:id",
        name: "Licencias P.F.",
        icon: <FaClipboardList />,
        component: <FormSources />
    },
    {
        path: "/forms/poes/:id",
        name: "Licencias P.F.",
        icon: <FaClipboardList />,
        component: <FormPoes />
    },
    {
        path: "/forms/solicitudes/:id",
        name: "Nueva Solicitud",
        icon: <FaClipboardList />,
        component: <FormNewRequest />
    },
    {
        path: "/forms/clientes/:id",
        name: "Clientes",
        icon: <FaClipboardList />,
        component: <FormNewCustomer />
    },
    //SUbida de archivos
    {
        path: "/subir-informes",
        name: "Clientes",
        icon: <FaClipboardList />,
        component: <SubirInformes />
    },
    // //EDICIÓN DE INFORMES 
    {
        path: "/editar-informes/:a/:num",
        name: "Editar informe",
        icon: <FaClipboardList />,
        component: <FormAnalisis />,
        type:'menu'
    },
];



export { routes }