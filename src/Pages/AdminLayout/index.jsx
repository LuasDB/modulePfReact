
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { Row, Col, Container } from "reactstrap"
import PerfectScrollbar from "perfect-scrollbar"
import 'perfect-scrollbar/css/perfect-scrollbar.css';


import NavBar from "../../Components/NavBar/index.jsx"
import Sidebar from "../../Components/Sidebar/index.jsx"
import { routes } from '../../routes.jsx'
import { useEffect, useRef } from "react"
import Solicitudes from "../../Views/Solicitudes/index.jsx";


export default function AdminLayout() {
  const containerRef = useRef(null)

  useEffect(() => {
    if (containerRef.current) {
      const ps = new PerfectScrollbar(containerRef.current,
        {
            wheelSpeed: 2,
            wheelPropagation: true,
            minScrollbarLength: 20
          }
      );

      return () => {
        ps.destroy();
      };
    }
  }, []);



  const getRoutes = (routes) => {
    return routes.map((route, index) => {
        return (
            <Route 
                path={route.path} 
                element={route.component} 
                key={index} 
            />
        );
        
    });
    }

    return (
        <>
            <div className='container-fluid'>
                <NavBar />
            </div>
            <div className="container-fluid">
                <Row>
                    <Col md={2} >
                        <Sidebar routes={routes} sectionTittle={'Pruebas de Fuga'} baseRoute={'/laboratorio/pruebas-fuga'}/>
                    </Col>
                    <Col md={10} ref={containerRef} className="">
                    <Routes>
                    {getRoutes(routes)}
                    
                    </Routes>
                    </Col>
                </Row>
            </div>
        </>
    )
}
