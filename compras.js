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
let canalRealtime = null;
let atualizando = false;

function escapar(valor = "") {
    return String(valor).replace(/[&<>"']/g, (caractere) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[caractere]));
}

function mostrarAviso(texto, erro = false) {
    const aviso = $("avisoCompras");
    if (!aviso) return;

    aviso.textContent = texto;
    aviso.hidden = false;
    aviso.classList.toggle("erro", erro);
}

function limparAviso() {
    const aviso = $("avisoCompras");
    if (!aviso) return;

    aviso.hidden = true;
    aviso.classList.remove("erro");
}

function nomeMembro(id) {
    const membro = membros.find((item) => item.id === id);

    return membro?.nome ||
        membro?.nome_completo ||
        "Membro da família";
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

function mostrarEstadoVazio(titulo, descricao) {
    const lista = $("listaCompras");
    if (!lista) return;

    lista.innerHTML = `
        <div class="estado-vazio">
            <span>☁</span>
            <h3>${escapar(titulo)}</h3>
            <p>${escapar(descricao)}</p>
        </div>`;
}

async function carregarPerfil() {
    const { data, error } = await db.auth.getUser();

    if (error) throw error;

    usuario = data?.user;

    if (!usuario) {
        mostrarAviso("Entre na sua conta do Ninho para visualizar as compras.", true);

        mostrarEstadoVazio(
            "Faça login para continuar",
            "Entre na sua conta para acessar a lista de compras."
        );

        const estado = $("listaCompras")?.querySelector(".estado-vazio");

        if (estado) {
            const link = document.createElement("a");
            link.href = "login.html";
            link.className = "botao-acao";
            link.textContent = "Entrar no Ninho";
            link.style.display = "inline-block";
            link.style.marginTop = "12px";
            estado.appendChild(link);
        }

        return false;
    }

    const { data: perfil, error: erroPerfil } = await db
        .from("membros")
        .select("*")
        .eq("id", usuario.id)
        .maybeSingle();

    if (erroPerfil) throw erroPerfil;

    if (!perfil || !perfil.ninho_id) {
        throw new Error(
            "Sua conta está conectada, mas não encontramos seu perfil ou o Ninho associado."
        );
    }

    membroAtual = perfil;

    localStorage.setItem("ninhoId", membroAtual.ninho_id);

    if (membroAtual.nome) {
        localStorage.setItem("nomeUsuario", membroAtual.nome);
    }

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
    const filtro = $("filtroCompras");
    const lista = $("listaCompras");

    if (!filtro || !lista) return;

    const tipoFiltro = filtro.value;
    const pendentes = compras.filter((item) => !item.comprado);
    const concluidos = compras.filter((item) => item.comprado);

    if ($("totalItens")) $("totalItens").textContent = compras.length;
    if ($("totalPendentes")) $("totalPendentes").textContent = pendentes.length;
    if ($("totalComprados")) $("totalComprados").textContent = concluidos.length;

    let listaFiltrada = compras;

    if (tipoFiltro === "pendentes") {
        listaFiltrada = pendentes;
    } else if (tipoFiltro === "comprados") {
        listaFiltrada = concluidos;
    }

    if (listaFiltrada.length === 0) {
        const mensagem = tipoFiltro === "pendentes"
            ? "Tudo certo por aqui!"
            : tipoFiltro === "comprados"
                ? "Nenhum item comprado ainda."
                : "Adicione o primeiro item da família.";

        mostrarEstadoVazio(
            tipoFiltro === "todos"
                ? "Nossa lista está vazia"
                : "Nenhum item encontrado",
            mensagem
        );

        return;
    }

    lista.innerHTML = listaFiltrada.map((item) => {
        const status = item.comprado
            ? '<span class="pilula-compra concluida">✓ Comprado</span>'
            : '<span class="pilula-compra pendente">Pendente</span>';

        const detalhesCompra = item.comprado
            ? `
                <span>Comprado por ${escapar(nomeMembro(item.comprado_por))}</span>
                <span>·</span>
                <span>${escapar(formatarData(item.comprado_em))}</span>`
            : "<span>Ainda não comprado</span>";

        return `
            <article class="item-compra ${item.comprado ? "comprado" : ""}">
                <input
                    class="marcador-compra"
                    type="checkbox"
                    aria-label="${item.comprado ? "Desmarcar" : "Marcar"} ${escapar(item.nome)}"
                    ${item.comprado ? "checked" : ""}
                    onchange="alterarStatusCompra('${item.id}', this.checked)"
                >

                <div class="conteudo-item-compra">
                    <h3 class="nome-item-compra">${escapar(item.nome)}</h3>

                    <div class="detalhes-item-compra">
                        <span>Quantidade: ${escapar(item.quantidade || "1")}</span>
                        <span>·</span>
                        <span>Adicionado por ${escapar(nomeMembro(item.criado_por))}</span>
                    </div>

                    <div class="detalhes-item-compra" style="margin-top: 5px;">
                        ${status}
                        ${detalhesCompra}
                    </div>

                    <div class="detalhes-item-compra" style="margin-top: 5px;">
                        Adicionado em ${escapar(formatarData(item.criado_em))}
                    </div>
                </div>

                <div class="acoes-item-compra">
                    <button
                        class="botao-excluir-compra"
                        type="button"
                        onclick="excluirItemCompra('${item.id}')"
                        aria-label="Excluir ${escapar(item.nome)}"
                    >Excluir</button>
                </div>
            </article>`;
    }).join("");
}

async function adicionarItemCompra(evento) {
    evento.preventDefault();
    limparAviso();

    const campoNome = $("nomeItem");
    const campoQuantidade = $("quantidadeItem");

    const nome = campoNome?.value.trim() || "";
    const quantidade = campoQuantidade?.value.trim() || "";

    if (!nome || !quantidade) {
        mostrarAviso("Preencha o nome e a quantidade do item.", true);
        return;
    }

    if (!usuario || !membroAtual) {
        mostrarAviso("Sua sessão expirou. Entre novamente no Ninho.", true);
        return;
    }

    const botao = $("botaoAdicionar");

    if (botao) {
        botao.disabled = true;
        botao.textContent = "Salvando...";
    }

    try {
        const { error } = await db
            .from("compras")
            .insert({
                ninho_id: membroAtual.ninho_id,
                nome,
                quantidade,
                criado_por: usuario.id
            });

        if (error) throw error;

        $("formCompra")?.reset();

        if (campoNome) campoNome.focus();
        if (campoQuantidade) campoQuantidade.value = "1";

        mostrarAviso("Item adicionado à lista da família!");
        await carregarCompras();

    } catch (erro) {
        console.error("Erro ao adicionar item:", erro);

        mostrarAviso(
            "Erro ao adicionar: " + (erro.message || "Verifique as permissões do Supabase."),
            true
        );
    } finally {
        if (botao) {
            botao.disabled = false;
            botao.innerHTML = 'Adicionar item <span>♡</span>';
        }
    }
}

async function alterarStatusCompra(id, comprado) {
    limparAviso();

    if (!membroAtual) {
        mostrarAviso("Sua sessão expirou. Entre novamente no Ninho.", true);
        return;
    }

    try {
        const { error } = await db
            .from("compras")
            .update({ comprado })
            .eq("id", id)
            .eq("ninho_id", membroAtual.ninho_id);

        if (error) throw error;

        await carregarCompras();

        mostrarAviso(
            comprado
                ? "Compra marcada como concluída!"
                : "Item voltou para a lista de pendentes."
        );

    } catch (erro) {
        console.error("Erro ao atualizar compra:", erro);

        mostrarAviso("Erro ao atualizar: " + (erro.message || "Tente novamente."), true);

        await carregarCompras();
    }
}

async function excluirItemCompra(id) {
    const item = compras.find((compra) => compra.id === id);
    if (!item) return;

    if (!membroAtual) {
        mostrarAviso("Sua sessão expirou. Entre novamente no Ninho.", true);
        return;
    }

    const confirmar = window.confirm(
        `Deseja remover "${item.nome}" da lista de compras?`
    );

    if (!confirmar) return;

    limparAviso();

    try {
        const { error } = await db
            .from("compras")
            .delete()
            .eq("id", id)
            .eq("ninho_id", membroAtual.ninho_id);

        if (error) throw error;

        mostrarAviso("Item removido da lista.");
        await carregarCompras();

    } catch (erro) {
        console.error("Erro ao excluir item:", erro);

        mostrarAviso(
            "Erro ao excluir: " + (erro.message || "Verifique as permissões do Supabase."),
            true
        );
    }
}

async function iniciarCompras() {
    try {
        const perfilCarregado = await carregarPerfil();

        if (!perfilCarregado) return;

        await carregarMembros();
        await carregarCompras();

        canalRealtime = db
            .channel("lista-compras-" + membroAtual.ninho_id)
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "compras",
                    filter: "ninho_id=eq." + membroAtual.ninho_id
                },
                async () => {
                    if (atualizando) return;

                    atualizando = true;

                    try {
                        await carregarCompras();
                    } catch (erro) {
                        console.error("Erro ao sincronizar lista de compras:", erro);
                    } finally {
                        atualizando = false;
                    }
                }
            )
            .subscribe();

    } catch (erro) {
        console.error("Erro ao abrir lista de compras:", erro);

        mostrarAviso(
            "Não foi possível carregar as compras: " +
            (erro.message || "Confira sua conexão e o Supabase."),
            true
        );

        mostrarEstadoVazio(
            "Não conseguimos carregar a lista",
            "Confira a tabela compras, as colunas utilizadas e as permissões do Supabase."
        );
    }
}

$("formCompra")?.addEventListener("submit", adicionarItemCompra);
$("filtroCompras")?.addEventListener("change", renderizarCompras);

window.alterarStatusCompra = alterarStatusCompra;
window.excluirItemCompra = excluirItemCompra;

iniciarCompras();