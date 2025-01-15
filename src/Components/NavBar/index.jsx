import {useContext, useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar, NavbarBrand, Nav, NavItem, NavLink,DropdownMenu,DropdownItem,DropdownToggle,Dropdown} from 'reactstrap';
import { FaHome, FaUser, FaCog } from 'react-icons/fa'; // Importa los iconos que necesites
import { AuthContext } from '../../context/AuthContext'

import './NavBar.css'


export default function NavBar(){
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { logout , user  } = useContext(AuthContext)

  const toggle = () => setDropdownOpen(!dropdownOpen);
  const handleLogOut = ()=>{
    logout()
  }

  
    return (
      <div className=''>
       <Navbar color="light" light expand="md" className='rounded-xl shadow mt-4 mb-2' >
      <NavbarBrand href="/">
        <img src="https://siradiacion.com.mx/wp-content/uploads/2022/04/Logo-SIRSA-2.svg" alt="Logo" className='w-44' />
      </NavbarBrand>
      <Nav className="ml-auto" navbar>
        <NavItem className='cursor-pointer nav-item w-14 text-[25px] text-gray-400 hover:text-gray-700'
        onClick={()=>navigate('/laboratorio')}>
          
          <FaHome />
        </NavItem>
        <NavItem>
          <NavLink >
          <Dropdown nav isOpen={dropdownOpen} toggle={toggle}>
          <DropdownToggle tag="a" className="nav-link">
          <FaUser className='flex cursor-pointer'/>
        </DropdownToggle>
        <DropdownMenu>
        <DropdownItem className='hover:bg-slate-400'>{user.nombre}</DropdownItem>
        <DropdownItem divider />
        <DropdownItem onClick={handleLogOut} className='hover:bg-slate-400'>Salir</DropdownItem>
  
        </DropdownMenu>
      </Dropdown>
            
          </NavLink>
        </NavItem>
       
      </Nav>
      </Navbar>

      </div>
     
       
    )
}