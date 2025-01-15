
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import NavBar from "../../Components/NavBar/index.jsx"
import { Col, Row,Label, Card } from "reactstrap";
import MonitorIcon from "../../assets/icons/monitor.svg?react";
import PfIcon from "../../assets/icons/pruebasFuga.svg?react";
import { fill } from "pdf-lib";


export default function Home(){
  const { user, loading } = useContext(AuthContext)
  const navigate = useNavigate()

    return (
      <>
      {user && (
        <>
        <div className='container-fluid'>
          <NavBar />
        </div>
        <div className="container-fluid flex flex-col items-center justify-center mt-4">
          <h1 className="text-gray-600 mt-6 mb-6">Bienvenido {user.nombre}</h1>
          <p>Servicios de Laboratorio </p>
          <Row className="justify-content-center w-full m-4">
            <Col md="4">
              <Card className="flex flex-col items-center justify-center p-4 cursor-pointer hover:scale-105 transition-transform duration-300" onClick={()=>navigate('/laboratorio/calibraciones')}>
                <Label className="text-blue-700 fotnt-bold">Calibraciones</Label> 
                <MonitorIcon className="h-[200px] m-0 p-0"/>
              </Card>
            </Col>
            <Col md="4">
              <Card className="flex flex-col items-center justify-center p-4 cursor-pointer hover:scale-105 transition-transform duration-300"
              onClick={()=>navigate('/laboratorio/pruebas-fuga')}
              >

                <Label className="text-blue-700 fotnt-bold">Pruebas de fuga</Label> 
                <PfIcon className="h-[200px] m-0 p-0"  />
              </Card>
            </Col>
          </Row>


        </div>
        </>
       
      )}
        
      </>
        
      );
}