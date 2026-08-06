export interface Category {
  id: string
  label: string
  bgColor: string
  textColor: string
  borderColor: string
  hoverBgColor: string
}

export const CATEGORIES: Category[] = [
  { id: 'preliminares', label: 'Serviços preliminares', bgColor: 'bg-yellow-100', textColor: 'text-yellow-700', borderColor: 'border-yellow-300', hoverBgColor: 'hover:bg-yellow-200' },
  { id: 'fundacao', label: 'Fundação', bgColor: 'bg-amber-100', textColor: 'text-amber-700', borderColor: 'border-amber-300', hoverBgColor: 'hover:bg-amber-200' },
  { id: 'estrutura', label: 'Estrutura', bgColor: 'bg-orange-100', textColor: 'text-orange-700', borderColor: 'border-orange-300', hoverBgColor: 'hover:bg-orange-200' },
  { id: 'alvenaria', label: 'Alvenaria', bgColor: 'bg-red-100', textColor: 'text-red-700', borderColor: 'border-red-300', hoverBgColor: 'hover:bg-red-200' },
  { id: 'cobertura', label: 'Cobertura', bgColor: 'bg-rose-100', textColor: 'text-rose-700', borderColor: 'border-rose-300', hoverBgColor: 'hover:bg-rose-200' },
  { id: 'eletrica', label: 'Instalações elétricas', bgColor: 'bg-blue-100', textColor: 'text-blue-700', borderColor: 'border-blue-300', hoverBgColor: 'hover:bg-blue-200' },
  { id: 'hidraulica', label: 'Instalações hidráulicas', bgColor: 'bg-cyan-100', textColor: 'text-cyan-700', borderColor: 'border-cyan-300', hoverBgColor: 'hover:bg-cyan-200' },
  { id: 'esquadrias', label: 'Esquadrias', bgColor: 'bg-teal-100', textColor: 'text-teal-700', borderColor: 'border-teal-300', hoverBgColor: 'hover:bg-teal-200' },
  { id: 'revestimentos', label: 'Revestimentos', bgColor: 'bg-green-100', textColor: 'text-green-700', borderColor: 'border-green-300', hoverBgColor: 'hover:bg-green-200' },
  { id: 'pintura', label: 'Pintura', bgColor: 'bg-violet-100', textColor: 'text-violet-700', borderColor: 'border-violet-300', hoverBgColor: 'hover:bg-violet-200' },
  { id: 'loucas_metais', label: 'Louças e metais', bgColor: 'bg-indigo-100', textColor: 'text-indigo-700', borderColor: 'border-indigo-300', hoverBgColor: 'hover:bg-indigo-200' },
  { id: 'mao_de_obra', label: 'Mão de obra', bgColor: 'bg-purple-100', textColor: 'text-purple-700', borderColor: 'border-purple-300', hoverBgColor: 'hover:bg-purple-200' },
  { id: 'externos', label: 'Serviços externos', bgColor: 'bg-pink-100', textColor: 'text-pink-700', borderColor: 'border-pink-300', hoverBgColor: 'hover:bg-pink-200' },
  { id: 'outros', label: 'Outros', bgColor: 'bg-gray-100', textColor: 'text-gray-700', borderColor: 'border-gray-300', hoverBgColor: 'hover:bg-gray-200' },
]

export function categoryLabel(id: string | null): string {
  if (!id) return 'Sem categoria'
  return CATEGORIES.find((c) => c.id === id)?.label ?? 'Sem categoria'
}

export function categoryColors(id: string | null) {
  if (!id) return { bgColor: 'bg-gray-100', textColor: 'text-gray-700', borderColor: 'border-gray-300', hoverBgColor: 'hover:bg-gray-200' }
  const cat = CATEGORIES.find((c) => c.id === id)
  return cat ? { bgColor: cat.bgColor, textColor: cat.textColor, borderColor: cat.borderColor, hoverBgColor: cat.hoverBgColor } : { bgColor: 'bg-gray-100', textColor: 'text-gray-700', borderColor: 'border-gray-300', hoverBgColor: 'hover:bg-gray-200' }
}

export interface Unit {
  id: string
  label: string
}

export const UNITS: Unit[] = [
  { id: 'un', label: 'unidade' },
  { id: 'sc', label: 'saco' },
  { id: 'm', label: 'metro' },
  { id: 'm²', label: 'metro quadrado' },
  { id: 'm³', label: 'metro cúbico' },
  { id: 'kg', label: 'quilo' },
  { id: 't', label: 'tonelada' },
  { id: 'L', label: 'litro' },
  { id: 'cx', label: 'caixa' },
  { id: 'pç', label: 'peça' },
  { id: 'mi', label: 'milheiro' },
  { id: 'br', label: 'barra' },
  { id: 'vb', label: 'verba' },
  { id: 'diária', label: 'diária' },
]

export const PAYMENT_METHODS = [
  'Dinheiro',
  'PIX',
  'Cartão de crédito',
  'Cartão de débito',
  'Boleto',
  'Transferência',
]

const BANK_REQUIRED = new Set(['PIX', 'Cartão de crédito'])

export function needsBank(paymentMethod: string | null): boolean {
  return paymentMethod !== null && BANK_REQUIRED.has(paymentMethod)
}
