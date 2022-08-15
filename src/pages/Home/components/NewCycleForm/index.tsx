import { FormContainer, MinutesAmountInput, TaskInput } from './styles'
import { useContext } from 'react'
import { useFormContext } from 'react-hook-form'
import { CyclesContext } from '../../../../contexts/CyclesContext'

export default function NewCycleForm() {
  const { activeCycle } = useContext(CyclesContext)

  const { register } = useFormContext()

  return (
    <FormContainer>
      <label htmlFor="task">Vou trabalhar em</label>
      <TaskInput
        disabled={!!activeCycle}
        list="taskSugestions"
        placeholder="Dê um nome para o seu projeto"
        type="text"
        {...register('task')} // criando um nome para o input
      />

      <datalist id="taskSugestions">
        <option value="projeto 1" />
        <option value="projeto 2" />
        <option value="projeto 3" />
      </datalist>

      <label htmlFor="taskTime">durante</label>
      <MinutesAmountInput
        disabled={!!activeCycle}
        placeholder="00"
        id="taskTime"
        type="number"
        step={5}
        min={0}
        max={60}
        {...register('minutesAmount', { valueAsNumber: true })}
      />

      <span>minutos.</span>
    </FormContainer>
  )
}
