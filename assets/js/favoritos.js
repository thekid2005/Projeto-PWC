// URL da API para obter os países
const URL_API = "https://restcountries.com/v3.1/all";

async function carregarFavoritos() {
  // Obtém os favoritos armazenados no localStorage
  let favoritos = JSON.parse(localStorage.getItem("paisesFavoritos")) || [];

  const container = document.getElementById("countries-container");

  if (favoritos.length === 0) {
    container.innerHTML = "<p>Não há países favoritos.</p>";
    return;
  }

  const paises = await obterPaises();
  
  container.innerHTML = '';


  favoritos.forEach((paisNome) => {
    // Encontrar o país pelo nome
    const pais = paises.find((p) => p.name.common === paisNome);
    
    if (pais) {
      const card = document.createElement("div");
      card.classList.add("card");

      const bandeiraUrl = pais.flags.png || "URL-da-bandeira-padrao";  // Defina um URL padrão caso não exista a bandeira

      
      card.innerHTML = `
        <img src="${bandeiraUrl}" alt="Bandeira de ${pais.name.common}" class="card-img-top" style="height: 150px; object-fit: cover;">
        <div class="card-body">
          <h5 class="card-title">${pais.name.common}</h5>
          <p class="card-text">População: ${pais.population.toLocaleString()}</p>
          <a href="detalhes-pais-fav.html?pais=${pais.name.common}" class="btn btn-info">Ver mais</a>
          <button class="btn btn-danger mt-2" data-pais="${pais.name.common}">Remover dos favoritos</button>
        </div>
      `;

      container.appendChild(card);
      
      
      const botaoRemover = card.querySelector(".btn-danger");
      botaoRemover.addEventListener("click", () => {
        removerDosFavoritos(pais.name.common);
        card.remove();

        
        verificarFavoritosVazios();
      });
    }
  });
}

// Função para remover o país dos favoritos
function removerDosFavoritos(paisNome) {
  let favoritos = JSON.parse(localStorage.getItem("paisesFavoritos")) || [];
  
  
  favoritos = favoritos.filter((nome) => nome !== paisNome);
  
  
  localStorage.setItem("paisesFavoritos", JSON.stringify(favoritos));
}

function verificarFavoritosVazios() {
  const container = document.getElementById("countries-container");
  const favoritos = JSON.parse(localStorage.getItem("paisesFavoritos")) || [];
  
  if (favoritos.length === 0) {
    container.innerHTML = "<p>Não há países favoritos.</p>";
  }
}

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

document.addEventListener("DOMContentLoaded", carregarFavoritos);
