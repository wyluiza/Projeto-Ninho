
const SUPABASE_URL = "https://ncqimbutzmngrkgvtnqt.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_kM4EsVr5Y22pWEgpn8CTdg_ag3m7aDE";

const db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

const $ = (id) => document.getElementById(id);

let usuario = null;
let membroAtual = null;
let membros = [];
let compras = [];
let atualizando = false;

function mostrarAviso(texto, erro = false) {
    const aviso = $("avisoCompras");
    if (!aviso) return;

    aviso.textContent = texto;
    aviso.hidden = false;
    aviso.classList.toggle("erro", erro);
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

function formatarData(data) {
    if (!data) return "Data não disponível";

    const dataValida = new Date(data);

    if (Number.isNaN(dataValida.getTime())) {
        return "Data não disponível";
    }

    return dataValida.toLocaleString("pt-BR", {
        dateStyle: "short",
        timeStyle: "short"
    });
}

function nomeMembro(id) {
    const membro = membros.find((m) => m.id === id);

    return membro?.nome ||
        membro?.nome_completo ||
        "Membro da família";
}

function mostrarEstadoVazio(titulo, descricao) {
    const lista = $("listaCompras");
    if (!lista) return;

    lista.innerHTML = `
        <div class="estado-vazio">
            <span>☁</span>
            <h3>${escapar(titulo)}</h3>
            <p>${escapar(descricao)}</p>
        </div>
    `;
}

async function carregarPerfil() {
    // Usa o mesmo método de autenticação do tarefas.js.
    const {
        data: { user },
        error: authError
    } = await db.auth.getUser();

    if (authError) throw authError;

    if (!user) {
        mostrarAviso(
            "Entre na sua conta do Ninho para visualizar as compras.",
            true
        );

        mostrarEstadoVazio(
            "Faça login para continuar",
            "Entre no Ninho para acessar a lista de compras."
        );

        const estado = $("listaCompras")?.querySelector(".estado-vazio");

        if (estado) {
            const link = document.createElement("a");
            link.href = "login.html";
            link.textContent = "Ir para o login";
            link.className = "botao-acao";
            estado.appendChild(link);
        }

        return false;
    }

    usuario = user;

    const { data: perfil, error: erroPerfil } = await db
        .from("membros")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

    if (erroPerfil) throw erroPerfil;

    if (!perfil) {
        throw new Error(
            "Sua conta está conectada, mas não encontramos seu perfil na tabela membros."
        );
    }

    membroAtual = perfil;
    localStorage.setItem("ninhoId", membroAtual.ninho_id);

    return true;
}

async function carregarMembros() {
    const { data, error } = await db
        .from("membros")
        .select("*")
        .eq("ninho_id", membroAtual.ninho_id);

    if (error) throw error;

    membros = data || [];
}

async function carregarCompras() {
    const { data, error } = await db
        .from("compras")
        .select("*")
        .eq("ninho_id", membroAtual.ninho_id)
        .order("comprado", { ascending: true })
        .order("criado_em", { ascending: false });

    if (error) throw error;

    compras = data || [];
    renderizarCompras();
}

function renderizarCompras() {
    const lista = $("listaCompras");
    const filtro = $("filtroCompras");

    if (!lista || !filtro) return;

    const tipoFiltro = filtro.value;
    const pendentes = compras.filter((item) => !item.comprado);
    const concluidos = compras.filter((item) => item.comprado);

    if ($("totalItens")) $("totalItens").textContent = compras.length;
    if ($("totalPendentes")) $("totalPendentes").textContent = pendentes.length;
    if ($("totalComprados")) $("totalComprados").textContent = concluidos.length;

    let exibidos = compras;

    if (tipoFiltro === "pendentes") exibidos = pendentes;
    if (tipoFiltro === "comprados") exibidos = concluidos;

    if (exibidos.length === 0) {
        mostrarEstadoVazio(
            "Nossa lista está vazia",
            tipoFiltro === "comprados"
                ? "Nenhum item comprado ainda."
                : tipoFiltro === "pendentes"
                    ? "Tudo certo por aqui!"
                    : "Adicione o primeiro item da família."
        );
        return;
    }

    lista.innerHTML = exibidos.map((item) => `
        <article class="item-compra ${item.comprado ? "comprado" : ""}">
            <input
                class="marcador-compra"
                type="checkbox"
                ${item.comprado ? "checked" : ""}
                aria-label="Marcar ${escapar(item.nome)}"
                onchange="alterarStatusCompra('${item.id}', this.checked)"
            >

            <div class="conteudo-item-compra">
                <h3 class="nome-item-compra">${escapar(item.nome)}</h3>

                <div class="detalhes-item-compra">
                    <span>Quantidade: ${escapar(item.quantidade || "1")}</span>
                    <span>·</span>
                    <span>Adicionado por ${escapar(nomeMembro(item.criado_por))}</span>
                </div>

                <div class="detalhes-item-compra">
                    <span class="pilula-compra ${item.comprado ? "concluida" : "pendente"}">
                        ${item.comprado ? "✓ Comprado" : "Pendente"}
                    </span>
                    ${item.comprado
                        ? `<span>Comprado por ${escapar(nomeMembro(item.comprado_por))} · ${escapar(formatarData(item.comprado_em))}</span>`
                        : ""}
                </div>

                <div class="detalhes-item-compra">
                    Adicionado em ${escapar(formatarData(item.criado_em))}
                </div>
            </div>

            <div class="acoes-item-compra">
                <button
                    class="botao-excluir-compra"
                    type="button"
                    onclick="excluirItemCompra('${item.id}')"
                >Excluir</button>
            </div>
        </article>
    `).join("");
}

async function adicionarItemCompra(evento) {
    evento.preventDefault();
    mostrarAviso("");

    const nome = $("nomeItem")?.value.trim();
    const quantidade = $("quantidadeItem")?.value.trim() || "1";

    if (!nome) {
        mostrarAviso("Digite o nome do produto.", true);
        return;
    }

    const botao = $("botaoAdicionar");
    if (botao) {
        botao.disabled = true;
        botao.textContent = "Salvando...";
    }

    try {
        const { error } = await db.from("compras").insert({
            ninho_id: membroAtual.ninho_id,
            nome,
            quantidade,
            criado_por: usuario.id
        });

        if (error) throw error;

        $("formCompra").reset();
        if ($("quantidadeItem")) $("quantidadeItem").value = "1";

        mostrarAviso("Item adicionado à lista!");
        await carregarCompras();
    } catch (erro) {
        console.error("Erro ao adicionar item:", erro);
        mostrarAviso("Não foi possível adicionar o item. Verifique a tabela compras e as permissões.", true);
    } finally {
        if (botao) {
            botao.disabled = false;
            botao.textContent = "Adicionar item";
        }
    }
}

async function alterarStatusCompra(id, comprado) {
    try {
        const { error } = await db
            .from("compras")
            .update({ comprado })
            .eq("id", id)
            .eq("ninho_id", membroAtual.ninho_id);

        if (error) throw error;

        await carregarCompras();
        mostrarAviso(comprado ? "Item marcado como comprado!" : "Item voltou para pendentes.");
    } catch (erro) {
        console.error("Erro ao atualizar item:", erro);
        mostrarAviso("Não foi possível atualizar o item.", true);
    }
}

async function excluirItemCompra(id) {
    const item = compras.find((c) => c.id === id);
    if (!item) return;

    if (!confirm(`Deseja remover "${item.nome}" da lista?`)) return;

    try {
        const { error } = await db
            .from("compras")
            .delete()
            .eq("id", id)
            .eq("ninho_id", membroAtual.ninho_id);

        if (error) throw error;

        await carregarCompras();
        mostrarAviso("Item removido.");
    } catch (erro) {
        console.error("Erro ao excluir item:", erro);
        mostrarAviso("Não foi possível excluir o item.", true);
    }
}

async function iniciarCompras() {
    try {
        const autenticado = await carregarPerfil();
        if (!autenticado) return;

        await carregarMembros();
        await carregarCompras();

        db.channel("lista-compras-" + membroAtual.ninho_id)
            .on("postgres_changes", {
                event: "*",
                schema: "public",
                table: "compras",
                filter: "ninho_id=eq." + membroAtual.ninho_id
            }, async () => {
                await carregarCompras();
            })
            .subscribe();
    } catch (erro) {
        console.error("Erro ao iniciar compras:", erro);
        mostrarAviso(
            erro.message || "Não foi possível carregar a lista de compras.",
            true
        );
        mostrarEstadoVazio(
            "Não conseguimos carregar a lista",
            "Confira sua conexão, a tabela compras e as permissões do Supabase."
        );
    }
}

$("formCompra")?.addEventListener("submit", adicionarItemCompra);
$("filtroCompras")?.addEventListener("change", renderizarCompras);

window.alterarStatusCompra = alterarStatusCompra;
window.excluirItemCompra = excluirItemCompra;

iniciarCompras();
