
(() => {
'use strict';

const $ = id => document.getElementById(id);

const CHAVE_RECEITAS_PERSONALIZADAS = 'ninhoReceitasPersonalizadas';
const CHAVE_GELADEIRA = 'ninhoGeladeira';
const CHAVE_FAVORITAS = 'ninhoReceitasFavoritas';

let alimentos = [];
let receitaAberta = null;
let mostrarFavoritas = false;

const receitas = [
{
id:1,nome:'Pão com ovo',emoji:'🍳',categorias:['cafe','lanche'],
tempo:10,dificuldade:'Muito fácil',descricao:'Um clássico rápido para qualquer hora.',
ingredientes:[['pao','Pão',1,'un'],['ovo','Ovo',1,'un'],['manteiga','Manteiga',5,'g']],
modo:['Aqueça uma frigideira.','Prepare o ovo.','Sirva com o pão.']
},
{
id:2,nome:'Omelete simples',emoji:'🍳',categorias:['cafe','lanche','almoco','janta'],
tempo:8,dificuldade:'Muito fácil',descricao:'Uma refeição prática e saborosa.',
ingredientes:[['ovo','Ovo',2,'un'],['sal','Sal',2,'g']],
modo:['Bata os ovos com sal.','Coloque em uma frigideira.','Cozinhe e dobre ao meio.']
},
{
id:3,nome:'Panqueca de banana',emoji:'🥞',categorias:['cafe','lanche'],
tempo:12,dificuldade:'Fácil',descricao:'Panquequinhas doces feitas na frigideira.',
ingredientes:[['banana','Banana',1,'un'],['ovo','Ovo',1,'un']],
modo:['Amasse a banana.','Misture o ovo.','Doure pequenas porções na frigideira.']
},
{
id:4,nome:'Banana dourada com canela',emoji:'🍌',categorias:['cafe','lanche','doce'],
tempo:7,dificuldade:'Muito fácil',descricao:'Uma sobremesa quentinha e simples.',
ingredientes:[['banana','Banana',1,'un']],
modo:['Corte a banana.','Doure dos dois lados.','Finalize com canela.']
},
{
id:5,nome:'Queijo quente',emoji:'🥪',categorias:['cafe','lanche'],
tempo:8,dificuldade:'Muito fácil',descricao:'Sanduíche crocante com queijo derretido.',
ingredientes:[['pao','Pão',2,'un'],['queijo','Queijo',30,'g']],
modo:['Coloque o queijo entre duas fatias de pão.','Doure na frigideira.','Vire até derreter.']
},
{
id:6,nome:'Misto quente',emoji:'🥪',categorias:['cafe','lanche'],
tempo:8,dificuldade:'Muito fácil',descricao:'Uma opção rápida para o lanche.',
ingredientes:[['pao','Pão',2,'un'],['queijo','Queijo',30,'g'],['presunto','Presunto',20,'g']],
modo:['Monte o sanduíche.','Doure na frigideira.','Sirva quentinho.']
},
{
id:7,nome:'Ovo mexido cremoso',emoji:'🥚',categorias:['cafe','lanche'],
tempo:5,dificuldade:'Muito fácil',descricao:'Ovos mexidos rápidos e cremosos.',
ingredientes:[['ovo','Ovo',2,'un'],['manteiga','Manteiga',5,'g']],
modo:['Bata os ovos.','Derreta a manteiga.','Mexa os ovos em fogo baixo.']
},
{
id:8,nome:'Macarrão alho e óleo',emoji:'🍝',categorias:['almoco','janta'],
tempo:20,dificuldade:'Fácil',descricao:'Uma massa econômica e saborosa.',
ingredientes:[['macarrao','Macarrão',100,'g'],['alho','Alho',1,'un'],['oleo','Óleo',10,'ml']],
modo:['Cozinhe o macarrão.','Doure o alho no óleo.','Misture e sirva.']
},
{
id:9,nome:'Arroz com ovo',emoji:'🍚',categorias:['almoco','janta'],
tempo:10,dificuldade:'Muito fácil',descricao:'Uma refeição simples para aproveitar arroz pronto.',
ingredientes:[['arroz','Arroz',150,'g'],['ovo','Ovo',1,'un']],
modo:['Aqueça o arroz.','Prepare o ovo.','Sirva junto.']
},
{
id:10,nome:'Batata dourada',emoji:'🥔',categorias:['almoco','janta','lanche'],
tempo:25,dificuldade:'Fácil',descricao:'Batata macia por dentro e douradinha por fora.',
ingredientes:[['batata','Batata',200,'g'],['oleo','Óleo',10,'ml']],
modo:['Corte a batata.','Cozinhe até amolecer.','Doure na frigideira.']
},
{
id:11,nome:'Brigadeiro de panela',emoji:'🍫',categorias:['doce','lanche'],
tempo:15,dificuldade:'Fácil',descricao:'Doce de chocolate preparado na panela.',
ingredientes:[['leitecondensado','Leite condensado',395,'g'],['chocolate','Chocolate em pó',20,'g'],['manteiga','Manteiga',10,'g']],
modo:['Misture os ingredientes.','Mexa em fogo baixo.','Desligue quando engrossar.']
},
{
id:12,nome:'Chocolate quente',emoji:'☕',categorias:['cafe','lanche','doce'],
tempo:8,dificuldade:'Fácil',descricao:'Bebida quentinha para dias frios.',
ingredientes:[['leite','Leite',200,'ml'],['chocolate','Chocolate em pó',15,'g']],
modo:['Misture os ingredientes.','Aqueça mexendo.','Sirva morno.']
},
{
id:13,nome:'Tapioca com queijo',emoji:'🧀',categorias:['cafe','lanche'],
tempo:8,dificuldade:'Muito fácil',descricao:'Lanche rápido feito na frigideira.',
ingredientes:[['tapioca','Goma de tapioca',50,'g'],['queijo','Queijo',30,'g']],
modo:['Espalhe a goma na frigideira.','Coloque o queijo.','Dobre e aqueça.']
},
{
id:14,nome:'Crepioca',emoji:'🥞',categorias:['cafe','lanche'],
tempo:8,dificuldade:'Fácil',descricao:'Massa rápida de ovo e tapioca.',
ingredientes:[['ovo','Ovo',1,'un'],['tapioca','Goma de tapioca',30,'g']],
modo:['Bata o ovo e misture a tapioca.','Despeje na frigideira.','Doure dos dois lados.']
},
{
id:15,nome:'Tomate com ovo',emoji:'🍅',categorias:['cafe','almoco','janta'],
tempo:10,dificuldade:'Fácil',descricao:'Ovos preparados na frigideira com tomate.',
ingredientes:[['tomate','Tomate',1,'un'],['ovo','Ovo',2,'un']],
modo:['Pique o tomate.','Adicione os ovos.','Tampe e cozinhe.']
},
{
id:16,nome:'Salada simples',emoji:'🥗',categorias:['almoco','janta'],
tempo:10,dificuldade:'Muito fácil',descricao:'Uma salada fresca com vegetais.',
ingredientes:[['alface','Alface',50,'g'],['tomate','Tomate',1,'un']],
modo:['Lave os vegetais.','Corte em pedaços.','Tempere e sirva.']
},
{
id:17,nome:'Bolo simples de panela',emoji:'🧁',categorias:['doce','lanche'],
tempo:20,dificuldade:'Fácil',descricao:'Um bolinho doce feito no fogão.',
ingredientes:[['ovo','Ovo',1,'un'],['farinha','Farinha',100,'g'],['acucar','Açúcar',50,'g'],['leite','Leite',100,'ml'],['fermento','Fermento',5,'g']],
modo:['Misture os ingredientes líquidos.','Adicione farinha e fermento.','Cozinhe em recipiente adequado, dentro de panela tampada.']
},
{
id:18,nome:'Mingau de aveia',emoji:'🥣',categorias:['cafe','lanche','doce'],
tempo:7,dificuldade:'Muito fácil',descricao:'Café da manhã quentinho e econômico.',
ingredientes:[['leite','Leite',200,'ml'],['aveia','Aveia',30,'g']],
modo:['Misture leite e aveia.','Cozinhe mexendo.','Sirva quando engrossar.']
},
{
id:19,nome:'Pipoca de panela',emoji:'🍿',categorias:['lanche','doce'],
tempo:8,dificuldade:'Fácil',descricao:'Lanche para dividir com a família.',
ingredientes:[['milho','Milho',50,'g'],['oleo','Óleo',10,'ml']],
modo:['Coloque óleo e milho na panela.','Tampe e aqueça.','Desligue quando os estouros diminuírem.']
},
{
id:20,nome:'Panqueca salgada',emoji:'🥞',categorias:['almoco','janta','lanche'],
tempo:15,dificuldade:'Fácil',descricao:'Massa simples feita à mão.',
ingredientes:[['ovo','Ovo',1,'un'],['farinha','Farinha',60,'g'],['leite','Leite',100,'ml']],
modo:['Misture os ingredientes.','Despeje na frigideira.','Doure dos dois lados.']
},
{
id:21,nome:'Pão com manteiga',emoji:'🍞',categorias:['cafe','lanche'],
tempo:5,dificuldade:'Muito fácil',descricao:'Pão quentinho e dourado.',
ingredientes:[['pao','Pão',1,'un'],['manteiga','Manteiga',10,'g']],
modo:['Passe manteiga no pão.','Doure na frigideira.','Vire para aquecer dos dois lados.']
},
{
id:22,nome:'Doce de banana',emoji:'🍌',categorias:['doce','lanche'],
tempo:15,dificuldade:'Fácil',descricao:'Banana cozida até ficar macia e docinha.',
ingredientes:[['banana','Banana',2,'un']],
modo:['Corte as bananas.','Cozinhe em fogo baixo com água.','Mexa até ficar com textura de doce.']
}
];

/* ==========================================
   NORMALIZAÇÃO E INGREDIENTES
========================================== */

function normalizar(texto) {
  return String(texto || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function chaveAlimento(nome) {
  const n = normalizar(nome).replace(/[^a-z0-9]/g, '').replace(/s$/, '');

  if (n.includes('leite')) return 'leite';

  const mapa = {
    ovo: ['ovo','ovos'],
    pao: ['pao','paes'],
    leite: ['leite'],
    queijo: ['queijo'],
    banana: ['banana'],
    manteiga: ['manteiga','margarina'],
    oleo: ['oleo','azeite'],
    sal: ['sal'],
    acucar: ['acucar'],
    aveia: ['aveia'],
    macarrao: ['macarrao','massa'],
    alho: ['alho'],
    arroz: ['arroz'],
    batata: ['batata'],
    chocolate: ['chocolate','cacau'],
    leitecondensado: ['leitecondensado','condensado'],
    presunto: ['presunto'],
    tomate: ['tomate'],
    alface: ['alface','folhas','couve'],
    tapioca: ['tapioca','gomadetapioca'],
    farinha: ['farinha','farinhadetrigo'],
    fermento: ['fermento'],
    milho: ['milho','milhoparapipoca']
  };

  for (const [key, values] of Object.entries(mapa)) {
    if (values.includes(n)) return key;
  }

  return n;
}

function unidadeNormalizada(unidade) {
  const u = normalizar(unidade).replace(/\./g, '');

  if (['kg','quilo','quilos'].includes(u)) return 'kg';
  if (['g','gr','grama','gramas'].includes(u)) return 'g';
  if (['l','litro','litros'].includes(u)) return 'l';
  if (['ml','mililitro','mililitros'].includes(u)) return 'ml';
  if (['un','und','unidade','unidades'].includes(u)) return 'un';
  if (['cx','caixa','caixas'].includes(u)) return 'cx';
  if (['pct','pacote','pacotes'].includes(u)) return 'pct';

  return u;
}

function converterQuantidade(valor, unidadeOrigem, unidadeDestino, chave = '') {
  const origem = unidadeNormalizada(unidadeOrigem);
  const destino = unidadeNormalizada(unidadeDestino);
  const quantidade = Number(valor);

  if (!Number.isFinite(quantidade) || quantidade < 0) return null;
  if (origem === destino) return quantidade;

  if (origem === 'kg' && destino === 'g') return quantidade * 1000;
  if (origem === 'g' && destino === 'kg') return quantidade / 1000;
  if (origem === 'l' && destino === 'ml') return quantidade * 1000;
  if (origem === 'ml' && destino === 'l') return quantidade / 1000;

  // Caixa de leite padrão = 1 litro
  if (chave === 'leite' && origem === 'cx' && destino === 'ml')
    return quantidade * 1000;

  if (chave === 'leite' && origem === 'ml' && destino === 'cx')
    return quantidade / 1000;

  if (chave === 'leite' && origem === 'cx' && destino === 'l')
    return quantidade;

  if (chave === 'leite' && origem === 'l' && destino === 'cx')
    return quantidade;

  return null;
}

function converterIngredienteTexto(texto) {
  const partes = String(texto).trim().match(
    /^(\d+(?:[.,]\d+)?)\s*(kg|g|ml|l|un|unidade|unidades|xícara|xícaras|colher|colheres)?\s*(?:de\s+)?(.+)$/i
  );

  if (!partes) return null;

  const quantidade = Number(partes[1].replace(',', '.'));
  let unidade = normalizar(partes[2] || 'un');
  let nome = partes[3].trim();

  if (unidade.startsWith('xicara')) {
    unidade = 'un';
    nome = 'Xícara de ' + nome;
  } else if (unidade.startsWith('colher')) {
    unidade = 'un';
    nome = 'Colher de ' + nome;
  } else {
    unidade = unidadeNormalizada(unidade);
  }

  return [chaveAlimento(nome), nome, quantidade, unidade];
}

/* ==========================================
   RECEITAS PERSONALIZADAS
========================================== */

function carregarReceitasPersonalizadas() {
  try {
    return JSON.parse(
      localStorage.getItem(CHAVE_RECEITAS_PERSONALIZADAS) || '[]'
    );
  } catch {
    return [];
  }
}

function carregarFavoritas() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_FAVORITAS) || '[]')
      .map(String);
  } catch {
    return [];
  }
}

function atualizarReceitasPersonalizadas() {
  const personalizadas = carregarReceitasPersonalizadas();

  personalizadas.forEach(receita => {
    if (Array.isArray(receita.ingredientesTexto)) {
      receita.ingredientes = receita.ingredientesTexto
        .map(converterIngredienteTexto)
        .filter(Boolean);
    }

    receita.personalizada = true;
  });

  receitas.push(...personalizadas);
}

/* ==========================================
   GELADEIRA E DISPONIBILIDADE
========================================== */

function encontrarAlimento(chave) {
  return alimentos.find(item => chaveAlimento(item.nome) === chave);
}

function verificarReceita(receita) {
  const faltantes = [];

  for (const [chave, nome, quantidade, unidade] of receita.ingredientes) {
    const item = encontrarAlimento(chave);

    const disponivel = item
      ? converterQuantidade(item.quantidade, item.unidade, unidade, chave)
      : null;

    if (disponivel === null || disponivel < quantidade) {
      faltantes.push(nome);
    }
  }

  return {
    faltantes,
    disponivel: faltantes.length === 0
  };
}


async function carregarAlimentos() {
  const dados = localStorage.getItem(CHAVE_GELADEIRA);
  alimentos = dados ? JSON.parse(dados) : [];

  if (!Array.isArray(alimentos)) alimentos = [];

  const contador = $('contadorIngredientes');

  if (contador) {
    contador.textContent = `${alimentos.length} ingredientes`;
  }
}


/* ==========================================
   UTILITÁRIOS
========================================== */

function escapar(texto) {
  return String(texto).replace(/[&<>"']/g, c => ({
    '&':'&amp;',
    '<':'&lt;',
    '>':'&gt;',
    '"':'&quot;',
    "'":'&#39;'
  }[c]));
}

function formatarIngrediente(nome, quantidade, unidade) {
  if (unidade === 'un' && /^(xícara|colher)/i.test(nome)) {
    return `${quantidade} ${nome}`;
  }

  return `${nome} (${quantidade} ${unidade})`;
}

function atualizarListaReceitas() {
  renderizar();
}

function alternarFavorita(id) {
  const favoritas = carregarFavoritas();
  id = String(id);

  const novas = favoritas.includes(id)
    ? favoritas.filter(x => x !== id)
    : [...favoritas, id];

  localStorage.setItem(CHAVE_FAVORITAS, JSON.stringify(novas));
  renderizar();
}

/* ==========================================
   BOTÃO DE FAVORITAS
========================================== */

function configurarBotaoFavoritas() {
  let botao = $('btnVerFavoritas');

  if (!botao) {
    botao = document.createElement('button');
    botao.type = 'button';
    botao.id = 'btnVerFavoritas';

    const lista = $('listaReceitas');

    if (lista && lista.parentNode) {
      lista.parentNode.insertBefore(botao, lista);
    }
  }

  botao.classList.add('botao-filtro-favoritas');

  botao.textContent = mostrarFavoritas
    ? '🍽️ Todas as receitas'
    : 'Minhas favoritas ★';

  botao.addEventListener('click', () => {
    mostrarFavoritas = !mostrarFavoritas;

    botao.textContent = mostrarFavoritas
      ? '🍽️ Todas as receitas'
      : 'Minhas favoritas ★';

    renderizar();
  });
}

/* ==========================================
   RENDERIZAÇÃO
========================================== */

function renderizar() {
  const buscaEl = $('buscarReceita');
  const categoriaEl = $('filtroCategoria');
  const disponibilidadeEl = $('filtroDisponibilidade');
  const listaEl = $('listaReceitas');

  if (!buscaEl || !categoriaEl || !disponibilidadeEl || !listaEl) return;

  const termo = normalizar(buscaEl.value);
  const categoria = categoriaEl.value;
  const disponibilidade = disponibilidadeEl.value;
  const favoritas = carregarFavoritas();

  listaEl.innerHTML = '';

  const filtradas = receitas
    .map(r => ({
      ...r,
      estado: verificarReceita(r)
    }))
    .filter(r => {
      const texto = normalizar(r.nome + ' ' + r.descricao);

      const buscaOk = !termo || texto.includes(termo);
      const categoriaOk = categoria === 'todas' || r.categorias.includes(categoria);

      const dispOk =
        disponibilidade === 'todas' ||
        (disponibilidade === 'completas' && r.estado.disponivel) ||
        (disponibilidade === 'faltantes' && !r.estado.disponivel);

      const favoritaOk =
        !mostrarFavoritas || favoritas.includes(String(r.id));

      return buscaOk && categoriaOk && dispOk && favoritaOk;
    })
    .sort((a,b) => Number(b.estado.disponivel) - Number(a.estado.disponivel));

  if ($('semReceitas')) {
    $('semReceitas').hidden = filtradas.length > 0;
    $('semReceitas').textContent = mostrarFavoritas
      ? 'Você ainda não favoritou nenhuma receitinha 💜'
      : 'Nenhuma receita encontrada.';
  }

  filtradas.forEach(r => {
    const ingredientes = r.ingredientes.map(([chave,nome,qtd,un]) => {
      const item = encontrarAlimento(chave);

      const atual = item
        ? converterQuantidade(item.quantidade,item.unidade,un,chave)
        : null;

      const ok = atual !== null && atual >= qtd;
      const texto = formatarIngrediente(nome,qtd,un);

      return `
        <span class="ingrediente-tag ${ok ? '' : 'faltando'}">
          ${ok ? '✓' : '+'} ${escapar(texto)}
        </span>
      `;
    }).join('');

    const favorita = favoritas.includes(String(r.id));

    const card = document.createElement('article');
    card.className = 'cartao-receita';

    card.innerHTML = `
      <div class="topo-cartao-receita">
        <span class="icone-receita">${r.emoji || '👩‍🍳'}</span>

        <div class="titulo-cartao-receita">
          <h3>${escapar(r.nome)}</h3>
          <div class="meta-receita">
            ${r.tempo} min · ${escapar(r.dificuldade || 'Personalizada')}
          </div>
        </div>

        <button type="button"
          class="botao-favoritar ${favorita ? 'favoritada' : ''}"
          data-favoritar="${escapar(r.id)}"
          aria-label="${favorita ? 'Desfavoritar' : 'Favoritar'} receita">
          ${favorita ? '★' : '☆'}
        </button>
      </div>

      <span class="etiqueta-status ${r.estado.disponivel ? '' : 'incompleta'}">
        ${r.estado.disponivel ? '✓ Você tem tudo!' : 'Faltam ingredientes'}
      </span>

      <p class="descricao-receita">${escapar(r.descricao || '')}</p>

      <p class="rotulo-ingredientes">Ingredientes necessários</p>

      <div class="lista-ingredientes-receita">
        ${ingredientes}
      </div>

      <button type="button" class="botao-ver-receita" data-id="${escapar(r.id)}">
        Ver receita e preparo →
      </button>
    `;

    listaEl.appendChild(card);
  });

  if ($('mensagemReceitas')) {
    $('mensagemReceitas').textContent =
      mostrarFavoritas
        ? `${filtradas.length} receitas favoritas.`
        : disponibilidade === 'faltantes'
          ? `${filtradas.length} receitas precisam de ingredientes adicionais.`
          : `${filtradas.filter(r => r.estado.disponivel).length} receitas podem ser preparadas com seu estoque atual.`;
  }
}

/* ==========================================
   ABRIR RECEITA
========================================== */

function abrirReceita(id) {
  receitaAberta = receitas.find(r => String(r.id) === String(id));

  if (!receitaAberta) return;

  const estado = verificarReceita(receitaAberta);

  const lista = receitaAberta.ingredientes.map(([chave,nome,qtd,un]) => {
    const item = encontrarAlimento(chave);

    const atual = item
      ? converterQuantidade(item.quantidade,item.unidade,un,chave)
      : null;

    const ok = atual !== null && atual >= qtd;

    return `
      <li>
        ${ok ? '✓' : '✕'} ${escapar(formatarIngrediente(nome,qtd,un))}
        ${item
          ? `<small>(estoque: ${item.quantidade} ${escapar(item.unidade)})</small>`
          : '<small>(não cadastrado)</small>'}
      </li>
    `;
  }).join('');

  const favorita = carregarFavoritas().includes(String(receitaAberta.id));

  $('detalheReceita').innerHTML = `
    <div class="detalhe-cabecalho">
      <span class="icone-receita">${receitaAberta.emoji || '👩‍🍳'}</span>
      <h2>${escapar(receitaAberta.nome)}</h2>
      <p>${escapar(receitaAberta.descricao || '')}</p>
      <p>${receitaAberta.tempo} minutos · ${escapar(receitaAberta.dificuldade || 'Personalizada')}</p>

      <button type="button" id="btnFavoritarDetalhe" class="botao-favoritar">
        ${favorita ? 'Remover dos favoritos ★' : 'Favoritar receitinha ☆'}
      </button>
    </div>

    ${receitaAberta.personalizada ? `
      <div class="acoes-receita-personalizada">
        <button type="button" id="btnEditarReceita" class="btn-editar-receita">
          ✏️ Editar receitinha
        </button>

        <button type="button" id="btnExcluirReceita" class="btn-excluir-receita">
          🗑️ Excluir receitinha
        </button>
      </div>
    ` : ''}

    <div class="detalhe-receita">
      <h3>Ingredientes e quantidades</h3>
      <ul>${lista}</ul>

      <h3>Modo de preparo</h3>
      <ol>
        ${(receitaAberta.modo || []).map(p => `<li>${escapar(p)}</li>`).join('')}
      </ol>
    </div>
  `;

  $('botaoPreparar').hidden = !estado.disponivel;
  $('botaoPreparar').disabled = false;

  $('mensagemPreparo').textContent = estado.disponivel
    ? 'Você tem tudo! Ao preparar, os ingredientes serão descontados da geladeira.'
    : 'Ainda faltam ingredientes ou quantidades para preparar esta receita.';

  $('modalReceita').showModal();
}

/* ==========================================
   EDITAR RECEITA
========================================== */

function preencherFormularioEdicao(receita) {
  $('nomeNovaReceita').value = receita.nome || '';
  $('categoriaNovaReceita').value = (receita.categorias || ['cafe'])[0];
  $('tempoNovaReceita').value = receita.tempo || '';
  $('descricaoNovaReceita').value = receita.descricao || '';

  const ingredientes = receita.ingredientesTexto ||
    receita.ingredientes.map(([k,n,q,u]) => `${q} ${u} ${n}`).join('\n');

  $('ingredientesNovaReceita').value =
    Array.isArray(ingredientes) ? ingredientes.join('\n') : ingredientes;

  $('modoNovaReceita').value = (receita.modo || []).join('\n');
}

function editarReceitaPersonalizada() {
  if (!receitaAberta?.personalizada) return;

  const id = receitaAberta.id;

  const salvas = carregarReceitasPersonalizadas();
  const receita = salvas.find(r => String(r.id) === String(id));

  if (!receita) return;

  preencherFormularioEdicao(receita);

  $('formCadastroRefeicao').dataset.editandoId = String(id);

  $('modalReceita').close();
  $('modalCadastroRefeicao').style.display = 'flex';
}

/* ==========================================
   EXCLUIR RECEITA
========================================== */

function excluirReceitaPersonalizada() {
  if (!receitaAberta?.personalizada) return;

  const confirmar = confirm(
    `Deseja realmente excluir "${receitaAberta.nome}"?`
  );

  if (!confirmar) return;

  const id = String(receitaAberta.id);

  const salvas = carregarReceitasPersonalizadas()
    .filter(r => String(r.id) !== id);

  localStorage.setItem(
    CHAVE_RECEITAS_PERSONALIZADAS,
    JSON.stringify(salvas)
  );

  const index = receitas.findIndex(r => String(r.id) === id);

  if (index >= 0) receitas.splice(index, 1);

  const favoritas = carregarFavoritas()
    .filter(x => x !== id);

  localStorage.setItem(CHAVE_FAVORITAS, JSON.stringify(favoritas));

  $('modalReceita').close();
  atualizarListaReceitas();
}

/* ==========================================
   PREPARAR RECEITA
========================================== */

async function prepararReceita() {
  if (!receitaAberta) return;

  const botao = $('botaoPreparar');

  botao.disabled = true;
  $('mensagemPreparo').textContent = 'Conferindo novamente seu estoque...';

  try {
    await carregarAlimentos();

    const estado = verificarReceita(receitaAberta);

    if (!estado.disponivel) {
      renderizar();
      botao.hidden = true;

      $('mensagemPreparo').textContent =
        'Seu estoque mudou e agora não há quantidade suficiente. Atualizei as sugestões.';

      return;
    }

    const alteracoes = [];

    for (const [chave,nome,qtd,un] of receitaAberta.ingredientes) {
      const item = encontrarAlimento(chave);

      const consumo = converterQuantidade(qtd,un,item.unidade,chave);

      if (consumo === null) {
        throw new Error(`Unidade incompatível para ${nome}.`);
      }

      alteracoes.push({
        item,
        nova: Math.max(
          0,
          Number((Number(item.quantidade) - consumo).toFixed(3))
        )
      });
    }

    alteracoes.forEach(a => {
      a.item.quantidade = a.nova;
    });

    localStorage.setItem(CHAVE_GELADEIRA, JSON.stringify(alimentos));

    await carregarAlimentos();
    renderizar();

    $('mensagemPreparo').textContent =
      'Receita preparada! Os ingredientes foram descontados da geladeira.';

    botao.hidden = true;

    setTimeout(() => {
      if ($('modalReceita').open) $('modalReceita').close();
    }, 1400);

  } catch (erro) {
    console.error(erro);

    $('mensagemPreparo').textContent =
      'Não foi possível descontar os ingredientes. Atualize a página e tente novamente.';

    botao.disabled = false;
  }
}

/* ==========================================
   CADASTRAR RECEITA
========================================== */

function abrirCadastro() {
  const form = $('formCadastroRefeicao');

  form.reset();
  delete form.dataset.editandoId;

  $('modalCadastroRefeicao').style.display = 'flex';
}

function fecharCadastro() {
  $('modalCadastroRefeicao').style.display = 'none';
}

function salvarReceita(event) {
  event.preventDefault();

  const form = $('formCadastroRefeicao');
  const editandoId = form.dataset.editandoId;

  const nome = $('nomeNovaReceita').value.trim();
  const categoria = $('categoriaNovaReceita').value;
  const tempo = Number($('tempoNovaReceita').value);
  const descricao = $('descricaoNovaReceita').value.trim();

  const ingredientesTexto = $('ingredientesNovaReceita')
    .value.split('\n')
    .map(x => x.trim())
    .filter(Boolean);

  const modo = $('modoNovaReceita')
    .value.split('\n')
    .map(x => x.trim())
    .filter(Boolean);

  if (!nome || !ingredientesTexto.length || !modo.length ||
      !Number.isFinite(tempo) || tempo <= 0) {
    alert('Preencha nome, tempo, ingredientes e modo de preparo corretamente 💜');
    return;
  }

  const ingredientes = ingredientesTexto.map(converterIngredienteTexto);

  if (ingredientes.some(x => !x)) {
    alert('Confira os ingredientes. Exemplos: 2 ovos; 200 ml de leite; 1 xícara de farinha.');
    return;
  }

  const salvas = carregarReceitasPersonalizadas();

  const receita = {
    id: editandoId || `personalizada-${Date.now()}`,
    nome,
    emoji: '👩‍🍳',
    categorias: [categoria],
    tempo,
    dificuldade: 'Personalizada',
    descricao: descricao || 'Uma receitinha especial da família!',
    ingredientes,
    ingredientesTexto,
    modo,
    personalizada: true
  };

  if (editandoId) {
    const index = salvas.findIndex(r => String(r.id) === String(editandoId));

    if (index >= 0) salvas[index] = receita;
    else salvas.push(receita);
  } else {
    salvas.push(receita);
  }

  localStorage.setItem(
    CHAVE_RECEITAS_PERSONALIZADAS,
    JSON.stringify(salvas)
  );

  form.reset();
  delete form.dataset.editandoId;

  fecharCadastro();

  if (editandoId) {
    const index = receitas.findIndex(r => String(r.id) === String(editandoId));

    if (index >= 0) receitas[index] = receita;
    else receitas.push(receita);
  } else {
    receitas.push(receita);
  }

  atualizarListaReceitas();
}

/* ==========================================
   INICIALIZAÇÃO
========================================== */

function iniciar() {
  atualizarReceitasPersonalizadas();

  carregarAlimentos()
    .then(renderizar)
    .catch(erro => {
      console.error(erro);

      if ($('mensagemReceitas')) {
        $('mensagemReceitas').textContent = erro.message;
      }
    });

  configurarBotaoFavoritas();

  $('buscarReceita')?.addEventListener('input', renderizar);
  $('filtroCategoria')?.addEventListener('change', renderizar);
  $('filtroDisponibilidade')?.addEventListener('change', renderizar);

  $('listaReceitas')?.addEventListener('click', evento => {
    const favorita = evento.target.closest('[data-favoritar]');

    if (favorita) {
      evento.stopPropagation();
      alternarFavorita(favorita.dataset.favoritar);
      return;
    }

    const botao = evento.target.closest('[data-id]');

    if (botao) abrirReceita(botao.dataset.id);
  });

  $('fecharModal')?.addEventListener('click', () => {
    $('modalReceita').close();
  });

  $('botaoPreparar')?.addEventListener('click', prepararReceita);

  $('btnCadastrarRefeicao')?.addEventListener('click', abrirCadastro);
  $('fecharCadastroRefeicao')?.addEventListener('click', fecharCadastro);

  $('formCadastroRefeicao')?.addEventListener('submit', salvarReceita);

  $('detalheReceita')?.addEventListener('click', evento => {
    if (evento.target.closest('#btnExcluirReceita')) {
      excluirReceitaPersonalizada();
    }

    if (evento.target.closest('#btnEditarReceita')) {
      editarReceitaPersonalizada();
    }

    if (evento.target.closest('#btnFavoritarDetalhe') && receitaAberta) {
      alternarFavorita(receitaAberta.id);
      abrirReceita(receitaAberta.id);
    }
  });
}

iniciar();

})();
