(function () {
  
  const playlist = [
    { titulo: "Mi canción 1", artista: "unknoun", archivo: "/musica/cancion1.mp3" },
    { titulo: "Mi canción 2", artista: "unknown", archivo: "/musica/cancion2.mp3" },
    { titulo: "Mi canción 3", artista: "unknown", archivo: "/musica/cancion3.mp3" },
  ];


const contenedor = document.createElement("div");
contenedor.textContent = "Aquí irá mi reproductor";
document.body.appendChild(contenedor);
