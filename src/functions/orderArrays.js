function sortByStatus(array) {
    const statusOrder = [
      'Arribo',
      'Con O.S.',
      'En calibración',
      'Calibrado',
      'En espera de envio'
    ];
  
    return array.sort((a, b) => {
      return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
    });
  }

  export {
    sortByStatus
  }