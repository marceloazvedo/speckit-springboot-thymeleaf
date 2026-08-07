import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { navigate } from '../lib/router'

export function Onboarding({ onCreate }: { onCreate: (name: string) => void }) {
  const [name, setName] = useState('')
  const valid = name.trim().length > 0

  return (
    <div className="safe-top mx-auto flex min-h-dvh max-w-md flex-col px-5">
      <div className="flex flex-1 flex-col justify-center py-10">
        <h1 className="text-2xl font-semibold">Quanto está custando a sua obra?</h1>
        <p className="mt-2 text-base text-muted">
          Comece dando um nome para ela. Leva cinco segundos e você já pode lançar o primeiro
          gasto.
        </p>

        <Input
          value={name}
          autoFocus
          placeholder="Casa Jardim Europa"
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && valid) onCreate(name)
          }}
          className="mt-8 h-14 text-lg"
        />

        <Button
          full
          size="lg"
          className="mt-4"
          disabled={!valid}
          onClick={() => valid && onCreate(name)}
        >
          Começar <ArrowRight />
        </Button>

        <button
          onClick={() => navigate('/demo')}
          className="mt-6 text-sm font-medium text-muted underline underline-offset-4"
        >
          Ver uma obra de exemplo
        </button>
      </div>

      <p className="safe-bottom pb-4 text-center text-sm text-faint">
        Sem cadastro. Seus dados ficam neste aparelho.
      </p>
    </div>
  )
}
