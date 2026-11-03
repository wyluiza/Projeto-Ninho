
const SUPABASE_URL = "https://ncqimbutzmngrkgvtnqt.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_kM4EsVr5Y22pWEgpn8CTdg_ag3m7aDE";

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const ranking = document.getElementById("ranking");
const mensagem = document.getElementById("mensagemPontos");

function escapar(texto = "") {
    return String(texto).replace(/[&<>"']/g, c => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[c]));
}

async function carregarPontuacao() {
    try {
        const { data: { user }, error: erroLogin } = await db.auth.getUser();

        if (erroLogin) throw erroLogin;

        if (!user) {
            mensagem.innerHTML = 'Faça login para visualizar a pontuação.';
            return;
        }

        const { data: membro, error: erroMembro } = await db
            .from("membros")
            .select("ninho_id")
            .eq("id", user.id)
            .maybeSingle();

        if (erroMembro) throw erroMembro;
        if (!membro) throw new Error("Seu perfil não foi encontrado.");

        const { data: membros, error: erroLista } = await db
            .from("membros")
            .select("id,nome,papel")
            .eq("ninho_id", membro.ninho_id);

        if (erroLista) throw erroLista;

        const { data: tarefas, error: erroTarefas } = await db
            .from("tarefas_ninho")
            .select("membro_id,estrelas,estrelas_extras,confirmada")
            .eq("ninho_id", membro.ninho_id)
            .eq("confirmada", true);

        if (erroTarefas) throw erroTarefas;

        const pontuacoes = {};

        membros.forEach(m => {
            pontuacoes[m.id] = 0;
        });

        tarefas.forEach(t => {
            if (pontuacoes[t.membro_id] !== undefined) {
                pontuacoes[t.membro_id] +=
                    Number(t.estrelas || 0) +
                    Number(t.estrelas_extras || 0);
            }
        });

        const ordenados = membros
            .filter(m => m.papel !== "RESPONSAVEL")
            .sort((a, b) => pontuacoes[b.id] - pontuacoes[a.id]);

        mensagem.textContent = "Estrelas conquistadas pelas tarefas confirmadas 💙";

        if (!ordenados.length) {
            ranking.innerHTML = '<div class="mensagem-pontos">Ainda não há membros.</div>';
            return;
        }

        ranking.innerHTML = ordenados.map((m, i) => `
            <article class="membro-pontos">
                <span class="posicao">${i + 1}º</span>

                <div class="info-pontos">
                    <h3>${escapar(m.nome || "Membro")}</h3>
                    <p>${i === 0 && pontuacoes[m.id] > 0 ? "Destaque do Ninho ✨" : "Cada cuidado faz diferença!"}</p>
                </div>

                <div class="total-estrelas">
                    ⭐ ${pontuacoes[m.id]}
                </div>
            </article>
        `).join("");

    
            } catch (erro) {
                console.error("Erro na pontuação:", erro);

                mensagem.textContent =
                    mensagem.textContent = "Não foi possível carregar a pontuação. Verifique sua conexão.";
            }

}

carregarPontuacao();
