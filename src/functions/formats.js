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

    // Extraer el día, mes y año en UTC
    const dia = fechaObj.getUTCDate().toString().padStart(2, '0'); // Día con dos dígitos
    const mes = mesesAbreviados[fechaObj.getUTCMonth()]; // Mes abreviado
    const año = fechaObj.getUTCFullYear().toString().slice(-2); // Últimos dos dígitos del año

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

function calcularFechaObjetivo(fechaInicial, dias, diasFestivos) {
  let fecha = new Date(fechaInicial);
  let diasContados = 0;

  while (diasContados < dias) {
      fecha.setDate(fecha.getDate() + 1);

      // Comprueba si es fin de semana
      if (fecha.getDay() === 0 || fecha.getDay() === 6) {
          continue; // Salta el día si es sábado o domingo
      }

      // Comprueba si es un día festivo
      if (diasFestivos.some(festivo => {
          return fecha.toISOString().split('T')[0] === festivo;
      })) {
          continue; // Salta el día si es festivo
      }

      diasContados++;
  }

  return fecha;
}

// Ejemplo de uso:
const fechaInicial = '2025-04-16'; // Fecha inicial
const dias = 5; // Días laborables a añadir
const diasFestivos = [
    '2025-01-01', // Año Nuevo
    '2025-02-03',// Día de la Constitución
    '2025-03-17', // Natalicio de Benito Juárez
    '2025-05-01', // Día del Trabajo
    '2025-09-16', // Día de la Independencia  
    '2025-11-17', // Revolución Mexicana
    '2025-12-25'  // Navidad
];
const fechaObjetivo = calcularFechaObjetivo(fechaInicial, dias, diasFestivos);
console.log(fechaObjetivo.toISOString().split('T')[0]); // Muestra la fecha en formato 'YYYY-MM-DD'



  export {formatFecha,orderByProperty,fechaCorta}