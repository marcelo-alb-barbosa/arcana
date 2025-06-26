export interface TarotCardData {
  id: string
  nome: string
  tipo: "Maior" | "Menor"
  naipe?: "Paus" | "Copas" | "Espadas" | "Ouros"
  imagemUrl: string
  interpretacaoCurta: string
  falaImpactante: string
  interpretacaoCompleta: string
  palavrasChave: string[]
}

export const baralhoExemplo: TarotCardData[] = [
  // ARCANOS MAIORES
  {
    id: "m0",
    nome: "O Louco",
    tipo: "Maior",
    imagemUrl: "/placeholder.svg?width=200&height=350",
    interpretacaoCurta: "Novos começos e fé no desconhecido. Um salto corajoso para o incerto.",
    falaImpactante: "O abismo te chama. Pularás?",
    interpretacaoCompleta:
      "O Louco representa o início de uma jornada, o potencial ilimitado e a coragem de dar o primeiro passo sem saber o destino. Ele te convida a abraçar o desconhecido com fé e otimismo, a liberar-se de velhas amarras e a confiar na sua intuição. Este é um momento para espontaneidade e para seguir o chamado da sua alma, mesmo que o caminho pareça incerto. A aventura espera por aqueles que ousam sonhar e se lançar.",
    palavrasChave: ["início", "fé", "inocência", "potencial"],
  },
  {
    id: "m1",
    nome: "O Mago",
    tipo: "Maior",
    imagemUrl: "/placeholder.svg?width=200&height=350",
    interpretacaoCurta: "Poder de manifestação e habilidade. Você tem as ferramentas para criar sua realidade.",
    falaImpactante: "Você tem as ferramentas. Qual realidade conjurarás?",
    interpretacaoCompleta:
      "O Mago é o mestre da manifestação, o alquimista que transforma potencial em realidade. Ele detém todas as ferramentas e recursos necessários para criar o que deseja, simbolizando habilidade, poder pessoal e concentração. Esta carta te lembra que você possui os talentos e a capacidade para moldar seu destino. Foque sua intenção, utilize seus dons e aja com confiança para materializar seus sonhos.",
    palavrasChave: ["poder", "habilidade", "concentração", "vontade"],
  },
  {
    id: "m2",
    nome: "A Sacerdotisa",
    tipo: "Maior",
    imagemUrl: "/placeholder.svg?width=200&height=350",
    interpretacaoCurta: "Intuição e sabedoria oculta. Confie na sua voz interior e nos mistérios não revelados.",
    falaImpactante: "O véu se ergue por um instante. O que vês além?",
    interpretacaoCompleta:
      "A Sacerdotisa é a guardiã dos mistérios, da intuição e do conhecimento oculto. Ela te convida a olhar para dentro, a silenciar a mente e a ouvir a sabedoria do seu subconsciente. Há verdades que não são ditas, apenas sentidas. Confie na sua voz interior, explore os reinos da intuição e respeite os segredos que ainda não foram revelados. A paciência e a introspecção te guiarão.",
    palavrasChave: ["intuição", "segredos", "sabedoria", "passividade"],
  },
  {
    id: "m3",
    nome: "A Imperatriz",
    tipo: "Maior",
    imagemUrl: "/placeholder.svg?width=200&height=350",
    interpretacaoCurta: "Abundância e criatividade. Fertilidade, beleza e conexão com a natureza.",
    falaImpactante: "A abundância floresce de dentro. Nutra-a.",
    interpretacaoCompleta:
      "A Imperatriz personifica a fertilidade, a abundância, a beleza e o poder criativo da natureza e do feminino. Ela é a mãe que nutre, que gera vida e que proporciona conforto e segurança. Esta carta anuncia um período de crescimento, de colheita e de expressão da sua criatividade. Conecte-se com a natureza, cuide de si e dos outros, e permita que a abundância flua em todas as áreas da sua vida.",
    palavrasChave: ["abundância", "criação", "natureza", "maternidade"],
  },
  {
    id: "m4",
    nome: "O Imperador",
    tipo: "Maior",
    imagemUrl: "/placeholder.svg?width=200&height=350",
    interpretacaoCurta: "Autoridade e estrutura. Liderança, disciplina e estabelecimento de ordem.",
    falaImpactante: "O trono aguarda. Assumirás o comando?",
    interpretacaoCompleta:
      "O Imperador representa autoridade, estrutura e liderança. Ele simboliza o poder masculino organizado, a disciplina e a capacidade de criar ordem a partir do caos. Esta carta sugere que é hora de assumir o controle, estabelecer limites claros e liderar com sabedoria. O Imperador te lembra que o verdadeiro poder vem da responsabilidade e do compromisso com seus princípios.",
    palavrasChave: ["autoridade", "estrutura", "liderança", "disciplina"],
  },

  // ARCANOS MENORES
  {
    id: "me1",
    nome: "Ás de Paus",
    tipo: "Menor",
    naipe: "Paus",
    imagemUrl: "/placeholder.svg?width=200&height=350",
    interpretacaoCurta: "Nova oportunidade criativa. Uma centelha de inspiração e energia para começar.",
    falaImpactante: "A faísca da criação está em suas mãos. O que acenderás?",
    interpretacaoCompleta:
      "O Ás de Paus é a centelha primordial da criatividade, da paixão e da vontade. Ele anuncia um novo começo cheio de energia e potencial, uma oportunidade para iniciar um projeto, uma aventura ou uma nova fase de autodescoberta. Agarre esta inspiração com entusiasmo e coragem, pois a semente da grandeza está presente. É hora de agir, de manifestar suas ideias e de acender a chama da sua paixão.",
    palavrasChave: ["criação", "vontade", "ação", "entusiasmo"],
  },
  {
    id: "me2",
    nome: "Dois de Copas",
    tipo: "Menor",
    naipe: "Copas",
    imagemUrl: "/placeholder.svg?width=200&height=350",
    interpretacaoCurta: "União e parceria. Harmonia e conexão emocional profunda com outros.",
    falaImpactante: "Dois corações, uma só melodia. Ouça.",
    interpretacaoCompleta:
      "O Dois de Copas celebra a união, a parceria e a conexão emocional profunda. Ele fala de relacionamentos harmoniosos, seja no amor, na amizade ou em colaborações. Esta carta representa a atração mútua, o respeito e a compreensão que formam a base de laços significativos. Abra seu coração para dar e receber afeto, e cultive as conexões que nutrem sua alma. A beleza da partilha se revela.",
    palavrasChave: ["parceria", "amor", "harmonia", "conexão"],
  },
  {
    id: "me3",
    nome: "Três de Espadas",
    tipo: "Menor",
    naipe: "Espadas",
    imagemUrl: "/placeholder.svg?width=200&height=350",
    interpretacaoCurta: "Dor emocional e separação. Enfrentar verdades dolorosas para encontrar a cura.",
    falaImpactante: "A dor perfura, mas a verdade liberta. Encare.",
    interpretacaoCompleta:
      "O Três de Espadas é uma carta de dor emocional, desgosto e verdades difíceis. Ela representa um momento de clareza dolorosa, onde ilusões são desfeitas e a realidade se impõe, mesmo que traga sofrimento. Embora seja um arcano difícil, ele também carrega a semente da cura. Ao enfrentar a dor e aceitar a verdade, você se liberta para seguir em frente. Permita-se sentir, processar e, eventualmente, curar.",
    palavrasChave: ["dor", "tristeza", "conflito", "verdade"],
  },
  {
    id: "me4",
    nome: "Quatro de Ouros",
    tipo: "Menor",
    naipe: "Ouros",
    imagemUrl: "/placeholder.svg?width=200&height=350",
    interpretacaoCurta: "Segurança material e controle. Estabilidade financeira, mas cuidado com a avareza.",
    falaImpactante: "O que guardas com tanto zelo? Vale a pena?",
    interpretacaoCompleta:
      "O Quatro de Ouros representa segurança material, estabilidade financeira e o desejo de controlar recursos. Esta carta pode indicar uma fase de consolidação e proteção do que foi conquistado. No entanto, também alerta para o perigo da avareza e do apego excessivo aos bens materiais. É importante encontrar o equilíbrio entre segurança e generosidade, entre guardar e compartilhar.",
    palavrasChave: ["segurança", "controle", "estabilidade", "avareza"],
  },
  {
    id: "me5",
    nome: "Cinco de Paus",
    tipo: "Menor",
    naipe: "Paus",
    imagemUrl: "/placeholder.svg?width=200&height=350",
    interpretacaoCurta: "Conflito e competição. Disputas e desafios que testam sua determinação.",
    falaImpactante: "A batalha se intensifica. Lutarás ou recuarás?",
    interpretacaoCompleta:
      "O Cinco de Paus simboliza conflito, competição e disputas. Esta carta representa momentos de tensão onde diferentes forças ou opiniões se chocam. Pode indicar rivalidade no trabalho, conflitos de ideias ou competição acirrada. Embora desafiador, este arcano também traz a oportunidade de crescimento através do conflito construtivo. É hora de defender suas convicções, mas também de aprender a escolher suas batalhas com sabedoria.",
    palavrasChave: ["conflito", "competição", "disputa", "tensão"],
  },
]

export const simularTiragemEspecifica = (): TarotCardData[] => {
  const maiores = baralhoExemplo.filter((c) => c.tipo === "Maior")
  const menores = baralhoExemplo.filter((c) => c.tipo === "Menor")

  // Garantir que temos cartas suficientes
  if (maiores.length < 3 || menores.length < 2) {
    console.warn("Não há cartas suficientes no baralho de exemplo para esta tiragem.")
    return baralhoExemplo.slice(0, 5)
  }

  // Padrão: Maior, Menor, Maior, Menor, Maior
  return [
    maiores[0], // Posição 0 (topo) - Arcano Maior
    menores[0], // Posição 1 (baixo) - Arcano Menor
    maiores[1], // Posição 2 (topo) - Arcano Maior
    menores[1], // Posição 3 (baixo) - Arcano Menor
    maiores[2], // Posição 4 (topo) - Arcano Maior
  ]
}
