import { useState, type ReactNode } from 'react'
import {
  Building2,
  Download,
  FlaskConical,
  RotateCcw,
  Trash2,
  TriangleAlert,
  UserRound,
} from 'lucide-react'
import { Screen, ScreenTitle } from '../components/Chrome'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { download, entriesToCsv, expensesToCsv } from '../lib/export'
import { notify } from '../lib/notify'
import { navigate } from '../lib/router'
import { alive } from '../lib/selectors'
import { useStore } from '../lib/store'
import { SYNC_ENABLED } from '../lib/sync'

export function Settings() {
  const { state, dispatch, demo, resetAll } = useStore()
  const [name, setName] = useState(state.project?.name ?? '')
  const [confirming, setConfirming] = useState(false)

  const expenseCount = alive(state.expenses).length
  const entryCount = alive(state.entries).length

  return (
    <Screen>
      <ScreenTitle title="Ajustes" />

      <Section title="Obra" icon={<Building2 className="size-4" />}>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => {
            if (name.trim() && name.trim() !== state.project?.name) {
              dispatch({ type: 'renameProject', name })
              notify('Nome atualizado')
            }
          }}
        />
        <p className="mt-2 text-sm text-muted">
          {expenseCount} {expenseCount === 1 ? 'gasto' : 'gastos'} · {entryCount}{' '}
          {entryCount === 1 ? 'entrada' : 'entradas'}
        </p>
      </Section>

      <Section title="Conta" icon={<UserRound className="size-4" />}>
        {SYNC_ENABLED ? (
          <Button full size="lg">
            Entrar ou criar conta
          </Button>
        ) : (
          <p className="text-sm text-muted">
            Hoje seus dados ficam só neste aparelho, e o app funciona inteiro assim. A conta vai
            servir para sincronizar entre celular e computador — ainda não está disponível.
          </p>
        )}
      </Section>

      <Section title="Exportar" icon={<Download className="size-4" />}>
        <div className="space-y-3">
          <Button
            variant="neutral"
            full
            size="lg"
            disabled={expenseCount === 0}
            onClick={() => download('custocasa-gastos.csv', expensesToCsv(state.expenses))}
          >
            <Download /> Baixar gastos em CSV
          </Button>
          <Button
            variant="neutral"
            full
            size="lg"
            disabled={entryCount === 0}
            onClick={() => download('custocasa-entradas.csv', entriesToCsv(state.entries))}
          >
            <Download /> Baixar entradas em CSV
          </Button>
        </div>
      </Section>

      {demo ? (
        <Section title="Obra de exemplo" icon={<FlaskConical className="size-4" />}>
          <div className="space-y-3">
            <p className="text-sm text-muted">
              Esta é uma obra de exemplo. Nada daqui é enviado para lugar nenhum e você pode
              recomeçar quando quiser.
            </p>
            <Button
              variant="neutral"
              full
              size="lg"
              onClick={() => {
                resetAll()
                notify('Obra de exemplo restaurada')
              }}
            >
              <RotateCcw /> Restaurar dados do exemplo
            </Button>
            <Button variant="outline" full size="lg" onClick={() => navigate('/')}>
              Criar a minha obra
            </Button>
          </div>
        </Section>
      ) : (
        <Section title="Apagar tudo" icon={<TriangleAlert className="size-4" />}>
          {confirming ? (
            <div className="space-y-3 rounded-xl border border-danger bg-danger-soft/40 p-4">
              <p className="text-sm text-danger-text">
                Isso apaga a obra, os gastos e as entradas deste aparelho. Não dá para desfazer.
              </p>
              <Button
                variant="danger"
                full
                size="lg"
                onClick={() => {
                  resetAll()
                  setConfirming(false)
                }}
              >
                <Trash2 /> Apagar tudo mesmo
              </Button>
              <Button variant="neutral" full size="lg" onClick={() => setConfirming(false)}>
                Cancelar
              </Button>
            </div>
          ) : (
            <Button variant="dangerGhost" full size="lg" onClick={() => setConfirming(true)}>
              <Trash2 /> Apagar tudo
            </Button>
          )}
        </Section>
      )}

      {demo ? null : (
        <Button variant="ghost" full onClick={() => navigate('/demo')}>
          <FlaskConical /> Ver a obra de exemplo
        </Button>
      )}
    </Screen>
  )
}

function Section({
  title,
  icon,
  children,
}: {
  title: string
  icon: ReactNode
  children: ReactNode
}) {
  return (
    <section className="mb-7">
      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-muted">
        {icon}
        {title}
      </h2>
      {children}
    </section>
  )
}
