import differenceInSeconds from 'date-fns/differenceInSeconds'
import {
  createContext,
  ReactNode,
  useState,
  useReducer,
  useEffect,
} from 'react'
import {
  ActionTypes,
  addNewCycleAction,
  interruptCurrentCycleAction,
  markCurrentCycleAsFinishedAction,
} from '../reducers/cycles/actions'
import { CycleProps, cyclesReducer } from '../reducers/cycles/reducer'

interface CreateCycleProps {
  task: string
  minutesAmount: number
}

interface CyclesContextProps {
  activeCycle: CycleProps | undefined
  activeCycleId: string | null
  amountSecondsPassed: number
  isActiveCycle: boolean
  cycles: CycleProps[]

  markCurrentCycleAsFinished: () => void
  resetCountOfSecondsHasPassed: (seconds: number) => void
  createNewCycle: (data: CreateCycleProps) => void
  interruptCurrentCycle: () => void
}

export const CyclesContext = createContext({} as CyclesContextProps)

interface CyclesContextProviderProps {
  children: ReactNode
}

export default function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  // useReducer recebe 2 parâmetros, uam função e o valor incial.
  const [cyclesState, dispatch] = useReducer(
    cyclesReducer,
    {
      cycles: [],
      activeCycleId: null,
    },
    () => {
      const storageStateAsJSON = localStorage.getItem(
        '@pomodoro: cycles-state-1.0.0',
      )

      if (storageStateAsJSON) {
        return JSON.parse(storageStateAsJSON)
      }
    },
  )

  const { cycles, activeCycleId } = cyclesState

  const [isActiveCycle, setIsActiveCycle] = useState<boolean>(false)

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  const [amountSecondsPassed, setAmountSecondsPassed] = useState<number>(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate))
    }

    return 0
  })

  // salvar cycleState no local storage
  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState)

    localStorage.setItem('@pomodoro: cycles-state-1.0.0', stateJSON)
  }, [cyclesState])

  function resetCountOfSecondsHasPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function markCurrentCycleAsFinished() {
    dispatch(markCurrentCycleAsFinishedAction(activeCycleId))
  }

  function createNewCycle(data: CreateCycleProps) {
    setIsActiveCycle(true)

    const newCycle: CycleProps = {
      id: new Date().getTime().toString(),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    dispatch(addNewCycleAction(newCycle))
    setAmountSecondsPassed(0)
  }

  function interruptCurrentCycle() {
    setIsActiveCycle(false)

    dispatch(interruptCurrentCycleAction(activeCycleId))
  }

  return (
    <CyclesContext.Provider
      value={{
        activeCycle,
        activeCycleId,
        markCurrentCycleAsFinished,
        amountSecondsPassed,
        resetCountOfSecondsHasPassed,
        cycles,
        isActiveCycle,
        interruptCurrentCycle,
        createNewCycle,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}
