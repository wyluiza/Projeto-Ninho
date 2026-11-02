const SUPABASE_URL = "https://ncqimbutzmngrkgvtnqt.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_kM4EsVr5Y22pWEgpn8CTdg_ag3m7aDE";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

const formulario = document.getElementById("formularioNinho");

if (formulario) {
    const parametros = new URLSearchParams(window.location.search);
    const tokenConvite =
        parametros.get("convite") ||
        localStorage.getItem("convitePendente");

    if (tokenConvite) {
        localStorage.setItem("convitePendente", tokenConvite);
    }

    const campoNinho = document.getElementById("campoNomeNinho");
    const campoNomeNinho = document.getElementById("nomeNinho");
    const campoPapel = document.getElementById("papel");
    const botaoCadastro = formulario.querySelector('button[type="submit"]');
    const tituloCadastro = document.querySelector(".cabecalho-cadastro h2");
    const etiquetaCadastro = document.querySelector(".etiqueta-cadastro");
    const mensagem = document.getElementById("mensagem");

    if (tokenConvite) {
        if (campoNinho) {
            campoNinho.hidden = true;
            campoNinho.style.display = "none";
        }

        if (campoNomeNinho) campoNomeNinho.required = false;
        if (campoPapel) campoPapel.value = "MEMBRO";
        if (tituloCadastro) tituloCadastro.textContent = "Entre no Ninho";
        if (etiquetaCadastro) etiquetaCadastro.textContent = "VOCÊ FOI CONVIDADO(A)";
        if (botaoCadastro) botaoCadastro.textContent = "Entrar no Ninho";
    }

    formulario.addEventListener("submit", async (evento) => {
        evento.preventDefault();

        const nome = document.getElementById("nome")?.value?.trim() || "";
        const email = document.getElementById("email")?.value?.trim() || "";
        const senha = document.getElementById("senha")?.value || "";
        const nomeNinho = campoNomeNinho?.value?.trim() || "";

        if (!nome || !email || !senha || (!tokenConvite && !nomeNinho)) {
            if (mensagem) mensagem.textContent = "Preencha todos os campos necessários.";
            return;
        }

        if (!tokenConvite && campoPapel && campoPapel.value !== "RESPONSAVEL") {
            if (mensagem) {
                mensagem.textContent = "Para entrar como membro, acesse o link de convite da família.";
            }
            return;
        }

        if (botaoCadastro) {
            botaoCadastro.disabled = true;
            botaoCadastro.textContent = "Criando sua conta...";
        }

        if (mensagem) mensagem.textContent = "Criando sua conta...";

        try {
            const { data, error } = await supabaseClient.auth.signUp({
                email,
                password: senha,
                options: {
                    data: {
                        nome,
                        papel: tokenConvite ? "MEMBRO" : "RESPONSAVEL",
                        nome_ninho: tokenConvite ? null : nomeNinho
                    }
                }
            });

            if (error) throw error;

            if (!data.session) {
                if (mensagem) {
                    mensagem.textContent =
                        "Conta criada! Confirme seu e-mail e entre na sua conta para concluir o acesso ao Ninho.";
                }
                return;
            }

            let ninhoId;

            if (tokenConvite) {
                const { data: idRetornado, error: erroConvite } =
                    await supabaseClient.rpc("entrar_com_convite", {
                        p_token: tokenConvite,
                        p_nome: nome
                    });

                if (erroConvite) throw erroConvite;

                ninhoId = idRetornado;
                localStorage.removeItem("convitePendente");
            } else {
                const { data: idRetornado, error: erroNinho } =
                    await supabaseClient.rpc("criar_ninho", {
                        p_nome: nomeNinho,
                        p_nome_responsavel: nome
                    });

                if (erroNinho) throw erroNinho;

                ninhoId = idRetornado;
                localStorage.setItem("nomeNinho", nomeNinho);
            }

            if (ninhoId) localStorage.setItem("ninhoId", ninhoId);
            localStorage.setItem("nomeUsuario", nome);

            window.location.href = "inicio.html";
        } catch (erro) {
            console.error("Erro no cadastro/convite:", erro);

            if (mensagem) {
                mensagem.textContent =
                    erro.message || "Ocorreu um erro inesperado. Tente novamente.";
            }
        } finally {
            if (botaoCadastro) {
                botaoCadastro.disabled = false;
                botaoCadastro.textContent = tokenConvite
                    ? "Entrar no Ninho"
                    : "♥  Formar meu Ninho";
            }
        }
    });
}


const tituloBoasVindas = document.getElementById("boasVindas");

if (tituloBoasVindas) {
    async function carregarNomeNinho() {
        const { data: usuario } = await supabaseClient.auth.getUser();

        if (!usuario.user) {
            tituloBoasVindas.textContent = "Bem-vindo(a) ao seu Ninho!";
            return;
        }

        const { data: nomeNinho, error } =
            await supabaseClient.rpc("obter_nome_ninho");

        if (error) {
            console.error("Erro ao buscar Ninho:", error);
            tituloBoasVindas.textContent = "Bem-vindo(a) ao seu Ninho!";
            return;
        }

        if (nomeNinho) {
            tituloBoasVindas.textContent =
                `Bem-vindo(a) ao ${nomeNinho}!`;

            localStorage.setItem("nomeNinho", nomeNinho);
        }
    }

    carregarNomeNinho();
}


const botaoConvite = document.getElementById("gerarConvite");
const areaConvite = document.getElementById("areaConvite");
const linkConvite = document.getElementById("linkConvite");
const mensagemConvite = document.getElementById("mensagemConvite");
const botaoCopiar = document.getElementById("copiarConvite");

if (botaoConvite) {
    botaoConvite.addEventListener("click", async () => {
        botaoConvite.disabled = true;

        if (mensagemConvite) {
            mensagemConvite.textContent = "Gerando convite...";
        }

        try {
            const { data, error } =
                await supabaseClient.rpc("criar_convite");

            if (error) throw error;

            const token = typeof data === "string"
                ? data
                : data?.token || data?.convite_token || data?.criar_convite;

            if (!token) {
                throw new Error("O Supabase não retornou o código do convite.");
            }

            const url = new URL("cadastro.html", window.location.href);
            url.searchParams.set("convite", token);

            if (linkConvite) {
                linkConvite.value = url.href;
                linkConvite.readOnly = true;
            }

            if (areaConvite) areaConvite.hidden = false;

            if (mensagemConvite) {
                mensagemConvite.textContent =
                    "Convite criado! Compartilhe este link com sua família.";
            }
        } catch (erro) {
            console.error("Erro ao gerar convite:", erro);

            if (mensagemConvite) {
                mensagemConvite.textContent =
                    "Erro ao gerar convite: " + (erro.message || "Tente novamente.");
            }
        } finally {
            botaoConvite.disabled = false;
        }
    });
}

if (botaoCopiar) {
    botaoCopiar.addEventListener("click", async () => {
        const texto = linkConvite?.value || "";

        if (!texto) {
            if (mensagemConvite) {
                mensagemConvite.textContent = "Gere um convite antes de copiar o link.";
            }
            return;
        }

        try {
            await navigator.clipboard.writeText(texto);

            if (mensagemConvite) {
                mensagemConvite.textContent = "Link copiado! Pode enviar à família.";
            }
        } catch {
            linkConvite.focus();
            linkConvite.select();

            if (mensagemConvite) {
                mensagemConvite.textContent = "Copie o link selecionado com Ctrl+C.";
            }
        }
    });
}
// RESUMO FAMILIAR DO NINHO
async function carregarResumoFamiliar() {
    const { data: usuarioData } = await supabaseClient.auth.getUser();

    if (!usuarioData.user) return;

    const { data: membro } = await supabaseClient
        .from("membros")
        .select("ninho_id")
        .eq("id", usuarioData.user.id)
        .single();

    if (!membro) return;

    const ninhoId = membro.ninho_id;

    // Próximo evento
    const { data: eventos } = await supabaseClient
        .from("eventos_ninho")
        .select("titulo,data_evento")
        .eq("ninho_id", ninhoId)
        .gte("data_evento", new Date().toISOString().split("T")[0])
        .order("data_evento", { ascending: true })
        .limit(1);

    document.getElementById("resumoEvento").textContent =
        eventos?.length
            ? `${eventos[0].titulo} - ${new Date(eventos[0].data_evento + "T00:00:00").toLocaleDateString("pt-BR")}`
            : "Nenhum evento próximo 💙";

    // Tarefas pendentes
    const { count: tarefas } = await supabaseClient
        .from("tarefas_ninho")
        .select("*", { count: "exact", head: true })
        .eq("ninho_id", ninhoId)
        .eq("concluida", false);

    document.getElementById("resumoTarefas").textContent =
        `${tarefas ?? 0} tarefa(s) pendente(s)`;

    // Compras pendentes
    const { count: compras } = await supabaseClient
        .from("compras")
        .select("*", { count: "exact", head: true })
        .eq("ninho_id", ninhoId)
        .eq("comprado", false);

    document.getElementById("resumoCompras").textContent =
        `${compras ?? 0} item(ns) na lista`;
}

carregarResumoFamiliar();