import pt from "../locales/pt"
import en from "../locales/en"
import es from "../locales/es"
import fr from "../locales/fr"
import it from "../locales/it"
import de from "../locales/de"
import ru from "../locales/ru"
import ja from "../locales/ja"
import zh from "../locales/zh"
import ar from "../locales/ar"

type IdiomaSuportado = "pt" | "en" | "es" | "fr" | "it" | "de" | "ru" | "ja" | "zh" | "ar"

// Traduções
const traducoes = {
  pt,
  en,
  es,
  fr,
  it,
  de,
  ja,
  zh,
  ru,
  ar,
}

/**
 * Simple server-side translation function
 * @param key Translation key
 * @param idioma Language code (defaults to Portuguese)
 * @returns Translated string
 */
export function serverTranslate(key: string, idioma: IdiomaSuportado = "pt"): string {
  // Verificar se a chave existe no idioma atual
  if (traducoes[idioma] && traducoes[idioma][key as keyof (typeof traducoes)[typeof idioma]]) {
    return traducoes[idioma][key as keyof (typeof traducoes)[typeof idioma]]
  }

  // Se não existir no idioma atual, tentar em inglês
  if (idioma !== "en" && traducoes["en"] && traducoes["en"][key as keyof (typeof traducoes)["en"]]) {
    return traducoes["en"][key as keyof (typeof traducoes)["en"]]
  }

  // Se não existir em inglês, retornar a chave
  return key
}