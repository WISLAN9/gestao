document.addEventListener("DOMContentLoaded", function () {
  const containerEventos = document.getElementById("container-eventos");
  const urlParams = new URLSearchParams(window.location.search);
  const eventoId = urlParams.get("eventoId");
  let indiceConvidados = 1;
  let indicePresente = 1;

  function carregarDetalhesEvento() {
    const eventos = JSON.parse(localStorage.getItem("eventos")) || [];
    const evento = eventos.find((e) => e.id == eventoId);

    if (evento) {
      const detalhesDiv = document.createElement("div");
      detalhesDiv.classList.add("detalhes-evento");
      detalhesDiv.innerHTML = `
        <h3>${evento.titulo}</h3>
        <p><b>Local:</b> ${evento.local}</p>
        <p><b>Participantes:</b> ${evento.participantes}</p>
        <p><b>Data: </b>${formatarData(evento.data)}</p>
        <p><b>Hora: </b>${evento.hora}</p>
        <h4>Convidados</h4>
        <div class="input-button-group">
          <input type="text" id="novo-convidado" placeholder="Nome do convidado">
          <button id="add-invite">Adicionar</button>
        </div>
        <input type="text" id="pesquisar-convidado" placeholder="Pesquisar convidado">
        <button id="export" class="export">Exportar para Excel</button>
        <ul id="lista-convidados"></ul>
        <h4>Convidados Presentes</h4>
        <ul id="lista-presentes"></ul>
      `;

      containerEventos.appendChild(detalhesDiv);

      evento.convidados.forEach((convidado) => {
        adicionarConvidadoNaLista(convidado);
      });

      const pesquisarConvidadoInput = document.getElementById("pesquisar-convidado");
      pesquisarConvidadoInput.addEventListener("input", function () {
        filtrarConvidados(pesquisarConvidadoInput.value);
      });

      const addInviteButton = document.getElementById("add-invite");
      addInviteButton.addEventListener("click", function () {
        adicionarConvidado(eventoId);
      });

      const exportButton = document.getElementById("export");
      exportButton.addEventListener("click", function () {
        exportarParaExcel(eventoId);
      });
    } else {
      containerEventos.innerHTML = "<p>Evento não encontrado.</p>";
    }
  }

  function formatarData(data) {
    const dataObj = new Date(data);
    const dia = ("0" + dataObj.getDate()).slice(-2);
    const mes = ("0" + (dataObj.getMonth() + 1)).slice(-2);
    const ano = dataObj.getFullYear();
    return `${dia}/${mes}/${ano}`;
  }

  function adicionarConvidado(eventoId) {
    const novoConvidadoInput = document.getElementById("novo-convidado");
    const novoConvidado = novoConvidadoInput.value.trim();

    if (novoConvidado) {
      let eventos = JSON.parse(localStorage.getItem("eventos")) || [];
      const evento = eventos.find((e) => e.id == eventoId);
      if (evento) {
        if (!evento.convidados.includes(novoConvidado)) {
          evento.convidados.push(novoConvidado);
          localStorage.setItem("eventos", JSON.stringify(eventos));
          adicionarConvidadoNaLista(novoConvidado);
          novoConvidadoInput.value = "";
        } else {
          alert("Este convidado já foi adicionado.");
        }
      }
    } else {
      alert("Por favor, insira o nome do convidado.");
    }
  }

  function adicionarConvidadoNaLista(convidado) {
    const listaConvidados = document.getElementById("lista-convidados");
    const convidadoLi = document.createElement("li");

    const convidadoInfo = document.createElement("div");
    convidadoInfo.classList.add("convidado-info");
    convidadoInfo.textContent = `${indiceConvidados}. ${convidado}`;
    convidadoLi.setAttribute("data-nome", convidado.toLowerCase());
    indiceConvidados++;

    const buttonExcluir = document.createElement("button");
    buttonExcluir.innerHTML = '<i class="fa-solid fa-trash"></i>';
    buttonExcluir.onclick = function () {
      excluirConvidado(convidadoLi);
    };

    const buttonMarcar = document.createElement("button");
    buttonMarcar.innerHTML = '<i class="fa-solid fa-check"></i>';
    buttonMarcar.onclick = function () {
      confirmarPresenca(convidado);
    };

    convidadoLi.appendChild(convidadoInfo);
    convidadoLi.appendChild(buttonMarcar);
    convidadoLi.appendChild(buttonExcluir);
    listaConvidados.appendChild(convidadoLi);
  }

  function excluirConvidado(convidadoLi) {
    const listaConvidados = document.getElementById("lista-convidados");
    listaConvidados.removeChild(convidadoLi);
  }

  function confirmarPresenca(convidado) {
    if (confirm(`Tem certeza que ${convidado} está presente?`)) {
      marcarPresenca(convidado);
    }
  }

  function marcarPresenca(convidado) {
    const listaPresentes = document.getElementById("lista-presentes");

    // Verificar se o convidado já está presente
    const presentes = listaPresentes.querySelectorAll("li");
    const presenteDuplicado = [...presentes].find(presente => {
      return presente.textContent.includes(convidado);
    });

    if (!presenteDuplicado) {
      const presenteLi = document.createElement("li");
      
      const convidadoInfo = document.createElement("div");
      convidadoInfo.classList.add("convidado-info");
      convidadoInfo.textContent = `${indicePresente}. ${convidado}`;
      
      const buttonExcluir = document.createElement("button");
      buttonExcluir.classList.add("excluir");
      buttonExcluir.innerHTML = '<i class="fa-solid fa-trash"></i>';
      buttonExcluir.onclick = function () {
        excluirPresenca(presenteLi);
      };
  
      convidadoInfo.appendChild(buttonExcluir);
      presenteLi.appendChild(convidadoInfo);
      listaPresentes.appendChild(presenteLi);
      indicePresente++;
    } else {
      alert("Este convidado já foi marcado como presente.");
    }
  }

  function excluirPresenca(presenteLi) {
    const listaPresentes = document.getElementById("lista-presentes");
    listaPresentes.removeChild(presenteLi);
  }

  function filtrarConvidados(termo) {
    const listaConvidados = document.getElementById("lista-convidados");
    const convidados = listaConvidados.getElementsByTagName("li");

    for (let i = 0; i < convidados.length; i++) {
      const convidadoNome = convidados[i].getAttribute("data-nome");
      if (convidadoNome.includes(termo.toLowerCase())) {
        convidados[i].style.display = "";
      } else {
        convidados[i].style.display = "none";
      }
   

    }
  }

  carregarDetalhesEvento();
});

function formatarData(data) {
  const dataObj = new Date(data);
  const dia = ("0" + dataObj.getDate()).slice(-2);
  const mes = ("0" + (dataObj.getMonth() + 1)).slice(-2);
  const ano = dataObj.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

function exportarParaExcel(eventoId) {
  let csvContent = "data:text/csv;charset=utf-8,";

  // Adicionar cabeçalho em colunas separadas
  csvContent += "TITULO,LOCAL,PARTICIPANTES,DATA,HORA,CONVIDADOS,CONVIDADOS PRESENTES\n";

  const eventos = JSON.parse(localStorage.getItem("eventos")) || [];
  const evento = eventos.find((e) => e.id == eventoId);

  if (evento) {
    // Adicionando dados do evento em colunas separadas
    csvContent += `${evento.titulo},${evento.local},${evento.participantes},${formatarData(evento.data)},${evento.hora}`;

    // Adicionando lista de convidados em uma coluna separada
    if (evento.convidados.length > 0) {
      evento.convidados.forEach((convidado) => {
        csvContent += `,${convidado}`;
      });
    } else {
      // Adicionando célula vazia para convidados
      csvContent += ",";
    }

    // Adicionando lista de convidados presentes em uma coluna separada
    if (evento.presentes && evento.presentes.length > 0) {
      evento.presentes.forEach((presente) => {
        csvContent += `,${presente}`;
      });
    }

    // Nova linha para o próximo evento
    csvContent += "\n";
  }

  // Codificando o CSV e criando o link para download
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "detalhes_evento.csv");
  document.body.appendChild(link);
  
  // Iniciando o download
  link.click();
}



