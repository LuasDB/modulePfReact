
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { Row, Col, Container } from "reactstrap"
import PerfectScrollbar from "perfect-scrollbar"
import 'perfect-scrollbar/css/perfect-scrollbar.css';


import NavBar from "../NavBar"
import Sidebar from "../Sidebar"
import { routes } from '../../routes.jsx'
import { useEffect, useRef } from "react"


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
            console.log(route.path)
            return (
            <Route path={route.path} element={route.component} key={index} exact />
        )})
    }

    return (
        <>
            <Container className='w-full'>
                <NavBar />
            </Container>
            <Container>
                <Row>
                    <Col md={3} >
                        <Sidebar routes={routes} />
                    </Col>
                    <Col md={9} ref={containerRef} className="">
                    <Routes>
                    {getRoutes(routes)}
                    </Routes>
                    </Col>
                </Row>
            </Container>
        </>
    )
}
