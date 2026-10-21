
const perfil = document.getElementById("perfil");
const form = document.getElementById("formTarefa");
const lista = document.getElementById("listaTarefas");
const vazio = document.getElementById("vazio");
const painelCriacao = document.getElementById("painelCriacao");
const filtros = document.getElementById("filtros");

const filhos = {
  filho1: "Ana",
  filho2: "Pedro",
  filho3: "Lia"
};

const STORAGE_KEY = "projetoNinhoTarefasV1";

let filtroAtual = "todas";
let tarefas = carregarTarefas();

function carregarTarefas() {
  try {
    const dados = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(dados) ? dados : [];
  } catch {
    return [];
  }
}

function salvarTarefas() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tarefas));
}

function escapar(texto) {
  return String(texto ?? "").replace(/[&<>"']/g, caractere => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[caractere]);
}

function ehPai() {
  return perfil.value === "pai";
}

function tarefaVisivel(tarefa) {
  return ehPai() || tarefa.responsavel === perfil.value;
}

function dataFormatada(data) {
  if (!data) return "Sem prazo definido";
  const partes = data.split("-");
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function estaAtrasada(tarefa) {
  if (!tarefa.prazo || tarefa.status === "concluida") return false;

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const prazo = new Date(`${tarefa.prazo}T00:00:00`);
  return prazo < hoje;
}

function nomeStatus(tarefa) {
  if (tarefa.status === "revisao") return "Aguardando avaliação";
  if (tarefa.status === "concluida") return "Concluída";
  return "Pendente";
}

function renderizar() {
  const souPai = ehPai();

  painelCriacao.hidden = !souPai;
  filtros.hidden = !souPai;

  document.getElementById("titulo").textContent = souPai
    ? "Vamos cuidar do nosso ninho? 🏡"
    : `Oi, ${filhos[perfil.value]}! Vamos nessa? 🌱`;

  document.getElementById("subtitulo").textContent = souPai
    ? "Organize as atividades e acompanhe as conquistas da família."
    : "Cada pequena tarefa é uma grande conquista!";

  document.getElementById("tituloLista").textContent = souPai
    ? "Lista de tarefas"
    : "Minhas tarefas";

  const minhas = tarefas.filter(tarefaVisivel);

  document.getElementById("totalTarefas").textContent = minhas.length;

  document.getElementById("totalConcluidas").textContent =
    minhas.filter(t => t.status === "concluida").length;

  document.getElementById("totalEstrelas").textContent =
    minhas.filter(t => t.temEstrela).length;

  document.querySelectorAll(".filter").forEach(botao => {
    botao.classList.toggle("active", botao.dataset.filtro === filtroAtual);
  });

  const filtradas = minhas.filter(tarefa => {
    if (!souPai) return true;
    if (filtroAtual === "pendentes") return tarefa.status === "pendente";
    if (filtroAtual === "revisao") return tarefa.status === "revisao";
    if (filtroAtual === "concluidas") return tarefa.status === "concluida";
    return true;
  });

  vazio.hidden = filtradas.length > 0;

  lista.innerHTML = filtradas.map(tarefa => {
    const atrasada = estaAtrasada(tarefa);
    const statusClasse = tarefa.status === "concluida"
      ? "done"
      : tarefa.status === "revisao" ? "review" : "pending";

    let botoes = "";

    if (souPai && tarefa.status === "revisao") {
      botoes += `
        <button class="action-button approve"
          data-acao="aprovar" data-id="${tarefa.id}">
          ★ Aprovar e dar estrela
        </button>
        <button class="action-button reject"
          data-acao="corrigir" data-id="${tarefa.id}">
          ↻ Pedir correção
        </button>`;
    }

    if (souPai && tarefa.status === "concluida" && tarefa.temEstrela) {
      botoes += `
        <button class="action-button reject"
          data-acao="retirar" data-id="${tarefa.id}">
          − Retirar estrela
        </button>`;
    }

    if (souPai && tarefa.status === "concluida" && !tarefa.temEstrela) {
      botoes += `
        <button class="action-button approve"
          data-acao="reaprovar" data-id="${tarefa.id}">
          ★ Dar estrela
        </button>`;
    }

    if (!souPai && tarefa.status === "pendente") {
      botoes += `
        <button class="action-button approve"
          data-acao="finalizar" data-id="${tarefa.id}">
          ✓ Marcar como feita
        </button>`;
    }

    if (souPai) {
      botoes += `
        <button class="action-button"
          data-acao="excluir" data-id="${tarefa.id}">
          Excluir
        </button>`;
    }

    return `
      <article class="task-card">
        <div class="task-main">
          <div class="task-symbol">
            ${tarefa.status === "concluida" ? "🌟" : "📝"}
          </div>
          <div class="task-info">
            <h3>${escapar(tarefa.nome)}</h3>
            <p>${escapar(tarefa.descricao || "Uma pequena tarefa para cuidar do nosso lar.")}</p>

            <div class="task-meta">
              <span class="tag ${statusClasse}">${nomeStatus(tarefa)}</span>
              ${souPai ? `<span class="tag">${escapar(filhos[tarefa.responsavel])}</span>` : ""}
              <span class="tag ${atrasada ? "late" : ""}">
                ${atrasada ? "Prazo vencido: " : "Prazo: "}${dataFormatada(tarefa.prazo)}
              </span>
            </div>
          </div>
        </div>

        <div class="task-actions">
          ${tarefa.temEstrela ? '<span class="star-count">★ 1 estrela</span>' : ""}
          ${botoes}
        </div>
      </article>`;
  }).join("");
}

form.addEventListener("submit", evento => {
  evento.preventDefault();

  if (!ehPai()) return;

  const nome = document.getElementById("nomeTarefa").value.trim();
  const descricao = document.getElementById("descricao").value.trim();
  const responsavel = document.getElementById("responsavel").value;
  const prazo = document.getElementById("prazo").value;

  if (!nome || !filhos[responsavel]) {
    alert("Informe o nome da tarefa e escolha um filho.");
    return;
  }

  tarefas.unshift({
    id: crypto.randomUUID(),
    nome,
    descricao,
    responsavel,
    prazo,
    status: "pendente",
    temEstrela: false
  });

  salvarTarefas();
  form.reset();
  document.getElementById("responsavel").value = "filho1";
  renderizar();
});

perfil.addEventListener("change", () => {
  filtroAtual = "todas";
  renderizar();
});

filtros.addEventListener("click", evento => {
  const botao = evento.target.closest("[data-filtro]");
  if (!botao || !ehPai()) return;

  filtroAtual = botao.dataset.filtro;
  renderizar();
});

lista.addEventListener("click", evento => {
  const botao = evento.target.closest("[data-acao]");
  if (!botao) return;

  const tarefa = tarefas.find(t => t.id === botao.dataset.id);
  if (!tarefa) return;

  const acao = botao.dataset.acao;

  // Ações exclusivas do responsável
  if (["aprovar", "corrigir", "retirar", "reaprovar", "excluir"].includes(acao)) {
    if (!ehPai()) return;
  }

  // O filho só pode concluir suas próprias tarefas pendentes
  if (acao === "finalizar") {
    if (ehPai() || tarefa.responsavel !== perfil.value) return;
    if (tarefa.status !== "pendente") return;

    tarefa.status = "revisao";
  }

  if (acao === "aprovar") {
    if (tarefa.status !== "revisao") return;

    tarefa.status = "concluida";
    tarefa.temEstrela = true;
  }

  if (acao === "corrigir") {
    if (tarefa.status !== "revisao") return;

    tarefa.status = "pendente";
    tarefa.temEstrela = false;
  }

  if (acao === "retirar") {
    if (tarefa.status !== "concluida" || !tarefa.temEstrela) return;

    const confirmar = confirm("Deseja retirar a estrela desta tarefa?");
    if (!confirmar) return;

    tarefa.temEstrela = false;
  }

  if (acao === "reaprovar") {
    if (tarefa.status !== "concluida" || tarefa.temEstrela) return;
    tarefa.temEstrela = true;
  }

  if (acao === "excluir") {
    const confirmar = confirm("Deseja excluir esta tarefa?");
    if (!confirmar) return;

    tarefas = tarefas.filter(t => t.id !== tarefa.id);
  }

  salvarTarefas();
  renderizar();
});

renderizar();
