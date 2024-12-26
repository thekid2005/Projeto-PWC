function showError(fieldId, message) {
    console.log(fieldId);
    var errorDiv = document.getElementById(`${fieldId}-erro`);
    errorDiv.textContent = message; // altera o texto do elemento
    errorDiv.style.display = "block";
  }
  
  // Esconder o erro
  function hideError(fieldId) {
    var errorDiv = document.getElementById(`${fieldId}-erro`);
    errorDiv.style.display = "none";
  }
  
  // Validação dos campos do formulário
  function validateForm() {
    let isValid = true;
    var nomeInput = document.getElementById("nome");
    var emailInput = document.getElementById("email");
    var mensagemText = document.getElementById("mensagem");
    var termosInput = document.getElementById("termos");
  
    if (nomeInput.value.length < 3) {
      showError("nome", "Erro no nome!");
      isValid = false;
    } else {
      hideError("nome");
    }
  
    if (!validateEmail(emailInput.value)) {
      showError("email", "Erro no email!");
      isValid = false;
    } else {
      hideError("email");
    }
  
    if (mensagemText.value.trim() === "") {
      showError("mensagem", "Erro na mensagem!");
      isValid = false;
    } else {
      hideError("mensagem");
    }
  
    if (!termosInput.checked) {
      showError("termos", "Erro no termos!");
      isValid = false;
    } else {
      hideError("termos");
    }
  
    return isValid; // Retorna se o formulário é válido
  }
  
  function validateEmail(email) {
    var regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regexEmail.test(email); // esta função test() devolve true ou false
  }
  
  function saveFormData() {
    var formData = {
      nome: document.getElementById("nome").value, // Corrigido
      email: document.getElementById("email").value,
      mensagem: document.getElementById("mensagem").value,
      termos: document.getElementById("termos").checked, // Corrigido
    };
  
    console.log(formData);
  }
  
  document
    .getElementById("form-scrpt").addEventListener("submit", function (event) {
      event.preventDefault(); // Previne o refresh automático da página ao enviar o formulário
      if (validateForm()) {
        saveFormData();
        var success = document.getElementById("success-mensage");
        success.style.opacity = "1";
        setTimeout(() => {
          success.style.opacity = "0";
        }, 5000);
        success.style.display = "block";
      }
    });
  