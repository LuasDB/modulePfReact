async function modificarPDF({ letter }) {
    try {
      // Leer el archivo PDF original
      const pdfBytes = await fsP.readFile('./scripts/machote.pdf');
      const pdfDoc = await PDFDocument.load(pdfBytes);
  
      // Obtener la primera página del documento
      const page = pdfDoc.getPage(0);
      console.log('Iniciado')
  
  
  
      // Fecha
      const fecha = new Date();
  
      page.drawText(`Mexico City,Mexico ${formatearFecha(fecha)}`, {
        x: 360,
        y: page.getHeight() - 120,
        size: 14,
        color: rgb(0, 0, 0),
      });
  
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
       // Texto a centrar
       const texto = `${capitalizeFirstLetter(letter.user.nombre)} ${letter.user.apellido_paterno.toUpperCase()} ${letter.user.apellido_materno.toUpperCase()}`
  
       // Calcular el ancho del texto en la fuente y el tamaño de fuente dado
       const textSize = font.widthOfTextAtSize(texto, 13);
  
       // Obtener el ancho de la página
       const pageWidth = page.getWidth();
  
       // Calcular la posición x para centrar el texto
       const xPos = (pageWidth - textSize) / 2;
      page.drawText(texto, {
        x: xPos+30,
        y: page.getHeight() - 210,
        size: 15,
        color: rgb(0, 0, 0),
        font: font
      });
  
  
      page.drawText(letter.association.nombre, {
        x: 150,
        y: page.getHeight() - 272,
        size: 13,
        color: rgb(0, 0, 0),
        font:font
  
      });
  
      let renglon=20
  
      page.drawText(`Therefore, ${letter.user.sexo==='MASCULINO'?'he':'she'} has the necessary authorization to participate`, {
        x: 150,
        y: page.getHeight() - 315 -renglon,
        size: 15,
        color: rgb(0, 0, 0)
      });
      page.drawText(`in the following event:`, {
        x: 150,
        y: page.getHeight() - 330 -renglon,
        size: 15,
        color: rgb(0, 0, 0)
      });
      //Table
      let xData = 190
      let yLine = 360+renglon
      let carriet = 25
  
      page.drawText(`${letter.nombreCompetencia.toUpperCase()}`, {
        x: xData ,
        y: page.getHeight() - yLine,
        size: 12,
        color: rgb(0, 0, 0),
        font:font
      });
      yLine=yLine+carriet
  
      page.drawText(`${letter.domicilioCompetencia.toUpperCase()}`, {
        x: xData,
        y: page.getHeight() - yLine,
        size: 12,
        color: rgb(0, 0, 0)
      });
      yLine=yLine+carriet
  
      const fechaI=new Date(letter.fechaInicialCompetencia)
      const fechaF=new Date(letter.fechaFinalCompetencia)
      page.drawText(`${formatearFecha(fechaI)} to ${formatearFecha(fechaF)}`, {
        x: xData,
        y: page.getHeight() - yLine,
        size: 12,
        color: rgb(0, 0, 0)
      });
      yLine=yLine+carriet
      page.drawText(`Level:`, {
        x: xData,
        y: page.getHeight() - yLine,
        size: 12,
        color: rgb(0, 0, 0),
        font: font
      });
      page.drawText(`${letter.nivelCompeticion}`, {
        x: xData +55,
        y: page.getHeight() - yLine,
        size: 12,
        color: rgb(0, 0, 0)
      });
  
  
      // Guardar el PDF modificado en un nuevo archivo
      const modifiedPdfBytes = await pdfDoc.save();
      await fsP.writeFile(`./uploads/lettersA/carta-${letter.folio}.pdf`, modifiedPdfBytes);
  
      console.log('Archivo PDF modificado creado exitosamente.');
      return `carta-${letter.folio}.pdf`
    } catch (error) {
      console.error('Error al modificar el PDF:', error);
    }
  }