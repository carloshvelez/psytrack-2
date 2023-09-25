export function formatearFechaYYYYMMDD(fecha) {
  const año = fecha.getFullYear();
  const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
  const dia = fecha.getDate().toString().padStart(2, "0");

  return `${año}-${mes}-${dia}`;
}

export function formatearHoraHHMM(hora) {
  const horas = hora.getHours().toString().padStart(2, "0");
  const minutos = hora.getMinutes().toString().padStart(2, "0");
  return `${horas}:${minutos}`;
}

export function mostrarFechaHora(objetoFecha, tipo = "fecha") {
  if (tipo === "fecha") {
    const meses = [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];
    const mes = meses[objetoFecha.getMonth()];
    return `${objetoFecha.getDate()} de ${mes} de ${objetoFecha.getFullYear()}`;
  } else if (tipo === "hora") {
    const hora = objetoFecha.getHours();
    const minutos = objetoFecha.getMinutes();
    const ampm = hora >= 12 ? "PM" : "AM";
    const hora12 = hora % 12 === 0 ? 12 : hora % 12;
    const minutosStr = minutos < 10 ? `0${minutos}` : minutos;

    return `${hora12}:${minutosStr} ${ampm}`;
  }
}
