import { ReactNode, useCallback, useEffect, useState } from 'react'
import { createContext } from 'use-context-selector'
import { Transaction } from '../@types/Transaction'
import { api } from '../lib/axios'

interface FiltersType {
  page: number
  limitPerPage: number
  initialDate: Date
  finalDate: Date
}
interface SummaryType {
  income: number
  outcome: number
  total: number
}
interface CreateTransactionInput {
  description: string
  price: number
  category: string
  type: 'income' | 'outcome'
}

interface TransactionsContextType {
  transactions: Transaction[]
  currentMonthSummary: SummaryType
  transactionsCount: number
  filters: FiltersType
  isCreateingNewTransaction: boolean
  isLoadingTransactions: boolean
  fetchTransactions: (query?: string) => Promise<void>
  createTransaction: (data: CreateTransactionInput) => Promise<void>
  nextPage: () => void
  prevPage: () => void
  selectPage: (page: number) => void
  selectNewDate: (newDate: Date) => void
}

interface TransactionsProviderProps {
  children: ReactNode
}

export const TransactionsContext = createContext({} as TransactionsContextType)

export function TransactionsProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [transactionsCount, setTransactionsCount] = useState(0)
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(false)
  const [currentMonthSummary, setCurrentMonthSummary] = useState<SummaryType>({
    income: 0,
    outcome: 0,
    total: 0,
  })

  const todayFullYear = new Date().getFullYear()
  const todayMonth = new Date().getMonth()
  const [filters, setFilters] = useState<FiltersType>({
    page: 1,
    limitPerPage: 7,
    initialDate: new Date(todayFullYear, todayMonth, 1),
    finalDate: new Date(todayFullYear, todayMonth + 1, 0),
  })

  const [isCreateingNewTransaction, setIsCreateingNewTransaction] =
    useState(false)

  function nextPage() {
    setFilters((prevState) => ({ ...prevState, page: prevState.page + 1 }))
  }

  function prevPage() {
    setFilters((prevState) => ({ ...prevState, page: prevState.page - 1 }))
  }

  function selectPage(page: number) {
    setFilters((prevState) => ({ ...prevState, page }))
  }

  function selectNewDate(newDate: Date) {
    const newFullYear = newDate.getFullYear()
    const newMonth = newDate.getMonth()

    setFilters((prevState) => ({
      ...prevState,
      initialDate: new Date(newFullYear, newMonth, 1),
      finalDate: new Date(newFullYear, newMonth + 1, 0),
    }))
  }

  const fetchTransactions = useCallback(
    async (query?: string) => {
      setIsLoadingTransactions(true)

      try {
        const { page, limitPerPage, initialDate, finalDate } = filters

        const response = await api.get('/transactions', {
          params: {
            _page: page,
            _limit: limitPerPage,
            q: query,
            createdAt_gte: initialDate,
            createdAt_lte: finalDate,
          },
        })

        setTransactions(response.data)
        setTransactionsCount(Number(response.headers?.['x-total-count'] || 0))
      } finally {
        setIsLoadingTransactions(false)
      }
    },
    [filters],
  )

  const fetchSummaryTransactionsByMonth = useCallback(async () => {
    setIsLoadingTransactions(true)

    try {
      const response = await api.get('/transactions', {
        params: {
          createdAt_gte: filters.initialDate,
          createdAt_lte: filters.finalDate,
        },
      })

      const transactionsByMonth: Transaction[] = response.data
      const summary = transactionsByMonth.reduce(
        (acc, transaction) => {
          if (transaction.type === 'income') {
            acc.income += transaction.price
            acc.total += transaction.price
          } else {
            acc.outcome += transaction.price
            acc.total -= transaction.price
          }

          return acc
        },
        {
          income: 0,
          outcome: 0,
          total: 0,
        },
      )

      setCurrentMonthSummary(summary)
    } finally {
      setIsLoadingTransactions(false)
    }
  }, [filters.initialDate, filters.finalDate])

  const createTransaction = useCallback(
    async (data: CreateTransactionInput) => {
      setIsCreateingNewTransaction(true)

      try {
        const { category, description, price, type } = data

        const response = await api.post('/transactions', {
          category,
          description,
          price,
          type,
          createdAt: new Date(),
        })

        setTransactions((prevState) => [response.data, ...prevState])
      } catch (error) {
      } finally {
        setIsCreateingNewTransaction(false)
      }
    },
    [],
  )

  useEffect(() => {
    fetchTransactions()
    fetchSummaryTransactionsByMonth()
  }, [fetchTransactions, fetchSummaryTransactionsByMonth])

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        currentMonthSummary,
        filters,
        transactionsCount,
        isCreateingNewTransaction,
        isLoadingTransactions,
        fetchTransactions,
        createTransaction,
        nextPage,
        prevPage,
        selectNewDate,
        selectPage,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  )
}
