async function obterPaisesAleatorios() {
  const response = await fetch("https://restcountries.com/v3.1/all");
  const paises = await response.json();

  const paisesAleatorios = [];
  while (paisesAleatorios.length < 3) {
    const indiceAleatorio = Math.floor(Math.random() * paises.length);
    const pais = paises[indiceAleatorio];

    // Verifica se o país já foi adicionado
    if (!paisesAleatorios.includes(pais)) {
      paisesAleatorios.push(pais);
    }
  }

  return paisesAleatorios;
}


function mostrarCartoes(paises) {
  const container = document.getElementById("cards");
  container.innerHTML = ""; // Limpa os cartões anteriores

  paises.forEach((pais) => {
    const cartao = document.createElement("div");
    cartao.classList.add("col");

    cartao.innerHTML = `
        <div class="card">
          <img src="${pais.flags.png}" class="card-img-top" alt="Bandeira de ${pais.name.common}">
          <div class="card-body">
            <h5 class="card-title">${pais.name.common}</h5>
          </div>
        </div>
      `;

    container.appendChild(cartao);
  });
}

obterPaisesAleatorios().then((paises) => {
  mostrarCartoes(paises);
});
