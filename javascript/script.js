document.addEventListener("DOMContentLoaded", function () {
    const overlay = document.getElementById("overlay");
    const nextEventDateDiv = document.getElementById("event-date-time");
    const nextEventDetailsDiv = document.getElementById("event-details");
  
    function abrirFormulario() {
      overlay.style.display = "flex";
    }
  
    function fecharFormulario() {
      overlay.style.display = "none";
    }
  
    function salvarEvento() {
      const titulo = document.getElementById("titulo").value;
      const local = document.getElementById("local").value;
      const participantes = document.getElementById("participantes").value;
      const data = document.getElementById("data").value;
      const hora = document.getElementById("hora").value;
  
      if (titulo && local && participantes && data && hora) {
        const evento = {
          id: Date.now(),
          titulo,
          local,
          participantes,
          data,
          hora,
          convidados: [],
        };
  
        let eventos = JSON.parse(localStorage.getItem("eventos")) || [];
        eventos.push(evento);
        localStorage.setItem("eventos", JSON.stringify(eventos));
  
        exibirUltimoEvento();
        fecharFormulario();
      } else {
        alert("Por favor, preencha todos os campos.");
      }
    }
  
    function formatarData(data) {
      const partes = data.split("-");
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
  
    function exibirUltimoEvento() {
      let eventos = JSON.parse(localStorage.getItem("eventos")) || [];
      if (eventos.length > 0) {
        const ultimoEvento = eventos[eventos.length - 1];
        nextEventDateDiv.innerHTML = `
          <p><b>Data:</b> ${formatarData(ultimoEvento.data)}</p>
          <p><b>Hora:</b> ${ultimoEvento.hora}</p>
        `;
        nextEventDetailsDiv.innerHTML = `
          <h3>${ultimoEvento.titulo}</h3>
          <p><b>Local:</b> ${ultimoEvento.local}</p>
          <p><b>Participantes:</b> ${ultimoEvento.participantes}</p>
        `;
      } else {
        nextEventDateDiv.innerHTML = "<p>Sem eventos adicionados.</p>";
        nextEventDetailsDiv.innerHTML = "";
      }
    }
  
    exibirUltimoEvento();
  
    window.abrirFormulario = abrirFormulario;
    window.fecharFormulario = fecharFormulario;
    window.salvarEvento = salvarEvento;
  });
  