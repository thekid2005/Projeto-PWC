const urlParams = new URLSearchParams(window.location.search);
const nomePais = urlParams.get("pais");

const URL_API = `https://restcountries.com/v3.1/name/${nomePais}?fullText=true`;

const paisNome = document.getElementById("paisNome");
const paisBandeira = document.getElementById("paisBandeira");
const paisCapital = document.getElementById("paisCapital");
const paisPopulacao = document.getElementById("paisPopulacao");
const paisArea = document.getElementById("paisArea");
const paisMoeda = document.getElementById("paisMoeda");
const paisIdioma = document.getElementById("paisIdioma");
const paisRegiao = document.getElementById("paisRegiao");
const paisSubRegiao = document.getElementById("paisSubRegiao");
const paisFusoHorario = document.getElementById("paisFusoHorario");
const paisGoogleMapsLink = document.getElementById("paisGoogleMapsLink");

async function obterDetalhesPais() {
  try {
    const resposta = await fetch(URL_API);
    const dados = await resposta.json();

    if (dados && dados.length > 0) {
      const pais = dados[0];

      
      paisNome.textContent = pais.name.common;
      paisBandeira.src = pais.flags.png;
      paisCapital.textContent = pais.capital ? pais.capital[0] : "N/A";
      paisPopulacao.textContent = pais.population.toLocaleString();
      paisArea.textContent = pais.area ? pais.area : "N/A";
      paisMoeda.textContent = pais.currencies
        ? Object.values(pais.currencies)
            .map((c) => c.name)
            .join(", ")
        : "N/A";
      paisIdioma.textContent = pais.languages
        ? Object.values(pais.languages).join(", ")
        : "N/A";
      paisRegiao.textContent = pais.region || "N/A";
      paisSubRegiao.textContent = pais.subregion || "N/A";
      paisFusoHorario.textContent = pais.timezones
        ? pais.timezones.join(", ")
        : "N/A";

      if (pais.maps && pais.maps.googleMaps) {
        paisGoogleMapsLink.href = pais.maps.googleMaps; 
        paisGoogleMapsLink.textContent = "Abrir no Google Maps"; 
      } else {
        paisGoogleMapsLink.style.display = "none";
      }
    }
  } catch (erro) {
    console.error("Erro ao obter detalhes do país:", erro);
  }
}

obterDetalhesPais();
