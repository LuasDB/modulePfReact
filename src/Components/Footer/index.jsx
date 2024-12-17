import './Footer.css'

export default function Footer (props) {
  const { data } = props

  return (
    <footer className='footer'>
      <ul>
      {data.map((item,key) =>{
      (<div>{item}</div>)
        
      })}
      </ul>
    </footer>
  )
}