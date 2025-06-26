// Simula uma chamada de API para salvar o profile do usuário
interface ProfileData {
  username: string
  dataNascimento?: string
  avatarFile?: File // Em uma API real, você lidaria com o upload do arquivo
}

interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
}

export const simularSalvarPerfilAPI = (profileData: ProfileData): Promise<ApiResponse<ProfileData>> => {
  console.log("API Sim: Recebido para salvar:", profileData)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simular sucesso na maioria das vezes
      if (Math.random() > 0.1) {
        // 90% de chance de sucesso
        console.log("API Sim: Perfil salvo com sucesso (simulado).")
        resolve({
          success: true,
          data: {
            ...profileData,
            // Em uma API real, se houvesse upload de avatar, a URL do avatar seria retornada aqui
            // avatarUrl: "url_do_avatar_salvo.jpg"
          },
          message: "Seu profile foi atualizado nos anais do ARCANA.",
        })
      } else {
        console.error("API Sim: Falha ao salvar o profile (simulado).")
        reject({
          success: false,
          message: "Uma interferência mística impediu a atualização do seu profile. Tente novamente.",
        })
      }
    }, 1500) // Simula delay de rede
  })
}

// NOVA API FAKE PARA PERGUNTAS
interface PerguntaTarot {
  id: string
  texto: string
  categoria: "amor" | "trabalho" | "familia" | "dinheiro" | "saude" | "geral"
  popularidade: number // 1-10, para ordenar por mais usadas
}

const perguntasBrasileirasFake: PerguntaTarot[] = [
  // AMOR E RELACIONAMENTOS
  { id: "p001", texto: "Será que ele(a) gosta de mim de verdade?", categoria: "amor", popularidade: 10 },
  { id: "p002", texto: "Meu ex vai voltar?", categoria: "amor", popularidade: 9 },
  { id: "p003", texto: "Quando vou encontrar o amor da minha vida?", categoria: "amor", popularidade: 8 },
  { id: "p004", texto: "Vale a pena insistir nesse relacionamento?", categoria: "amor", popularidade: 7 },
  { id: "p005", texto: "Por que sempre me apaixono pela pessoa errada?", categoria: "amor", popularidade: 6 },
  { id: "p006", texto: "Ele(a) está me traindo?", categoria: "amor", popularidade: 8 },
  { id: "p007", texto: "Devo terminar ou dar mais uma chance?", categoria: "amor", popularidade: 7 },
  { id: "p008", texto: "Vou casar algum dia?", categoria: "amor", popularidade: 6 },

  // TRABALHO E CARREIRA
  { id: "p009", texto: "Vou conseguir esse emprego que estou querendo?", categoria: "trabalho", popularidade: 9 },
  { id: "p010", texto: "Devo pedir aumento pro meu chefe?", categoria: "trabalho", popularidade: 7 },
  { id: "p011", texto: "É hora de mudar de emprego?", categoria: "trabalho", popularidade: 8 },
  { id: "p012", texto: "Meu chefe gosta do meu trabalho?", categoria: "trabalho", popularidade: 6 },
  { id: "p013", texto: "Vou ser promovido(a) esse ano?", categoria: "trabalho", popularidade: 7 },
  { id: "p014", texto: "Devo abrir meu próprio negócio?", categoria: "trabalho", popularidade: 8 },
  { id: "p015", texto: "Por que não consigo arrumar emprego?", categoria: "trabalho", popularidade: 6 },

  // DINHEIRO E FINANÇAS
  { id: "p016", texto: "Vou conseguir quitar minhas dívidas?", categoria: "dinheiro", popularidade: 8 },
  { id: "p017", texto: "É boa hora pra investir?", categoria: "dinheiro", popularidade: 6 },
  { id: "p018", texto: "Vou ganhar na loteria algum dia?", categoria: "dinheiro", popularidade: 7 },
  { id: "p019", texto: "Como posso melhorar minha situação financeira?", categoria: "dinheiro", popularidade: 9 },
  { id: "p020", texto: "Devo emprestar dinheiro pra essa pessoa?", categoria: "dinheiro", popularidade: 5 },
  { id: "p021", texto: "Vou conseguir comprar minha casa própria?", categoria: "dinheiro", popularidade: 8 },

  // FAMÍLIA
  { id: "p022", texto: "Como melhorar a relação com minha mãe?", categoria: "familia", popularidade: 7 },
  { id: "p023", texto: "Meus filhos estão no caminho certo?", categoria: "familia", popularidade: 8 },
  { id: "p024", texto: "Devo ter filhos agora?", categoria: "familia", popularidade: 6 },
  { id: "p025", texto: "Por que minha família não me entende?", categoria: "familia", popularidade: 6 },
  { id: "p026", texto: "Como lidar com esse parente difícil?", categoria: "familia", popularidade: 5 },
  { id: "p027", texto: "Vou conseguir engravidar?", categoria: "familia", popularidade: 7 },

  // SAÚDE
  { id: "p028", texto: "Minha saúde vai melhorar?", categoria: "saude", popularidade: 8 },
  { id: "p029", texto: "Devo me preocupar com esse sintoma?", categoria: "saude", popularidade: 6 },
  { id: "p030", texto: "Como posso ter mais energia no dia a dia?", categoria: "saude", popularidade: 7 },
  { id: "p031", texto: "Vou conseguir emagrecer dessa vez?", categoria: "saude", popularidade: 8 },

  // GERAL/VIDA
  { id: "p032", texto: "O que o futuro reserva pra mim?", categoria: "geral", popularidade: 9 },
  { id: "p033", texto: "Estou no caminho certo da vida?", categoria: "geral", popularidade: 8 },
  { id: "p034", texto: "Por que as coisas não dão certo pra mim?", categoria: "geral", popularidade: 7 },
  { id: "p035", texto: "Qual é o meu propósito na vida?", categoria: "geral", popularidade: 8 },
  { id: "p036", texto: "Devo me mudar de cidade?", categoria: "geral", popularidade: 6 },
  { id: "p037", texto: "Como posso ser mais feliz?", categoria: "geral", popularidade: 9 },
  { id: "p038", texto: "Essa fase ruim vai passar?", categoria: "geral", popularidade: 8 },
  { id: "p039", texto: "O que preciso mudar na minha vida?", categoria: "geral", popularidade: 7 },
  { id: "p040", texto: "Vou realizar meus sonhos?", categoria: "geral", popularidade: 8 },
]

export const buscarPerguntasSugeridas = async (categoria?: string): Promise<PerguntaTarot[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let perguntas = [...perguntasBrasileirasFake]

      // Filtrar por categoria se especificada
      if (categoria && categoria !== "todas") {
        perguntas = perguntas.filter((p) => p.categoria === categoria)
      }

      // Ordenar por popularidade (mais populares primeiro)
      perguntas.sort((a, b) => b.popularidade - a.popularidade)

      // Retornar até 8 perguntas para não sobrecarregar
      resolve(perguntas.slice(0, 8))
    }, 300) // Simula delay de rede
  })
}

export const buscarPerguntaAleatoria = async (): Promise<PerguntaTarot> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const perguntaAleatoria = perguntasBrasileirasFake[Math.floor(Math.random() * perguntasBrasileirasFake.length)]
      resolve(perguntaAleatoria)
    }, 200)
  })
}
