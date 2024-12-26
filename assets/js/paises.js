const URL_API = "https://restcountries.com/v3.1/all"; // URL da API
const container = document.getElementById("countries-container");
const botaoAnterior = document.getElementById("pagina-anterior");
const botaoProxima = document.getElementById("proxima-pagina");
const inputPesquisa = document.getElementById("searchInput");
const botaoPesquisa = document.getElementById("searchButton");
const moedaSelect = document.getElementById("moedaSelect");

let paginaAtual = 1;
const itensPorPagina = 9; 
let paisesFiltrados = [];
let paisesFavoritos = JSON.parse(localStorage.getItem("paisesFavoritos")) || [];

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

function salvarFavoritos() {
  localStorage.setItem("paisesFavoritos", JSON.stringify(paisesFavoritos));
}

function mostrarPaises(paises) {
  container.innerHTML = "";
  const inicio = (paginaAtual - 1) * itensPorPagina;
  const fim = inicio + itensPorPagina;
  const paisesParaMostrar = paises.slice(inicio, fim);

  paisesParaMostrar.forEach((pais) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${pais.flags.png}" alt="Bandeira de ${pais.name.common}" style="width: 100%; height: 150px; object-fit: cover;">
      <h3>${pais.name.common}</h3>
      <p>População: ${pais.population.toLocaleString()}</p>
      <div class="botao-container">
        <a href="detalhes-pais.html?pais=${pais.name.common}" class="btn btn-info">Ver mais</a>
        <button class="btn btn-warning botao-favoritos" data-pais="${pais.name.common}">${paisesFavoritos.includes(pais.name.common) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}</button>
      </div>
    `;
    container.appendChild(card);
  });

  botaoAnterior.classList.toggle("desativado", paginaAtual === 1);
  botaoProxima.classList.toggle("desativado", fim >= paises.length);
  
  document.querySelectorAll(".botao-favoritos").forEach((botao) => {
    botao.addEventListener("click", (evento) => {
      const paisNome = evento.target.getAttribute("data-pais");
      if (paisesFavoritos.includes(paisNome)) {
        paisesFavoritos = paisesFavoritos.filter((nome) => nome !== paisNome); // Remover dos favoritos
      } else {
        paisesFavoritos.push(paisNome);
      }
      salvarFavoritos();
      mostrarPaises(paisesFiltrados); 
    });
  });
}

function filtrarPaises(paises, termo) {
  return paises.filter((pais) =>
    pais.name.common.toLowerCase().includes(termo.toLowerCase())
  );
}

// Filtrar os países com base na moeda
function filtrarPorMoeda(paises, moeda) {
  if (moeda === " ") {
    return paises;
  }

  return paises.filter((pais) => {
    const moedasPais = pais.currencies
      ? Object.keys(pais.currencies).map((code) => code.toLowerCase())
      : [];
    return moedasPais.includes(moeda.toLowerCase());
  });
}


async function inicializar() {
  const paises = await obterPaises();
  paisesFiltrados = paises;
  mostrarPaises(paisesFiltrados);

 
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

  
  botaoPesquisa.addEventListener("click", () => {
    const termo = inputPesquisa.value;
    const moeda = moedaSelect.value;
    paginaAtual = 1;

    paisesFiltrados = filtrarPaises(paises, termo);
    paisesFiltrados = filtrarPorMoeda(paisesFiltrados, moeda);
    mostrarPaises(paisesFiltrados);
  });

  
  inputPesquisa.addEventListener("keypress", (evento) => {
    if (evento.key === "Enter") {
      evento.preventDefault();
      const termo = inputPesquisa.value;
      const moeda = moedaSelect.value;
      paginaAtual = 1;

      paisesFiltrados = filtrarPaises(paises, termo);
      paisesFiltrados = filtrarPorMoeda(paisesFiltrados, moeda);
      mostrarPaises(paisesFiltrados);
    }
  });

  moedaSelect.addEventListener("change", () => {
    const moeda = moedaSelect.value;
    paginaAtual = 1;

    paisesFiltrados = filtrarPorMoeda(paises, moeda);
    if (inputPesquisa.value.trim() !== "") {
      paisesFiltrados = filtrarPaises(paisesFiltrados, inputPesquisa.value);
    }
    mostrarPaises(paisesFiltrados);
  });
}

inicializar();
