
const formulario = document.getElementById("formularioNinho");

formulario.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const nomeNinho = document.getElementById("nomeNinho").value.trim();
    const nomeResponsavel = document.getElementById("nomeResponsavel").value.trim();
    const email = document.getElementById("email").value.trim();
    const papel = document.getElementById("papel").value.trim();

    if (!nomeNinho || !nomeResponsavel || !email || !papel) {
        alert("Preencha todos os campos para criar seu Ninho.");
        return;
    }

    localStorage.setItem("nomeNinho", nomeNinho);
    localStorage.setItem("nomeResponsavel", nomeResponsavel);
    localStorage.setItem("email", email);
    localStorage.setItem("papel", papel);
})

const tituloBoasVindas = document.getElementById("boasVindas");

if (tituloBoasVindas) {
    const nomeNinho = localStorage.getItem("nomeNinho");

    if (nomeNinho) {
        tituloBoasVindas.textContent = `Bem-vinda ao ${nomeNinho}!`;
    }
}

