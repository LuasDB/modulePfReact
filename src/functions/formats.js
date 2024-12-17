function formatFecha(fecha) {

    const meses = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    fecha = new Date(fecha)
  
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = meses[fecha.getMonth()];
    const año = fecha.getFullYear();
  
    return `${dia} de ${mes} del ${año}`;
  }

function fechaCorta(fecha){
 
    // Definir los meses abreviados en español
    const mesesAbreviados = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

    // Crear un objeto Date a partir de la fecha proporcionada
    const fechaObj = new Date(fecha);

    // Extraer el día, mes y año
    const dia = fechaObj.getDate().toString().padStart(2, '0'); // Día con dos dígitos
    const mes = mesesAbreviados[fechaObj.getMonth()]; // Mes abreviado
    const año = fechaObj.getFullYear().toString().slice(-2); // Últimos dos dígitos del año

    // Retornar la fecha en el formato deseado
    return `${dia}-${mes}-${año}`;

}


 
function orderByProperty(array,property){
  array.sort((a,b)=>{
    if(a[property]  < b[property]){
      return -1
    }
    if(a[property] > b[property]){
      return 1
    }
    return 0
  })
  return array
}




  export {formatFecha,orderByProperty,fechaCorta}