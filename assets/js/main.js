async function getRandomCountries() {
  const response = await fetch("https://restcountries.com/v3.1/all");
  const countries = await response.json();

  // Seleciona 3 países aleatórios
  const randomCountries = [];
  while (randomCountries.length < 3) {
    const randomIndex = Math.floor(Math.random() * countries.length);
    const country = countries[randomIndex];

    // Verifica se o país já foi adicionado
    if (!randomCountries.includes(country)) {
      randomCountries.push(country);
    }
  }

  return randomCountries;
}

// Função para exibir os cards
function displayCards(countries) {
  const container = document.getElementById("cards");
  container.innerHTML = ""; // Limpa os cards anteriores

  countries.forEach((country) => {
    const card = document.createElement("div");
    card.classList.add("col");

    // Cria o card com a imagem da bandeira e nome
    card.innerHTML = `
        <div class="card">
          <img src="${country.flags.png}" class="card-img-top" alt="Flag of ${country.name.common}">
          <div class="card-body">
            <h5 class="card-title">${country.name.common}</h5>
          </div>
        </div>
      `;

    container.appendChild(card);
  });
}

// Chama as funções
getRandomCountries().then((countries) => {
  displayCards(countries);
});
