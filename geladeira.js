(() => {
  'use strict';

  const SUPABASE_URL = 'https://ncqimbutzmngrkgvtnqt.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_kM4EsVr5Y22pWEgpn8CTdg_ag3m7aDE';

  if (!window.supabase?.createClient) {
    console.error('Supabase não carregado.');
    return;
  }

  const banco = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );

  let ninhoId = null;
  let alimentos = [];

   const receitas = [

    {
      id: 1,
      nome: 'Pão com ovo',
      emoji: '🍳',
      categorias: ['cafe', 'lanche', 'salgado'],
      tempo: 10,
      dificuldade: 'Muito fácil',
      descricao: 'Um clássico rápido para o café da manhã ou um lanche reforçado.',
      ingredientes: [
        ['pao', 'Pão'],
        ['ovo', 'Ovo'],
        ['manteiga', 'Manteiga ou óleo']
      ],
      modo: [
        'Aqueça uma frigideira com um pouquinho de manteiga ou óleo.',
        'Quebre o ovo e prepare mexido ou frito, como preferir.',
        'Sirva com o pão. Se quiser, doure o pão na mesma frigideira.'
      ]
    },
    {
      id: 2,
      nome: 'Omelete simples',
      emoji: '🍳',
      categorias: ['cafe', 'lanche', 'almoco', 'janta', 'salgado'],
      tempo: 8,
      dificuldade: 'Muito fácil',
      descricao: 'Uma refeição prática que aceita queijo, tomate e temperos.',
      ingredientes: [
        ['ovo', 'Ovo'],
        ['sal', 'Sal'],
        ['queijo', 'Queijo (opcional)']
      ],
      modo: [
        'Bata os ovos com uma pitada de sal.',
        'Se tiver, misture queijo picado ou temperos.',
        'Coloque em uma frigideira untada, cozinhe em fogo baixo e dobre ao meio.'
      ]
    },
    {
      id: 3,
      nome: 'Panqueca de banana',
      emoji: '🥞',
      categorias: ['cafe', 'lanche', 'doce'],
      tempo: 12,
      dificuldade: 'Fácil',
      descricao: 'Panquequinhas doces feitas na frigideira, sem liquidificador.',
      ingredientes: [
        ['banana', 'Banana'],
        ['ovo', 'Ovo'],
        ['aveia', 'Aveia (opcional)']
      ],
      modo: [
        'Amasse bem a banana com um garfo.',
        'Misture o ovo e, se tiver, uma colher de aveia.',
        'Despeje pequenas porções em frigideira antiaderente e doure dos dois lados em fogo baixo.'
      ]
    },
    {
      id: 4,
      nome: 'Banana dourada com canela',
      emoji: '🍌',
      categorias: ['cafe', 'lanche', 'doce'],
      tempo: 7,
      dificuldade: 'Muito fácil',
      descricao: 'Uma sobremesa quentinha com poucos ingredientes.',
      ingredientes: [
        ['banana', 'Banana'],
        ['canela', 'Canela (opcional)'],
        ['acucar', 'Açúcar (opcional)']
      ],
      modo: [
        'Corte a banana ao meio ou em rodelas.',
        'Doure em uma frigideira antiaderente por alguns minutos de cada lado.',
        'Finalize com canela ou um pouquinho de açúcar, se tiver.'
      ]
    },
    {
      id: 5,
      nome: 'Queijo quente',
      emoji: '🥪',
      categorias: ['cafe', 'lanche', 'salgado'],
      tempo: 8,
      dificuldade: 'Muito fácil',
      descricao: 'Sanduíche crocante por fora e derretido por dentro.',
      ingredientes: [
        ['pao', 'Pão'],
        ['queijo', 'Queijo'],
        ['manteiga', 'Manteiga (opcional)']
      ],
      modo: [
        'Coloque o queijo entre duas fatias de pão.',
        'Se quiser, passe um pouco de manteiga por fora.',
        'Doure na frigideira em fogo baixo, virando para dourar os dois lados e derreter o queijo.'
      ]
    },
    {
      id: 6,
      nome: 'Misto quente de frigideira',
      emoji: '🥪',
      categorias: ['cafe', 'lanche', 'salgado'],
      tempo: 8,
      dificuldade: 'Muito fácil',
      descricao: 'Uma opção rápida para aproveitar pão, queijo e presunto.',
      ingredientes: [
        ['pao', 'Pão'],
        ['queijo', 'Queijo'],
        ['presunto', 'Presunto (opcional)']
      ],
      modo: [
        'Monte o sanduíche com queijo e presunto, se tiver.',
        'Coloque em uma frigideira em fogo baixo.',
        'Doure dos dois lados até o queijo derreter.'
      ]
    },
    {
      id: 7,
      nome: 'Ovo mexido cremoso',
      emoji: '🥚',
      categorias: ['cafe', 'lanche', 'salgado'],
      tempo: 5,
      dificuldade: 'Muito fácil',
      descricao: 'Ovos mexidos rápidos para comer puros ou acompanhar pão.',
      ingredientes: [
        ['ovo', 'Ovo'],
        ['leite', 'Leite (opcional)'],
        ['manteiga', 'Manteiga ou óleo']
      ],
      modo: [
        'Bata os ovos com uma colher de leite, se tiver.',
        'Derreta um pouco de manteiga na frigideira em fogo baixo.',
        'Mexa os ovos delicadamente até ficarem cozidos e cremosos.'
      ]
    },
    {
      id: 8,
      nome: 'Macarrão alho e óleo',
      emoji: '🍝',
      categorias: ['almoco', 'janta', 'salgado'],
      tempo: 20,
      dificuldade: 'Fácil',
      descricao: 'Uma massa econômica feita com ingredientes comuns.',
      ingredientes: [
        ['macarrao', 'Macarrão'],
        ['alho', 'Alho'],
        ['oleo', 'Óleo ou azeite'],
        ['sal', 'Sal']
      ],
      modo: [
        'Cozinhe o macarrão em água com sal conforme a embalagem e escorra.',
        'Doure alho picado em óleo ou azeite, sem deixar queimar.',
        'Misture o macarrão e sirva.'
      ]
    },
    {
      id: 9,
      nome: 'Arroz com ovo',
      emoji: '🍚',
      categorias: ['almoco', 'janta', 'salgado'],
      tempo: 10,
      dificuldade: 'Muito fácil',
      descricao: 'Uma refeição simples para aproveitar arroz já pronto.',
      ingredientes: [
        ['arroz', 'Arroz cozido'],
        ['ovo', 'Ovo'],
        ['oleo', 'Óleo ou manteiga']
      ],
      modo: [
        'Aqueça o arroz já cozido em uma frigideira com um pouquinho de óleo.',
        'Em outra parte da frigideira, prepare o ovo mexido ou frito.',
        'Misture ou sirva o ovo por cima do arroz.'
      ]
    },
    {
      id: 10,
      nome: 'Batata dourada',
      emoji: '🥔',
      categorias: ['almoco', 'janta', 'lanche', 'salgado'],
      tempo: 25,
      dificuldade: 'Fácil',
      descricao: 'Batata macia por dentro e douradinha por fora, sem forno.',
      ingredientes: [
        ['batata', 'Batata'],
        ['oleo', 'Óleo'],
        ['sal', 'Sal']
      ],
      modo: [
        'Descasque, se quiser, e corte a batata em cubos pequenos.',
        'Cozinhe em água até começar a ficar macia e escorra.',
        'Doure na frigideira com um fio de óleo, mexendo ocasionalmente. Tempere com sal.'
      ]
    },
    {
      id: 11,
      nome: 'Brigadeiro de panela',
      emoji: '🍫',
      categorias: ['doce', 'lanche'],
      tempo: 15,
      dificuldade: 'Fácil',
      descricao: 'Doce de chocolate preparado em uma panela.',
      ingredientes: [
        ['leitecondensado', 'Leite condensado'],
        ['chocolate', 'Chocolate em pó'],
        ['manteiga', 'Manteiga']
      ],
      modo: [
        'Coloque leite condensado, chocolate em pó e manteiga em uma panela.',
        'Mexa em fogo baixo sem parar, raspando o fundo e as laterais.',
        'Quando engrossar e começar a soltar do fundo, desligue e deixe esfriar.'
      ]
    },
    {
      id: 12,
      nome: 'Chocolate quente simples',
      emoji: '☕',
      categorias: ['cafe', 'lanche', 'doce'],
      tempo: 8,
      dificuldade: 'Fácil',
      descricao: 'Bebida quentinha para dias frios, feita no fogão.',
      ingredientes: [
        ['leite', 'Leite'],
        ['chocolate', 'Chocolate em pó'],
        ['acucar', 'Açúcar (opcional)']
      ],
      modo: [
        'Misture o leite com o chocolate em pó em uma panela.',
        'Aqueça em fogo baixo, mexendo até dissolver bem.',
        'Adoce a gosto e sirva morno. Não deixe ferver demais.'
      ]
    },
    {
      id: 13,
      nome: 'Tapioca com queijo',
      emoji: '🧀',
      categorias: ['cafe', 'lanche', 'salgado'],
      tempo: 8,
      dificuldade: 'Muito fácil',
      descricao: 'Lanche rápido feito diretamente na frigideira.',
      ingredientes: [
        ['tapioca', 'Goma de tapioca'],
        ['queijo', 'Queijo']
      ],
      modo: [
        'Espalhe a goma de tapioca em uma frigideira aquecida.',
        'Quando unir e formar um disco, distribua o queijo.',
        'Dobre ao meio e aqueça até o queijo derreter.'
      ]
    },
    {
      id: 14,
      nome: 'Crepioca',
      emoji: '🥞',
      categorias: ['cafe', 'lanche', 'salgado'],
      tempo: 8,
      dificuldade: 'Fácil',
      descricao: 'Uma massa rápida de ovo e tapioca que pode receber recheio.',
      ingredientes: [
        ['ovo', 'Ovo'],
        ['tapioca', 'Goma de tapioca'],
        ['queijo', 'Queijo (opcional)']
      ],
      modo: [
        'Bata o ovo e misture a goma de tapioca.',
        'Despeje em uma frigideira antiaderente aquecida.',
        'Doure dos dois lados e recheie com queijo, se tiver.'
      ]
    },
    {
      id: 15,
      nome: 'Tomate com ovo',
      emoji: '🍅',
      categorias: ['cafe', 'almoco', 'janta', 'salgado'],
      tempo: 10,
      dificuldade: 'Fácil',
      descricao: 'Ovos cozidos na frigideira com tomate temperado.',
      ingredientes: [
        ['tomate', 'Tomate'],
        ['ovo', 'Ovo'],
        ['sal', 'Sal']
      ],
      modo: [
        'Pique o tomate e leve à frigideira com um fio de óleo ou água.',
        'Quando amolecer, tempere e quebre os ovos por cima.',
        'Tampe e cozinhe em fogo baixo até os ovos ficarem no ponto desejado.'
      ]
    },
    {
      id: 16,
      nome: 'Salada simples',
      emoji: '🥗',
      categorias: ['almoco', 'janta', 'salgado'],
      tempo: 10,
      dificuldade: 'Muito fácil',
      descricao: 'Uma salada fresca com os vegetais disponíveis em casa.',
      ingredientes: [
        ['alface', 'Alface ou folhas'],
        ['tomate', 'Tomate'],
        ['sal', 'Sal (opcional)']
      ],
      modo: [
        'Lave muito bem as folhas e os vegetais.',
        'Corte em pedaços e coloque em uma tigela.',
        'Tempere a gosto e sirva imediatamente.'
      ]
    },
    {
      id: 17,
      nome: 'Bolo simples de panela',
      emoji: '🧁',
      categorias: ['doce', 'lanche'],
      tempo: 20,
      dificuldade: 'Fácil',
      descricao: 'Um bolinho doce feito no fogão, sem forno.',
      ingredientes: [
        ['ovo', 'Ovo'],
        ['farinha', 'Farinha de trigo'],
        ['acucar', 'Açúcar'],
        ['leite', 'Leite'],
        ['fermento', 'Fermento químico']
      ],
      modo: [
        'Misture o ovo, o açúcar e um pouco de leite.',
        'Adicione a farinha até formar uma massa e finalize com fermento.',
        'Coloque em um recipiente pequeno resistente ao calor, dentro de uma panela tampada com um pouco de água no fundo. Cozinhe em fogo baixo até firmar. Use apenas um recipiente adequado para calor.'
      ]
    },
    {
      id: 18,
      nome: 'Mingau de aveia',
      emoji: '🥣',
      categorias: ['cafe', 'lanche', 'doce'],
      tempo: 7,
      dificuldade: 'Muito fácil',
      descricao: 'Café da manhã quentinho e econômico.',
      ingredientes: [
        ['leite', 'Leite'],
        ['aveia', 'Aveia'],
        ['acucar', 'Açúcar ou mel (opcional)']
      ],
      modo: [
        'Misture leite e aveia em uma panela pequena.',
        'Cozinhe em fogo baixo, mexendo até engrossar.',
        'Adoce a gosto e espere amornar antes de comer.'
      ]
    },
    {
      id: 19,
      nome: 'Pipoca de panela',
      emoji: '🍿',
      categorias: ['lanche', 'doce', 'salgado'],
      tempo: 8,
      dificuldade: 'Fácil',
      descricao: 'Lanche para dividir com a família; pode ser salgada ou doce.',
      ingredientes: [
        ['milho', 'Milho para pipoca'],
        ['oleo', 'Óleo'],
        ['sal', 'Sal ou açúcar (opcional)']
      ],
      modo: [
        'Coloque uma fina camada de óleo e o milho em uma panela com tampa.',
        'Aqueça em fogo médio, mexendo a panela ocasionalmente.',
        'Quando os estouros ficarem espaçados, desligue e tempere. Cuidado ao abrir a tampa e com o vapor quente.'
      ]
    },
    {
      id: 20,
      nome: 'Panqueca salgada básica',
      emoji: '🥞',
      categorias: ['almoco', 'janta', 'lanche', 'salgado'],
      tempo: 15,
      dificuldade: 'Fácil',
      descricao: 'Massa simples feita à mão e dourada na frigideira.',
      ingredientes: [
        ['ovo', 'Ovo'],
        ['farinha', 'Farinha de trigo'],
        ['leite', 'Leite'],
        ['sal', 'Sal']
      ],
      modo: [
        'Misture ovo, farinha, leite e uma pitada de sal até ficar sem grumos grandes.',
        'Despeje uma camada fina em uma frigideira untada.',
        'Doure dos dois lados e recheie com o que tiver disponível.'
      ]
    },
    {
      id: 21,
      nome: 'Pão com manteiga na chapa',
      emoji: '🍞',
      categorias: ['cafe', 'lanche', 'salgado'],
      tempo: 5,
      dificuldade: 'Muito fácil',
      descricao: 'Pão quentinho e dourado para acompanhar café ou chá.',
      ingredientes: [
        ['pao', 'Pão'],
        ['manteiga', 'Manteiga']
      ],
      modo: [
        'Passe manteiga no pão.',
        'Doure em uma frigideira em fogo baixo.',
        'Vire para aquecer dos dois lados e sirva.'
      ]
    },
    {
      id: 22,
      nome: 'Doce de banana na panela',
      emoji: '🍌',
      categorias: ['doce', 'lanche'],
      tempo: 15,
      dificuldade: 'Fácil',
      descricao: 'Banana cozida até ficar macia e docinha.',
      ingredientes: [
        ['banana', 'Banana'],
        ['acucar', 'Açúcar (opcional)'],
        ['canela', 'Canela (opcional)']
      ],
      modo: [
        'Corte as bananas em rodelas e coloque em uma panela com uma colher de água.',
        'Cozinhe em fogo baixo, mexendo para não grudar.',
        'Se desejar, adicione açúcar ou canela e cozinhe até ficar com textura de doce.'
      ]
    }
  ];

  const aliases = {
    ovo: ['ovo', 'ovos'],
    pao: ['pao', 'pães', 'paes', 'pão'],
    leite: ['leite'],
    queijo: ['queijo', 'queijos'],
    banana: ['banana', 'bananas'],
    manteiga: ['manteiga', 'margarina', 'óleo', 'oleo', 'azeite'],
    oleo: ['oleo', 'óleo', 'azeite', 'manteiga'],
    sal: ['sal'],
    acucar: ['acucar', 'açucar', 'açúcar'],
    canela: ['canela'],
    aveia: ['aveia'],
    macarrao: ['macarrao', 'macarrão', 'massa'],
    alho: ['alho'],
    arroz: ['arroz'],
    batata: ['batata', 'batatas'],
    chocolate: ['chocolate', 'cacau'],
    leitecondensado: ['leite condensado', 'condensado'],
    presunto: ['presunto', 'fiambre'],
    tomate: ['tomate', 'tomates'],
    alface: ['alface', 'folhas', 'couve'],
    tapioca: ['tapioca', 'goma de tapioca'],
    farinha: ['farinha', 'farinha de trigo'],
    fermento: ['fermento', 'fermento químico', 'fermento quimico'],
    milho: ['milho', 'milho para pipoca']
  };

  const $ = id => document.getElementById(id);
  const embalagens = ['cx.', 'pct.', 'pote(s)', 'lata(s)'];

  function normalizar(texto) {
    return String(texto || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }

  function chaveAlimento(nome) {
    const nomeNormalizado = normalizar(nome);

    for (const [chave, nomes] of Object.entries(aliases)) {
      if (
        nomes.some(nome => normalizar(nome) === nomeNormalizado) ||
        nomeNormalizado === chave
      ) return chave;
    }

    return nomeNormalizado.replace(/s$/, '').replace(/[^a-z0-9]/g, '');
  }

  function temIngrediente(chave) {
    return alimentos.some(item =>
      chaveAlimento(item.nome) === chave
    );
  }

  async function carregar() {
    const { data, error } = await banco
      .from('alimentos')
      .select('*')
      .eq('ninho_id', ninhoId)
      .order('criado_em', { ascending: true });

    if (error) throw error;
    alimentos = data || [];
  }

  function escapar(texto) {
    return String(texto ?? '').replace(/[&<>"']/g, c => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[c]);
  }

  // UNIDADE ORIGINAL
  function unidadeOriginal(item) {
    if (item.unidade_exibicao) return item.unidade_exibicao;

    if (item.unidade === 'g')
      return Number(item.quantidade) >= 1000 ? 'kg' : 'g';

    if (item.unidade === 'ml')
      return Number(item.quantidade) >= 1000 ? 'L' : 'ml';

    return 'un.';
  }

  function numero(valor) {
    return Number(valor).toLocaleString('pt-BR', {
      maximumFractionDigits: 3
    });
  }

  // QUANTIDADE BONITA
  function formatarQuantidade(item) {
    const unidade = unidadeOriginal(item);

    if (embalagens.includes(unidade)) {
      return `${numero(item.quantidade_embalagens ?? 0)} ${unidade}`;
    }

    let quantidade = Number(item.quantidade) || 0;

    if (unidade === 'kg' && item.unidade === 'g')
      quantidade /= 1000;

    if (unidade === 'L' && item.unidade === 'ml')
      quantidade /= 1000;

    return `${numero(quantidade)} ${unidade}`;
  }

  // STATUS DO ESTOQUE
  function statusEstoque(item) {
    const unidade = unidadeOriginal(item);

    const quantidade = embalagens.includes(unidade)
      ? Number(item.quantidade_embalagens || 0)
      : Number(item.quantidade);

    if (quantidade <= 0)
      return { texto: 'Acabou', classe: 'estoque-acabou' };

    const limite = embalagens.includes(unidade) ? 1
      : ['un.', 'un'].includes(unidade) ? 2
      : ['kg', 'L'].includes(unidade) ? 1
      : 200;

    if (quantidade <= limite)
      return { texto: 'Está acabando', classe: 'estoque-baixo' };

    return { texto: 'Tem ainda', classe: 'estoque-normal' };
  }

  // RENDERIZAR GELADEIRA
  function renderizarAlimentos() {
    const lista = $('listaAlimentos');
    const contador = $('contadorEstoque');

    if (!lista || !contador) return;

    lista.innerHTML = '';

    contador.textContent =
      `${alimentos.length} ${
        alimentos.length === 1 ? 'alimento' : 'alimentos'
      }`;

    alimentos.forEach(item => {
      const card = document.createElement('article');
      card.className = 'cartao-alimento';

      const status = statusEstoque(item);

      card.innerHTML = `
        <span class="emoji-alimento">
          ${escapar(item.emoji || '🥣')}
        </span>

        <h3 class="nome-alimento">
          ${escapar(item.nome)}
        </h3>

        <span class="quantidade-alimento">
          ${escapar(formatarQuantidade(item))}
        </span>

        <span class="status-estoque ${status.classe}">
          ${status.texto}
        </span>

        <div class="acoes-alimento">
          <button type="button" data-acao="menos"
            data-id="${item.id}">−</button>

          <button type="button" data-acao="mais"
            data-id="${item.id}">＋</button>

          <button type="button" class="remover-alimento"
            data-acao="remover"
            data-id="${item.id}">×</button>
        </div>
      `;

      lista.appendChild(card);
    });

    if ($('listaReceitas')) renderizarReceitas();
  }

  // RECEITAS
  function obterEstado(receita) {
    const faltantes = receita.ingredientes.filter(
      ([chave]) => !temIngrediente(chave)
    );

    return {
      faltantes,
      total: receita.ingredientes.length,
      disponiveis: receita.ingredientes.length - faltantes.length
    };
  }

  function nomeCategoria(categoria) {
    return {
      cafe: 'Café da manhã',
      lanche: 'Lanche',
      almoco: 'Almoço',
      janta: 'Janta',
      doce: 'Doce',
      salgado: 'Salgado'
    }[categoria] || categoria;
  }

  function renderizarReceitas() {
    const lista = $('listaReceitas');

    if (!lista || !$('buscarReceita') ||
        !$('filtroCategoria') ||
        !$('filtroDisponibilidade') ||
        !$('semReceitas')) return;

    const termo = normalizar($('buscarReceita').value);
    const categoria = $('filtroCategoria').value;
    const disponibilidade = $('filtroDisponibilidade').value;

    lista.innerHTML = '';

    const filtradas = receitas
      .map(receita => ({
        ...receita,
        estado: obterEstado(receita)
      }))
      .filter(receita => {
        const texto = normalizar(
          receita.nome + ' ' +
          receita.descricao + ' ' +
          receita.ingredientes.map(i => i[1]).join(' ')
        );

        return (!termo || texto.includes(termo)) &&
          (categoria === 'todas' ||
            receita.categorias.includes(categoria)) &&
          (disponibilidade === 'todas' ||
            (disponibilidade === 'completas'
              ? receita.estado.faltantes.length === 0
              : receita.estado.faltantes.length > 0));
      })
      .sort((a, b) =>
        a.estado.faltantes.length - b.estado.faltantes.length ||
        b.estado.disponiveis - a.estado.disponiveis ||
        a.nome.localeCompare(b.nome, 'pt-BR')
      );

    $('semReceitas').hidden = filtradas.length > 0;

    filtradas.forEach(receita => {
      const card = document.createElement('article');
      card.className = 'cartao-receita';

      const tags = receita.ingredientes
        .map(([chave, nome]) => `
          <span class="ingrediente-tag ${
            temIngrediente(chave) ? '' : 'faltando'
          }">
            ${temIngrediente(chave) ? '✓ ' : '+ '}
            ${escapar(nome)}
          </span>
        `).join('');

      const status = receita.estado.faltantes.length
        ? `<span class="etiqueta-status incompleta">
             Faltam ${receita.estado.faltantes.length} ingrediente(s)
           </span>`
        : `<span class="etiqueta-status">✓ Você tem tudo!</span>`;

      const faltam = receita.estado.faltantes.length
        ? `<p class="resumo-faltantes">
             Falta: ${receita.estado.faltantes.map(i => escapar(i[1])).join(', ')}
           </p>`
        : '';

      card.innerHTML = `
        <div class="topo-cartao-receita">
          <span class="icone-receita">${receita.emoji}</span>
          <div class="titulo-cartao-receita">
            <h3>${escapar(receita.nome)}</h3>
            <div class="meta-receita">
              ${receita.tempo} min · ${escapar(receita.dificuldade)}
              <br>
              ${receita.categorias.map(nomeCategoria).join(' · ')}
            </div>
          </div>
        </div>

        ${status}
        <p class="descricao-receita">${escapar(receita.descricao)}</p>
        <p class="rotulo-ingredientes">Ingredientes</p>
        <div class="lista-ingredientes-receita">${tags}</div>
        ${faltam}

        <button class="botao-ver-receita"
          type="button" data-receita="${receita.id}">
          Ver receita e preparo →
        </button>
      `;

      lista.appendChild(card);
    });
  }

  // DETALHES DA RECEITA
  function abrirReceita(id) {
    const receita = receitas.find(i => i.id === Number(id));
    if (!receita) return;

    const estado = obterEstado(receita);

    const ingredientes = receita.ingredientes
      .map(([chave, nome]) => `
        <li>
          <span class="ingrediente-tag ${
            temIngrediente(chave) ? '' : 'faltando'
          }">
            ${temIngrediente(chave) ? 'Você tem' : 'Falta'}:
            ${escapar(nome)}
          </span>
        </li>
      `).join('');

    $('detalheReceita').innerHTML = `
      <div class="detalhe-cabecalho">
        <span class="icone-receita">${receita.emoji}</span>
        <h2>${escapar(receita.nome)}</h2>
        <p>${escapar(receita.descricao)}</p>
        <p><strong>Tempo:</strong> ${receita.tempo} minutos ·
        <strong>Dificuldade:</strong> ${escapar(receita.dificuldade)}</p>
      </div>

      <div class="detalhe-receita">
        <h3>Ingredientes</h3>
        <ul>${ingredientes}</ul>

        ${
          estado.faltantes.length
            ? `<p><strong>Você ainda precisa de:</strong>
              ${estado.faltantes.map(i => escapar(i[1])).join(', ')}.</p>`
            : `<p>Você cadastrou todos os ingredientes necessários!
              Confira se as quantidades são suficientes.</p>`
        }

        <h3>Modo de preparo</h3>
        <ol>${receita.modo.map(p => `<li>${escapar(p)}</li>`).join('')}</ol>
      </div>
    `;

    const modal = $('modalReceita');
    if (modal.showModal) modal.showModal();
    else modal.setAttribute('open', '');
  }

  // FORMULÁRIO
  const secaoFormulario = $('formularioAlimento');
  const formulario = $('formAlimento');
  const botaoAbrir = $('abrirFormulario');
  const botaoCancelar = $('cancelarFormulario');
  const campoEmbalagem = $('campoEmbalagem');
  const unidadeAlimento = $('unidadeAlimento');

  botaoAbrir?.addEventListener('click', () => {
    secaoFormulario.hidden = false;
    botaoAbrir.hidden = true;
    formulario.hidden = false;
    $('nomeAlimento')?.focus();
  });

  botaoCancelar?.addEventListener('click', () => {
    secaoFormulario.hidden = true;
    botaoAbrir.hidden = false;
    formulario.reset();
    if (campoEmbalagem) campoEmbalagem.style.display = 'none';
    $('mensagemEstoque').textContent = '';
  });

  function atualizarCampoEmbalagem() {
    if (!campoEmbalagem || !unidadeAlimento) return;
    campoEmbalagem.style.display =
      embalagens.includes(unidadeAlimento.value) ? 'block' : 'none';
  }

  unidadeAlimento?.addEventListener('change', atualizarCampoEmbalagem);
  atualizarCampoEmbalagem();

  function converterBase(valor, unidade) {
    if (unidade === 'kg') return { quantidade: valor * 1000, unidade: 'g' };
    if (unidade === 'L') return { quantidade: valor * 1000, unidade: 'ml' };
    if (unidade === 'un.') return { quantidade: valor, unidade: 'un' };
    return { quantidade: valor, unidade };
  }

  function arredondar(valor) {
    return Number(Number(valor).toFixed(3));
  }

  // CADASTRAR
  formulario?.addEventListener('submit', async evento => {
    evento.preventDefault();

    const nome = $('nomeAlimento').value.trim();
    const quantidade = Number($('quantidadeAlimento').value);
    const unidade = unidadeAlimento.value;
    const emoji = $('emojiAlimento').value;
    const embalada = embalagens.includes(unidade);

    const conteudo = embalada
      ? Number($('pesoPacoteAlimento').value)
      : null;

    const unidadeConteudo = embalada
      ? $('unidadeConteudoAlimento').value
      : unidade;

    if (!nome || !Number.isFinite(quantidade) || quantidade <= 0) {
      $('mensagemEstoque').textContent =
        'Informe o nome e uma quantidade válida.';
      return;
    }

    if (embalada && (!Number.isFinite(conteudo) || conteudo <= 0)) {
      $('mensagemEstoque').textContent =
        'Informe o conteúdo de cada embalagem.';
      return;
    }

    if (!ninhoId) {
      $('mensagemEstoque').textContent =
        'Não foi possível identificar seu Ninho.';
      return;
    }

    const convertido = converterBase(embalada ? conteudo : quantidade, unidadeConteudo);
    const unidadeBase = convertido.unidade;
    const total = arredondar(quantidade * convertido.quantidade);

    const existente = alimentos.find(item =>
      chaveAlimento(item.nome) === chaveAlimento(nome) &&
      item.unidade === unidadeBase &&
      (embalada
        ? item.unidade_exibicao === unidade &&
          Number(item.conteudo_embalagem) === convertido.quantidade &&
          item.unidade_conteudo === unidadeBase
        : !embalagens.includes(unidadeOriginal(item)))
    );

    try {
      if (existente) {
        const atualizacao = {
          quantidade: arredondar(Number(existente.quantidade) + total),
          unidade_exibicao: unidade
        };

        if (embalada) {
          atualizacao.quantidade_embalagens =
            arredondar(Number(existente.quantidade_embalagens || 0) + quantidade);
        }

        const { error } = await banco.from('alimentos')
          .update(atualizacao)
          .eq('id', existente.id)
          .eq('ninho_id', ninhoId);

        if (error) throw error;
      } else {
        const { error } = await banco.from('alimentos').insert({
          ninho_id: ninhoId,
          nome,
          quantidade: total,
          unidade: unidadeBase,
          emoji,
          unidade_exibicao: unidade,
          quantidade_embalagens: embalada ? quantidade : null,
          conteudo_embalagem: embalada ? convertido.quantidade : null,
          unidade_conteudo: embalada ? unidadeBase : null
        });

        if (error) throw error;
      }

      await carregar();
      renderizarAlimentos();
      formulario.reset();
      if (campoEmbalagem) campoEmbalagem.style.display = 'none';
      secaoFormulario.hidden = true;
      botaoAbrir.hidden = false;
      $('mensagemEstoque').textContent = 'Alimento guardado com carinho!';
    } catch (erro) {
      console.error('Erro ao salvar:', erro);
      $('mensagemEstoque').textContent =
        'Não foi possível salvar. Verifique sua conexão e tente novamente.';
    }
  });

  // BOTÕES DE QUANTIDADE
  $('listaAlimentos')?.addEventListener('click', async evento => {
    const botao = evento.target.closest('button[data-acao]');
    if (!botao || botao.disabled) return;

    const item = alimentos.find(i => String(i.id) === botao.dataset.id);
    if (!item || !ninhoId) return;

    const acao = botao.dataset.acao;
    const unidade = unidadeOriginal(item);
    const embalada = embalagens.includes(unidade);
    const quantidadeAtual = Number(item.quantidade);
    const pacotes = Number(item.quantidade_embalagens || 0);

    let atualizacao = null;
    let remover = false;

    if (acao === 'mais') {
      if (embalada) {
        const conteudo = Number(item.conteudo_embalagem);
        atualizacao = {
          quantidade: arredondar(quantidadeAtual + conteudo),
          quantidade_embalagens: pacotes + 1
        };
      } else {
        const passo = ['kg', 'L'].includes(unidade) ? 1000
          : ['g', 'ml'].includes(item.unidade) ? 100 : 1;
        atualizacao = { quantidade: arredondar(quantidadeAtual + passo) };
      }
    } else if (acao === 'menos') {
      if (embalada) {
        const novoTotal = pacotes - 1;
        if (novoTotal <= 0) remover = true;
        else atualizacao = {
          quantidade: arredondar(quantidadeAtual - Number(item.conteudo_embalagem)),
          quantidade_embalagens: novoTotal
        };
      } else {
        const passo = ['kg', 'L'].includes(unidade) ? 1000
          : ['g', 'ml'].includes(item.unidade) ? 100 : 1;
        const novaQuantidade = arredondar(quantidadeAtual - passo);
        if (novaQuantidade <= 0) remover = true;
        else atualizacao = { quantidade: novaQuantidade };
      }
    } else if (acao === 'remover') {
      remover = true;
    } else return;

    botao.disabled = true;
    const anterior = { ...item };

    if (remover) alimentos = alimentos.filter(i => i.id !== item.id);
    else Object.assign(item, atualizacao);

    renderizarAlimentos();

    try {
      const resposta = remover
        ? await banco.from('alimentos').delete().eq('id', item.id).eq('ninho_id', ninhoId)
        : await banco.from('alimentos').update(atualizacao).eq('id', item.id).eq('ninho_id', ninhoId);

      if (resposta.error) throw resposta.error;
      $('mensagemEstoque').textContent =
        remover ? 'Alimento removido.' : 'Estoque atualizado!';
    } catch (erro) {
      console.error('Erro ao atualizar:', erro);
      if (remover) alimentos.push(anterior);
      else Object.assign(item, anterior);
      renderizarAlimentos();
      $('mensagemEstoque').textContent =
        'Não foi possível atualizar. Tente novamente.';
    }
  });

  // FILTROS E MODAL
  $('buscarReceita')?.addEventListener('input', renderizarReceitas);
  $('filtroCategoria')?.addEventListener('change', renderizarReceitas);
  $('filtroDisponibilidade')?.addEventListener('change', renderizarReceitas);

  $('listaReceitas')?.addEventListener('click', evento => {
    const botao = evento.target.closest('[data-receita]');
    if (botao) abrirReceita(botao.dataset.receita);
  });

  $('fecharModal')?.addEventListener('click', () => $('modalReceita')?.close());
  $('modalReceita')?.addEventListener('click', evento => {
    if (evento.target === $('modalReceita')) $('modalReceita').close();
  });

  // INICIAR
  async function iniciarPagina() {
    try {
      const { data: { user }, error: erroUsuario } = await banco.auth.getUser();

      if (erroUsuario || !user)
        throw new Error('Você precisa estar logado para acessar a geladeira.');

      const { data: membro, error: erroMembro } = await banco
        .from('membros')
        .select('ninho_id')
        .eq('id', user.id)
        .single();

      if (erroMembro || !membro?.ninho_id)
        throw new Error('Não foi possível identificar seu Ninho.');

      ninhoId = membro.ninho_id;
      await carregar();
      renderizarAlimentos();
    } catch (erro) {
      console.error('Erro ao iniciar:', erro);
      $('mensagemEstoque').textContent = erro.message;
    }
  }

  iniciarPagina();
})();
