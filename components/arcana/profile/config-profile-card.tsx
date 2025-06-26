import SeletorIdiomaAvancado from "../ui/seletor-idioma-avancado"
import ThemeSelectorAvancado from "../ui/theme-selector-avancado"

export default function ConfigProfileCard() {
  return (
    <div className="space-y-6">
      <SeletorIdiomaAvancado />
      <ThemeSelectorAvancado />
    </div>
  )
}
