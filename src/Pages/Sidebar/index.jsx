import { Card, CardBody, CardHeader } from 'reactstrap'
import { Link } from 'react-router-dom'
import PropTypes from "prop-types";

import './Sidebar.css'
import { useState } from 'react';

export default function Sidebar({ routes }) {
    const [selected, setSelected ] = useState(null)
    const [tittle, setTittle] = useState('Pruebas de fuga')

    const handleSelected = (index,item)=>{
        setSelected(index)
        setTittle(item.name)
    }
    return (
        <Card className='h-auto rounded-xl shadow mt-4 mb-4'>
            <CardHeader>
                {tittle}
            </CardHeader>
            <CardBody>            
                <ul className='list-none'>
                    {routes?.map((item, index) => {
                        if (item.redirect) return null;

                        if(item.type === 'menu'){
                            return (
                            <li className={`border-solid border-1  shadow-sm my-6 p-2 rounded-md cursor-pointer ${selected === index ? 'bg-gray-500 text-yellow-600' : '' } `}
                            key={index}
                            onClick={()=>handleSelected(index,item)}
                            > 
                            <Link  to={item.path} className={` flex items-center space-x-4 no-underline ${selected === index ? 'bg-gray-500 text-yellow-400' : 'text-gray-950' } `}>
                                <div> {item.icon}</div>
                                <div> {item.name}</div>
                            </Link>
                            </li>
                        )
                        }

                      
                    })}
                </ul>
            </CardBody>
        </Card>
    )
}

Sidebar.propTypes = {
    routes: PropTypes.arrayOf(PropTypes.object)
}
