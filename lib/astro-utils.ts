import { serverTranslate } from "@/lib/server-translation"

export function getSignoSolar(dia: number, mes: number, idioma = "pt"): string {
  if ((mes === 3 && dia >= 21) || (mes === 4 && dia <= 19)) return serverTranslate("zodiac.aries", idioma as any)
  if ((mes === 4 && dia >= 20) || (mes === 5 && dia <= 20)) return serverTranslate("zodiac.taurus", idioma as any)
  if ((mes === 5 && dia >= 21) || (mes === 6 && dia <= 20)) return serverTranslate("zodiac.gemini", idioma as any)
  if ((mes === 6 && dia >= 21) || (mes === 7 && dia <= 22)) return serverTranslate("zodiac.cancer", idioma as any)
  if ((mes === 7 && dia >= 23) || (mes === 8 && dia <= 22)) return serverTranslate("zodiac.leo", idioma as any)
  if ((mes === 8 && dia >= 23) || (mes === 9 && dia <= 22)) return serverTranslate("zodiac.virgo", idioma as any)
  if ((mes === 9 && dia >= 23) || (mes === 10 && dia <= 22)) return serverTranslate("zodiac.libra", idioma as any)
  if ((mes === 10 && dia >= 23) || (mes === 11 && dia <= 21)) return serverTranslate("zodiac.scorpio", idioma as any)
  if ((mes === 11 && dia >= 22) || (mes === 12 && dia <= 21)) return serverTranslate("zodiac.sagittarius", idioma as any)
  if ((mes === 12 && dia >= 22) || (mes === 1 && dia <= 19)) return serverTranslate("zodiac.capricorn", idioma as any)
  if ((mes === 1 && dia >= 20) || (mes === 2 && dia <= 18)) return serverTranslate("zodiac.aquarius", idioma as any)
  if ((mes === 2 && dia >= 19) || (mes === 3 && dia <= 20)) return serverTranslate("zodiac.pisces", idioma as any)
  return serverTranslate("zodiac.unknown", idioma as any)
}

export function formatarDataNascimento(dataISO?: string, idioma = "pt"): string {
  if (!dataISO) return serverTranslate("date.notInformed", idioma as any)
  try {
    const data = new Date(dataISO)
    // Adiciona 1 dia para corrigir potencial problema de fuso horário na conversão de string ISO para Date
    const dataCorrigida = new Date(data.getUTCFullYear(), data.getUTCMonth(), data.getUTCDate() + 1)

    // Determinar o locale com base no idioma
    let locale = "pt-BR"
    switch (idioma) {
      case "en": locale = "en-US"; break;
      case "es": locale = "es-ES"; break;
      case "fr": locale = "fr-FR"; break;
      case "it": locale = "it-IT"; break;
      case "de": locale = "de-DE"; break;
      case "ru": locale = "ru-RU"; break;
      case "ja": locale = "ja-JP"; break;
      case "zh": locale = "zh-CN"; break;
      case "ar": locale = "ar-SA"; break;
      default: locale = "pt-BR";
    }

    return dataCorrigida.toLocaleDateString(locale, {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })
  } catch (e) {
    return serverTranslate("date.invalid", idioma as any)
  }
}
