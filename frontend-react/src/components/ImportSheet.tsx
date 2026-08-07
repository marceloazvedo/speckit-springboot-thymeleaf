import { useState } from 'react'
import { Upload, X } from 'lucide-react'
import { Button } from './ui/button'
import { Label } from './ui/label'
import type { Expense, Entry } from '../lib/types'

interface ImportSheetProps {
  open: boolean
  onClose: () => void
  onImport: (expenses: Expense[], entries: Entry[]) => void
}

export function ImportSheet({ open, onClose, onImport }: ImportSheetProps) {
  const [importing, setImporting] = useState(false)
  const [preview, setPreview] = useState<{ expenses: number; entries: number } | null>(null)
  const [error, setError] = useState('')

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError('')
    setImporting(true)
    setPreview(null)

    try {
      const text = await file.text()
      const data = JSON.parse(text)

      if (!data.expenses || !Array.isArray(data.expenses)) {
        throw new Error('Formato inválido: falta array de "expenses"')
      }

      const expenses = data.expenses as Expense[]
      const entries = (data.entries || []) as Entry[]

      // Validação básica
      if (expenses.length === 0) {
        throw new Error('Nenhum gasto para importar')
      }

      setPreview({
        expenses: expenses.length,
        entries: entries.length,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao ler arquivo')
      setPreview(null)
    } finally {
      setImporting(false)
    }
  }

  const handleImport = async () => {
    const fileInput = document.getElementById('import-file') as HTMLInputElement
    const file = fileInput?.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const data = JSON.parse(text)
      onImport(data.expenses || [], data.entries || [])
      onClose()
    } catch (err) {
      setError('Erro ao importar dados')
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end z-50">
      <div className="w-full bg-surface rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Importar Gastos</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-light rounded-lg transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="import-file">Selecione arquivo JSON</Label>
            <div className="mt-2 relative">
              <input
                id="import-file"
                type="file"
                accept=".json"
                onChange={handleFileSelect}
                disabled={importing}
                className="hidden"
              />
              <button
                onClick={() => document.getElementById('import-file')?.click()}
                disabled={importing}
                className="w-full border-2 border-dashed border-line rounded-lg p-8 text-center hover:border-primary transition-colors disabled:opacity-50"
              >
                <Upload className="size-8 mx-auto mb-2 text-muted" />
                <div className="text-sm font-medium">Clique para selecionar arquivo</div>
                <div className="text-xs text-muted mt-1">Formato: JSON (export do script Python)</div>
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {preview && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
              <div className="text-sm font-medium text-blue-900">Preview da importação:</div>
              <div className="text-sm text-blue-800">
                • {preview.expenses} gastos
                {preview.entries > 0 && ` + ${preview.entries} entradas`}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              variant="ghost"
              full
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              full
              disabled={!preview || importing}
              onClick={handleImport}
            >
              {importing ? 'Importando...' : 'Importar'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
