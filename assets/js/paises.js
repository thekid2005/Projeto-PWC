const URL_API = "https://restcountries.com/v3.1/all"; // URL da API
const container = document.getElementById("countries-container");
const botaoAnterior = document.getElementById("pagina-anterior");
const botaoProxima = document.getElementById("proxima-pagina");
const inputPesquisa = document.getElementById("searchInput");
const botaoPesquisa = document.getElementById("searchButton");
const continenteSelect = document.getElementById("continenteSelect");

let paginaAtual = 1;
const itensPorPagina = 9; // 3 cards por linha, 3 linhas
let paisesFiltrados = [];

// Obter países da API
async function obterPaises() {
  try {
    const resposta = await fetch(URL_API);
    const dados = await resposta.json();
    return dados;
  } catch (erro) {
    console.error("Erro ao obter países:", erro);
    return [];
  }
}

// Renderizar os cards para a página atual
function mostrarPaises(paises) {
  container.innerHTML = "";
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const paisesParaMostrar = paises.slice(inicio, fim);

  paisesParaMostrar.forEach((pais) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${pais.flags.png}" alt="Bandeira de ${pais.name.common}">
      <h3>${pais.name.common}</h3>
      <p>População: ${pais.population.toLocaleString()}</p>
      <a href="detalhes-pais.html?pais=${
        pais.name.common
      }" class="btn btn-info">Ver mais</a>
    `;
    container.appendChild(card);
  });

  // Atualizar os botões de paginação
  botaoAnterior.classList.toggle("desativado", paginaAtual === 1);
  botaoProxima.classList.toggle("desativado", fim >= paises.length);
}

// Filtrar os países com base na pesquisa de nome
function filtrarPaises(paises, termo) {
  return paises.filter((pais) =>
    pais.name.common.toLowerCase().includes(termo.toLowerCase())
  );
}

// Filtrar os países com base no continente
function filtrarPorContinente(paises, continente) {
  return paises.filter((pais) =>
    continente === " " ? true : pais.region === continente
  );
}

// Inicializar a aplicação
async function inicializar() {
  const paises = await obterPaises();
  paisesFiltrados = paises;
  mostrarPaises(paisesFiltrados);

  // Botões de paginação
  botaoAnterior.addEventListener("click", (evento) => {
    evento.preventDefault();
    if (paginaAtual > 1) {
      paginaAtual--;
      mostrarPaises(paisesFiltrados);
    }
  });

  botaoProxima.addEventListener("click", (evento) => {
    evento.preventDefault();
    if (paginaAtual * itensPorPagina < paisesFiltrados.length) {
      paginaAtual++;
      mostrarPaises(paisesFiltrados);
    }
  });

  // Botão de pesquisa por nome e continente
  botaoPesquisa.addEventListener("click", () => {
    const termo = inputPesquisa.value;
    const continente = continenteSelect.value;
    paginaAtual = 1;
    paisesFiltrados = filtrarPaises(paises, termo);
    paisesFiltrados = filtrarPorContinente(paisesFiltrados, continente);
    mostrarPaises(paisesFiltrados);
  });

  // Evento para pesquisa ao pressionar "Enter"
  inputPesquisa.addEventListener("keypress", (evento) => {
    if (evento.key === "Enter") {
      evento.preventDefault();
      const termo = inputPesquisa.value;
      const continente = continenteSelect.value;
      paginaAtual = 1;
      paisesFiltrados = filtrarPaises(paises, termo);
      paisesFiltrados = filtrarPorContinente(paisesFiltrados, continente);
      mostrarPaises(paisesFiltrados);
    }
  });

  // Filtrar por continente
  continenteSelect.addEventListener("change", () => {
    const continente = continenteSelect.value;
    const termo = inputPesquisa.value;
    paginaAtual = 1;
    paisesFiltrados = filtrarPorContinente(paises, continente);
    paisesFiltrados = filtrarPaises(paisesFiltrados, termo);
    mostrarPaises(paisesFiltrados);
  });
}

inicializar();
