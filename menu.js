
(() => {
    const paginaAtual = window.location.pathname.split("/").pop() || "inicio.html";

    const links = [
        { arquivo: "inicio.html", icone: "⌂", nome: "Início" },
        { arquivo: "geladeira.html", icone: "❄", nome: "Geladeira" },
        { arquivo: "tarefas.html", icone: "✓", nome: "Tarefas" },
        { arquivo: "compras.html", icone: "♡", nome: "Lista de compras" },
        { arquivo: "pontuacao.html", icone: "☆", nome: "Pontuações" },
        { arquivo: "refeicoes.html", icone: "♧", nome: "Receitas" },
        { arquivo: "calendario.html", icone: "▦", nome: "Calendário" },
        { arquivo: "membros.html", icone: "♧", nome: "Membros" }
    ];

    function criarLink(link, mobile = false) {
        const a = document.createElement("a");
        a.href = link.arquivo;
        a.className = mobile ? "link-inferior" : "link-menu";

        if (paginaAtual === link.arquivo) {
            a.classList.add("ativo");
            a.setAttribute("aria-current", "page");
        }

        const icone = document.createElement("span");
        icone.textContent = link.icone;

        const texto = document.createElement(mobile ? "small" : "span");
        texto.textContent = link.nome;

        a.append(icone, texto);
        return a;
    }

    function iniciarMenu() {
        if (document.querySelector(".layout-ninho")) return;

        const layout = document.createElement("div");
        layout.className = "layout-ninho";

        const menu = document.createElement("aside");
        menu.className = "menu-lateral";

        const logo = document.createElement("a");
        logo.className = "logo-ninho";
        logo.href = "inicio.html";
        logo.append(
            document.createTextNode("ninho"),
            Object.assign(document.createElement("span"), {
                textContent: "."
            })
        );

        const legenda = document.createElement("p");
        legenda.className = "menu-legenda";
        legenda.textContent = "SUA CASA, EM HARMONIA";

        const lista = document.createElement("nav");
        lista.className = "links-menu";
        lista.setAttribute("aria-label", "Menu principal");

        links.forEach(link => lista.appendChild(criarLink(link)));

        const mensagem = document.createElement("div");
        mensagem.className = "mensagem-menu";
        mensagem.innerHTML =
            "<span>☁</span><p>Um lar organizado começa com pequenos cuidados.</p>";

        const sair = document.createElement("button");
        sair.type = "button";
        sair.className = "botao-sair";
        sair.textContent = "↪ Sair da conta";

        sair.addEventListener("click", async () => {
            if (!confirm("Deseja sair da sua conta?")) return;

            try {
                const cliente = window.supabase.createClient(
                    "https://ncqimbutzmngrkgvtnqt.supabase.co",
                    "sb_publishable_kM4EsVr5Y22pWEgpn8CTdg_ag3m7aDE"
                );

                const { error } = await cliente.auth.signOut();

                if (error) throw error;

                localStorage.removeItem("ninhoId");
                localStorage.removeItem("nomeUsuario");
                localStorage.removeItem("nomeNinho");

                window.location.href = "login.html";
            } catch (erro) {
                console.error(erro);
                alert("Não foi possível sair. Tente novamente.");
            }
        });

        menu.append(logo, legenda, lista, mensagem, sair);

        const conteudo = document.createElement("div");
        conteudo.className = "conteudo-ninho";

        const topo = document.createElement("header");
        topo.className = "topo-mobile";

        const logoMobile = logo.cloneNode(true);
        const detalhe = document.createElement("span");
        detalhe.className = "detalhe-topo";
        detalhe.textContent = "Cuidando do lar, juntos.";

        topo.append(logoMobile, detalhe);

        const barra = document.createElement("nav");
        barra.className = "menu-inferior";
        barra.setAttribute("aria-label", "Navegação mobile");

        // No celular, exibe os cinco atalhos mais importantes.
        const atalhosMobile = [
            "inicio.html",
            "geladeira.html",
            "tarefas.html",
            "compras.html",
            "calendario.html"
        ];

        links
            .filter(link => atalhosMobile.includes(link.arquivo))
            .forEach(link => barra.appendChild(criarLink(link, true)));

        // Mantém o conteúdo existente da página.
        const elementos = Array.from(document.body.children);
        elementos.forEach(elemento => {
            if (elemento.tagName === "SCRIPT") return;
            conteudo.appendChild(elemento);
        });

        conteudo.prepend(topo);
        layout.append(menu, conteudo);
        document.body.append(layout, barra);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciarMenu);
    } else {
        iniciarMenu();
    }
})();
