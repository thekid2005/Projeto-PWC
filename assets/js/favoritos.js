// URL da API para obter os países
const URL_API = "https://restcountries.com/v3.1/all";

// Função para carregar os favoritos do localStorage
async function carregarFavoritos() {
  // Obtém os favoritos armazenados no localStorage
  let favoritos = JSON.parse(localStorage.getItem("paisesFavoritos")) || [];

  // Pega o container onde os países serão exibidos
  const container = document.getElementById("countries-container");

  // Verifica se há favoritos
  if (favoritos.length === 0) {
    container.innerHTML = "<p>Não há países favoritos.</p>";
    return;
  }

  // Obter os dados de todos os países da API
  const paises = await obterPaises();
  
  // Limpa o container antes de adicionar os cards
  container.innerHTML = '';

  // Iterar sobre os países favoritos e exibir os dados
  favoritos.forEach((paisNome) => {
    // Encontrar o país pelo nome
    const pais = paises.find((p) => p.name.common === paisNome);
    
    if (pais) {
      const card = document.createElement("div");
      card.classList.add("card");

      // Verifica se a bandeira está disponível e cria o card
      const bandeiraUrl = pais.flags.png || "URL-da-bandeira-padrao";  // Defina um URL padrão caso não exista a bandeira

      // HTML do card (com o botão de remover)
      card.innerHTML = `
        <img src="${bandeiraUrl}" alt="Bandeira de ${pais.name.common}" class="card-img-top" style="height: 150px; object-fit: cover;">
        <div class="card-body">
          <h5 class="card-title">${pais.name.common}</h5>
          <p class="card-text">População: ${pais.population.toLocaleString()}</p>
          <a href="detalhes-pais.html?pais=${pais.name.common}" class="btn btn-info">Ver mais</a>
          <button class="btn btn-danger mt-2" data-pais="${pais.name.common}">Remover dos favoritos</button>
        </div>
      `;

      container.appendChild(card);
      
      // Adiciona o evento de clique para remover o país dos favoritos
      const botaoRemover = card.querySelector(".btn-danger");
      botaoRemover.addEventListener("click", () => {
        removerDosFavoritos(pais.name.common);
        card.remove(); // Remove o card imediatamente

        // Verificar se não há mais favoritos
        verificarFavoritosVazios();
      });
    }
  });
}

// Função para remover o país dos favoritos
function removerDosFavoritos(paisNome) {
  let favoritos = JSON.parse(localStorage.getItem("paisesFavoritos")) || [];
  
  // Filtra o país a ser removido
  favoritos = favoritos.filter((nome) => nome !== paisNome);
  
  // Atualiza o localStorage
  localStorage.setItem("paisesFavoritos", JSON.stringify(favoritos));
}

// Função para verificar se não há mais favoritos e mostrar a mensagem
function verificarFavoritosVazios() {
  const container = document.getElementById("countries-container");
  const favoritos = JSON.parse(localStorage.getItem("paisesFavoritos")) || [];
  
  if (favoritos.length === 0) {
    container.innerHTML = "<p>Não há países favoritos.</p>";
  }
}

// Função para obter os países da API
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

// Chama a função para carregar os favoritos quando a página for carregada
document.addEventListener("DOMContentLoaded", carregarFavoritos);
