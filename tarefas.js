// Ninho — módulo de tarefas
// Responsável cria e atribui; membro conclui;
// responsável confirma; tarefas atrasadas não ganham estrelas.

const SUPABASE_URL = "https://ncqimbutzmngrkgvtnqt.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_kM4EsVr5Y22pWEgpn8CTdg_ag3m7aDE";

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const $ = (id) => document.getElementById(id);
const painelResponsavel = $("painelResponsavel");
const listaTarefas = $("listaTarefas");
const aviso = $("aviso");

let usuario = null;
let membroAtual = null;
let tarefas = [];
let membros = [];

function mostrarAviso(texto, erro = false) {
    aviso.textContent = texto;
    aviso.hidden = false;
    aviso.classList.toggle("erro", erro);
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function escapar(valor = "") {
    return String(valor).replace(/[&<>"']/g, (c) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[c]));
}

function dataLocalHoje() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatarData(data) {
    if (!data) return "Sem prazo";
    const [ano, mes, dia] = data.slice(0, 10).split("-");
    return `${dia}/${mes}/${ano}`;
}

function ehResponsavel() {
    return String(membroAtual?.papel || "").toUpperCase() === "RESPONSAVEL";
}

function nomeMembro(id) {
    const m = membros.find((x) => x.id === id);
    return m?.nome || m?.nome_completo || "Membro da família";
}

function mostrarEstadoVazio(titulo, descricao, botao = "") {
    listaTarefas.innerHTML = `
        <div class="estado-vazio">
            <span>☁</span>
            <h3>${escapar(titulo)}</h3>
            <p>${escapar(descricao)}</p>
            ${botao}
        </div>`;
}

async function iniciar() {
    try {
        const { data: { user }, error: authError } = await db.auth.getUser();

        if (authError) throw authError;

        if (!user) {
            mostrarAviso("Entre na sua conta do Ninho para visualizar as tarefas.", true);

            mostrarEstadoVazio(
                "Faça login para continuar",
                "Entre no Ninho para acessar as tarefas da família.",
                '<a class="botao-acao" href="login.html">Ir para o login</a>'
            );

            return;
        }

        usuario = user;

        // Busca o perfil pelo usuário autenticado.
        // Não usa o ninhoId antigo salvo no navegador como filtro.
        const { data: dadosMembro, error: membroError } = await db
            .from("membros")
            .select("*")
            .eq("id", user.id)
            .maybeSingle();

        if (membroError) throw membroError;

        if (!dadosMembro) {
            localStorage.removeItem("ninhoId");

            throw new Error(
                "Sua conta está conectada, mas não encontrei seu perfil na tabela membros. " +
                "Isso geralmente significa que o convite não foi concluído ou que o cadastro não criou o perfil."
            );
        }

        membroAtual = dadosMembro;

        // Atualiza o armazenamento local com o Ninho encontrado no banco.
        localStorage.setItem("ninhoId", membroAtual.ninho_id);

        const { data: listaMembros, error: membrosError } = await db
            .from("membros")
            .select("*")
            .eq("ninho_id", membroAtual.ninho_id);

        if (membrosError) throw membrosError;

        membros = listaMembros || [];

        if (ehResponsavel()) {
            painelResponsavel.hidden = false;

            $("membroAtribuido").innerHTML =
                '<option value="">Escolha um membro</option>' +
                membros.map((m) =>
                    `<option value="${escapar(m.id)}">${escapar(m.nome || m.nome_completo || "Membro")}</option>`
                ).join("");

            $("prazo").min = dataLocalHoje();
        } else {
            painelResponsavel.hidden = true;
        }

        await carregarTarefas();

    } catch (e) {
        console.error("Erro ao iniciar tarefas:", e);

        mostrarAviso(
            `Não foi possível carregar as tarefas. ${e.message || "Confira sua conexão e as configurações do Supabase."}`,
            true
        );

        mostrarEstadoVazio(
            "Não conseguimos carregar ainda",
            e.message || "Confira se a tabela tarefas_ninho e as políticas de acesso estão configuradas no Supabase."
        );
    }
}

async function carregarTarefas() {
    let q = db
        .from("tarefas_ninho")
        .select("*")
        .eq("ninho_id", membroAtual.ninho_id)
        .order("created_at", { ascending: false });

    // Membros veem as tarefas atribuídas a eles.
    // Responsáveis veem todas as tarefas do próprio Ninho.
    if (!ehResponsavel()) {
        q = q.eq("membro_id", membroAtual.id);
    }

    const { data, error } = await q;

    if (error) throw error;

    tarefas = data || [];
    renderizar();
}

function renderizar() {
    const filtro = $("filtroTarefas").value;

    const pendentes = tarefas.filter((t) => !t.concluida);
    const aguardando = tarefas.filter((t) => t.concluida && !t.confirmada);

    $("totalTarefas").textContent = tarefas.length;
    $("totalPendentes").textContent = pendentes.length;
    $("totalAguardando").textContent = aguardando.length;

    const exibidas = tarefas.filter((t) => {
        if (filtro === "pendentes") return !t.concluida;
        if (filtro === "confirmacao") return t.concluida && !t.confirmada;
        if (filtro === "concluidas") return t.confirmada;
        return true;
    });

    if (!exibidas.length) {
        mostrarEstadoVazio(
            filtro === "todas"
                ? "Ainda não há tarefas por aqui"
                : "Nenhuma tarefa nesta categoria",
            ehResponsavel()
                ? "Crie uma tarefa acima para organizar a rotina da família."
                : "Quando o responsável atribuir uma tarefa a você, ela aparecerá aqui."
        );

        return;
    }

    listaTarefas.innerHTML = exibidas.map((t) => {
        const atrasada = !t.concluida && t.prazo && t.prazo < dataLocalHoje();

        let status;

        if (t.confirmada) {
            status = '<span class="pilula concluida">Concluída e confirmada</span>';
        } else if (t.concluida) {
            status = '<span class="pilula confirmar">Aguardando confirmação</span>';
        } else if (atrasada) {
            status = '<span class="pilula atrasada">Prazo vencido · sem estrelas</span>';
        } else {
            status = '<span class="pilula">Em andamento</span>';
        }

        const estrelas = t.confirmada ? Number(t.estrelas || 0) : 0;

        let acoes = "";

        if (!ehResponsavel() && !t.concluida && !t.confirmada) {
            acoes += `
                <button class="botao-acao"
                    data-acao="concluir"
                    data-id="${escapar(t.id)}">
                    Marcar como concluída
                </button>`;
        }

        if (ehResponsavel() && t.concluida && !t.confirmada) {
            acoes += `
                <button class="botao-acao confirmar"
                    data-acao="confirmar"
                    data-id="${escapar(t.id)}">
                    Confirmar conclusão
                </button>`;
        }

        if (ehResponsavel() && t.confirmada) {
            acoes += `
                <button class="botao-acao"
                    data-acao="extra"
                    data-id="${escapar(t.id)}">
                    Dar estrelas extras
                </button>`;
        }

        if (ehResponsavel() && !t.concluida) {
            acoes += `
                <button class="botao-acao secundario"
                    data-acao="excluir"
                    data-id="${escapar(t.id)}">
                    Excluir
                </button>`;
        }

        return `
            <article class="tarefa">
                <div class="tarefa-marcador">
                    ${t.confirmada ? "✓" : t.concluida ? "☆" : "☷"}
                </div>

                <div class="tarefa-conteudo">
                    <div class="tarefa-topo">
                        <h3>${escapar(t.titulo)}</h3>

                        <span class="estrelas">
                            ${"★".repeat(Math.min(estrelas, 10))}
                            ${"☆".repeat(Math.max(0, Math.min(10 - estrelas, 10)))}
                        </span>
                    </div>

                    ${t.descricao ? `<p>${escapar(t.descricao)}</p>` : ""}

                    <div class="meta-tarefa">
                        <span class="pilula">
                            Para: ${escapar(nomeMembro(t.membro_id))}
                        </span>

                        <span class="pilula ${atrasada ? "atrasada" : ""}">
                            Prazo: ${formatarData(t.prazo)}
                        </span>

                        ${status}

                        ${t.confirmada
                            ? `<span class="pilula concluida">+${Number(t.estrelas_extras || 0)} extras</span>`
                            : ""}
                    </div>

                    ${acoes ? `<div class="acoes-tarefa">${acoes}</div>` : ""}
                </div>
            </article>`;
    }).join("");
}

$("formTarefa").addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!membroAtual || !ehResponsavel()) {
        mostrarAviso("Somente o responsável pode criar tarefas.", true);
        return;
    }

    const botao = e.submitter || $("formTarefa").querySelector('[type="submit"]');

    if (botao) botao.disabled = true;

    try {
        const payload = {
            ninho_id: membroAtual.ninho_id,
            criado_por: membroAtual.id,
            membro_id: $("membroAtribuido").value,
            titulo: $("titulo").value.trim(),
            descricao: $("descricao").value.trim() || null,
            prazo: $("prazo").value,
            estrelas: Number($("estrelas").value),
            concluida: false,
            confirmada: false,
            estrelas_extras: 0
        };

        if (!payload.titulo || !payload.membro_id || !payload.prazo) {
            throw new Error("Preencha o nome, o membro e o prazo.");
        }

        if (payload.prazo < dataLocalHoje()) {
            throw new Error("Escolha hoje ou uma data futura para o prazo.");
        }

        const membroValido = membros.some(
            (m) => m.id === payload.membro_id &&
                   m.ninho_id === membroAtual.ninho_id
        );

        if (!membroValido) {
            throw new Error(
                "O membro escolhido não pertence a este Ninho. Atualize a página e tente novamente."
            );
        }

        const { error } = await db
            .from("tarefas_ninho")
            .insert(payload);

        if (error) throw error;

        e.target.reset();

        $("prazo").min = dataLocalHoje();

        mostrarAviso("Tarefa criada com carinho! 💙");

        await carregarTarefas();

    } catch (err) {
        console.error("Erro ao criar tarefa:", err);

        mostrarAviso(
            err.message || "Não foi possível criar a tarefa.",
            true
        );

    } finally {
        if (botao) botao.disabled = false;
    }
});

listaTarefas.addEventListener("click", async (e) => {
    const botao = e.target.closest("button[data-acao]");

    if (!botao || !membroAtual) return;

    const tarefa = tarefas.find(
        (t) => String(t.id) === botao.dataset.id
    );

    if (!tarefa) return;

    botao.disabled = true;

    try {
        let atualizacao = null;

        if (botao.dataset.acao === "concluir") {
            if (ehResponsavel()) {
                throw new Error(
                    "A conclusão deve ser marcada pelo membro atribuído."
                );
            }

            if (tarefa.prazo && tarefa.prazo < dataLocalHoje()) {
                const ok = confirm(
                    "O prazo já venceu. A tarefa poderá ser marcada como concluída, mas não receberá estrelas. Continuar?"
                );

                if (!ok) return;
            }

            atualizacao = {
                concluida: true,
                concluida_em: new Date().toISOString()
            };

        } else if (botao.dataset.acao === "confirmar") {
            if (!ehResponsavel()) {
                throw new Error("Somente o responsável pode confirmar.");
            }

            const dataConclusao = tarefa.concluida_em
                ? tarefa.concluida_em.slice(0, 10)
                : dataLocalHoje();

            const ganhaEstrelas =
                !tarefa.prazo || dataConclusao <= tarefa.prazo;

            atualizacao = {
                confirmada: true,
                confirmada_em: new Date().toISOString(),
                estrelas: ganhaEstrelas
                    ? Number(tarefa.estrelas || 0)
                    : 0
            };

        } else if (botao.dataset.acao === "extra") {
            if (!ehResponsavel()) {
                throw new Error("Somente o responsável pode dar estrelas extras.");
            }

            const valor = prompt(
                "Quantas estrelas extras deseja dar? (1 a 10)",
                "1"
            );

            if (valor === null) return;

            const extra = Number(valor);

            if (!Number.isInteger(extra) || extra < 1 || extra > 10) {
                throw new Error("Digite um número inteiro de 1 a 10.");
            }

            atualizacao = {
                estrelas_extras:
                    Number(tarefa.estrelas_extras || 0) + extra
            };

        } else if (botao.dataset.acao === "excluir") {
            if (!ehResponsavel()) {
                throw new Error("Somente o responsável pode excluir.");
            }

            if (!confirm(`Excluir a tarefa "${tarefa.titulo}"?`)) {
                return;
            }

            const { error } = await db
                .from("tarefas_ninho")
                .delete()
                .eq("id", tarefa.id)
                .eq("ninho_id", membroAtual.ninho_id);

            if (error) throw error;

            mostrarAviso("Tarefa excluída.");

            await carregarTarefas();

            return;
        }

        if (atualizacao) {
            const { error } = await db
                .from("tarefas_ninho")
                .update(atualizacao)
                .eq("id", tarefa.id)
                .eq("ninho_id", membroAtual.ninho_id);

            if (error) throw error;

            mostrarAviso("Tarefa atualizada! 💙");

            await carregarTarefas();
        }

    } catch (err) {
        console.error("Erro ao atualizar tarefa:", err);

        mostrarAviso(
            err.message || "Não foi possível atualizar a tarefa.",
            true
        );

    } finally {
        botao.disabled = false;
    }
});

$("filtroTarefas").addEventListener("change", renderizar);

iniciar();zy