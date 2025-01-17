import  { useState, useEffect } from 'react'
import CenteredSpinner from './../../Components/CenteredSpinner'
import TablaArribos from '../../Components/TablaArribos'

export default function Arribos() {

    const [selectedYear,setSelectedYear] = useState()
    const [loading,setLoading] = useState(false)
    const handleUpdateTable = (year)=>{
        setSelectedYear(year)
    }
        


    return (
        <>
        {loading && (<CenteredSpinner />)}
         {!loading && (<>
    
        <div className='flex flex-col basis-4 scroll-y' > 
            <TablaArribos 
            pathNew={'/laboratorio/calibraciones/arribos/new'} 
            title={'Arribos'} 
            selectedYear={selectedYear}
            data={['uno','dos']}
            encabezados={['Encabezado1','Encabezado2']}
            handleUpdateTable={handleUpdateTable}
            />
    

        </div>
    </>)}

        </>
   
        
    )
}