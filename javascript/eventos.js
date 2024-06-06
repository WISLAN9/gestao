document.addEventListener("DOMContentLoaded", function () {
  const overlay = document.getElementById("overlay");
  const proxitens = document.getElementById("proxitens");

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

      ordenarEventosEExibir();
      fecharFormulario();
    } else {
      alert("Por favor, preencha todos os campos.");
    }
  }

  function formatarData(data) {
    const partes = data.split("-");
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
  }

  function adicionarEventoNaPagina(evento) {
    const eventoDiv = document.createElement("div");
    eventoDiv.classList.add("evento");
    eventoDiv.innerHTML = `
      <h3>${evento.titulo}</h3>
      <p><b>Local:</b> ${evento.local}</p>
      <p><b>Participantes:</b> ${evento.participantes}</p>
      <p><b>Data:</b> ${formatarData(evento.data)}</p>
      <p><b>Hora:</b> ${evento.hora}</p>
      <button onclick="verDetalhes(${evento.id})">Ver Detalhes</button>
      <button onclick="excluirEvento(${evento.id})">Excluir</button>
    `;
    proxitens.appendChild(eventoDiv);
  }

  function ordenarEventosEExibir() {
    let eventos = JSON.parse(localStorage.getItem("eventos")) || [];
    eventos.sort((a, b) => new Date(b.data + 'T' + b.hora) - new Date(a.data + 'T' + a.hora));

    proxitens.innerHTML = ""; // Limpar os eventos atuais na página
    eventos.forEach(adicionarEventoNaPagina);
  }

  function verDetalhes(eventoId) {
    window.location.href = `detalhesevento.html?eventoId=${eventoId}`;
  }

  function excluirEvento(eventoId) {
    let eventos = JSON.parse(localStorage.getItem("eventos")) || [];
    eventos = eventos.filter(evento => evento.id !== eventoId);
    localStorage.setItem("eventos", JSON.stringify(eventos));
    ordenarEventosEExibir();
  }

  ordenarEventosEExibir();

  window.abrirFormulario = abrirFormulario;
  window.fecharFormulario = fecharFormulario;
  window.salvarEvento = salvarEvento;
  window.verDetalhes = verDetalhes;
  window.excluirEvento = excluirEvento;
});



