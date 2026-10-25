
const SUPABASE_URL = "https://ncqimbutzmngrkgvtnqt.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_kM4EsVr5Y22pWEgpn8CTdg_ag3m7aDE";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

// CADASTRO
const formulario = document.getElementById("formularioNinho");

if (formulario) {
    const parametros = new URLSearchParams(window.location.search);
    const tokenConvite = parametros.get("convite");
    if (tokenConvite) {
    localStorage.setItem("convitePendente", tokenConvite);
    }

    const campoNinho = document.getElementById("campoNomeNinho");
    const campoNomeNinho = document.getElementById("nomeNinho");
    const campoPapel = document.getElementById("papel");
    const botaoCadastro = formulario.querySelector('button[type="submit"]');
    const tituloCadastro = document.querySelector(".cabecalho-cadastro h2");
    const etiquetaCadastro = document.querySelector(".etiqueta-cadastro");

    if (tokenConvite) {
    if (campoNinho) {
        campoNinho.hidden = true;
        campoNinho.style.display = "none";
    }

    if (campoNomeNinho) {
        campoNomeNinho.required = false;
    }

    if (campoPapel) {
        campoPapel.value = "MEMBRO";
    }

    if (tituloCadastro) {
        tituloCadastro.textContent = "Entre no Ninho";
    }

    if (etiquetaCadastro) {
        etiquetaCadastro.textContent = "VOCÊ FOI CONVIDADO(A)";
    }

    if (botaoCadastro) {
        botaoCadastro.textContent = "Entrar no Ninho";
    }
}
    formulario.addEventListener("submit", async (evento) => {
        evento.preventDefault();

        const campoNome = document.getElementById("nome");
            const campoEmail = document.getElementById("email");
            const campoSenha = document.getElementById("senha");

            console.log("Campo nome:", campoNome);
            console.log("Campo e-mail:", campoEmail);
            console.log("Campo senha:", campoSenha);

            const nome = campoNome?.value?.trim() ?? "";
            const email = campoEmail?.value?.trim() ?? "";
            const senha = campoSenha?.value ?? "";
        const nomeNinho = campoNomeNinho
            ? campoNomeNinho.value.trim()
            : "";
        const mensagem = document.getElementById("mensagem");

        if (!nome || !email || !senha || (!tokenConvite && !nomeNinho)) {
            mensagem.textContent = "Preencha todos os campos necessários.";
            return;
        }

        if (!tokenConvite && campoPapel && campoPapel.value !== "RESPONSAVEL") {
            mensagem.textContent =
                "Para entrar como membro, acesse o link de convite da família.";
            return;
        }

        if (botaoCadastro) {
            botaoCadastro.disabled = true;
            botaoCadastro.textContent = "Criando sua conta...";
        }

        mensagem.textContent = "Criando sua conta...";

        try {
            const { data, error } = await supabaseClient.auth.signUp({
                email: email,
                password: senha,
                options: {
                    data: {
                        nome: nome,
                        papel: tokenConvite ? "MEMBRO" : "RESPONSAVEL",
                        nome_ninho: tokenConvite ? null : nomeNinho
                    }
                }
            });

            if (error) {
                mensagem.textContent = "Erro no cadastro: " + error.message;
                return;
            }

            if (!data.session) {
                mensagem.textContent =
                    "Conta criada! Entre na sua conta para concluir o acesso ao Ninho.";
                return;
            }

            let ninhoId;

            if (tokenConvite) {
                const { data: idRetornado, error: erroConvite } =
                    await supabaseClient.rpc("entrar_com_convite", {
                        p_token: tokenConvite,
                        p_nome: nome
                    });

                if (erroConvite) {
                    mensagem.textContent =
                        "Sua conta foi criada, mas não foi possível aceitar o convite: " +
                        erroConvite.message;
                    return;
                }

                ninhoId = idRetornado;
            } else {
                const { data: idRetornado, error: erroNinho } =
                    await supabaseClient.rpc("criar_ninho", {
                        p_nome: nomeNinho,
                        p_nome_responsavel: nome
                    });

                if (erroNinho) {
                    mensagem.textContent =
                        "Conta criada, mas houve um erro ao criar o Ninho: " +
                        erroNinho.message;
                    return;
                }

                ninhoId = idRetornado;
                localStorage.setItem("nomeNinho", nomeNinho);
            }

            localStorage.setItem("ninhoId", ninhoId);
            localStorage.setItem("nomeUsuario", nome);

            window.location.href = "inicio.html";
        } catch (erro) {
            console.error(erro);
            mensagem.textContent =
                "Ocorreu um erro inesperado. Tente novamente.";
        } finally {
            if (botaoCadastro && !mensagem.textContent.includes("Conta criada!") &&
                !mensagem.textContent.includes("Ocorreu um erro")) {
                botaoCadastro.disabled = false;
                botaoCadastro.textContent = tokenConvite
                    ? "Entrar no Ninho"
                    : "♥  Formar meu Ninho";
            } else if (botaoCadastro && botaoCadastro.disabled) {
                botaoCadastro.disabled = false;
                botaoCadastro.textContent = tokenConvite
                    ? "Entrar no Ninho"
                    : "♥  Formar meu Ninho";
            }
        }
    });


// BOAS-VINDAS
const tituloBoasVindas = document.getElementById("boasVindas");

if (tituloBoasVindas) {
    const nomeNinho = localStorage.getItem("nomeNinho");

    if (nomeNinho) {
        tituloBoasVindas.textContent = `Bem-vindo(a) ao ${nomeNinho}!`;
    }
}

// GERAR CONVITE
const botaoConvite = document.getElementById("gerarConvite");
const areaConvite = document.getElementById("areaConvite");
const linkConvite = document.getElementById("linkConvite");
const mensagemConvite = document.getElementById("mensagemConvite");
const botaoCopiar = document.getElementById("copiarConvite");

if (botaoConvite) {
    botaoConvite.addEventListener("click", async () => {
        mensagemConvite.textContent = "Gerando convite...";

        const { data: token, error } =
            await supabaseClient.rpc("criar_convite");

        if (error) {
            mensagemConvite.textContent =
                "Erro ao gerar convite: " + error.message;
            return;
        }

        const url = new URL("cadastro.html", window.location.href);
        url.searchParams.set("convite", token);

        linkConvite.value = url.href;
        areaConvite.hidden = false;
        mensagemConvite.textContent =
            "Convite criado! Compartilhe este link com sua família.";
    });
}

if (botaoCopiar) {
    botaoCopiar.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(linkConvite.value);
            mensagemConvite.textContent =
                "Link copiado! Pode enviar à família.";
        } catch {
            linkConvite.select();
            mensagemConvite.textContent =
                "Selecione o link e copie com Ctrl+C.";
        }
    });
}
}
