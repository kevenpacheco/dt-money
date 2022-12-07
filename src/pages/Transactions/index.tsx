import { useCallback, useEffect, useState } from 'react'
import { Transaction } from '../../@types/Transaction'
import { Header } from '../../components/Header'
import { Summary } from '../../components/Summary'
import { api } from '../../lib/axios'
import { dateFormatter, priceFormatter } from '../../utils/formatter'
import { DateFilterButton } from './components/DateFilterButton'
import { Pagination } from './components/Pagination'
import { SearchForm } from './components/SearchForm'
import {
  PriceHighlight,
  TransactionsContainer,
  TransactionsTable,
} from './styles'

interface FiltersType {
  initialDate: Date
  finalDate: Date
}

export function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [totalTransactions, setTotalTransactions] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  const todayFullYear = new Date().getFullYear()
  const todayMonth = new Date().getMonth()
  const [filters, setFilters] = useState<FiltersType>({
    initialDate: new Date(todayFullYear, todayMonth, 1),
    finalDate: new Date(todayFullYear, todayMonth + 1, 0),
  })

  const maxTransactionsPerPage = 7

  function handleNextPage() {
    setCurrentPage((prevState) => prevState + 1)
  }

  function handlePrevPage() {
    setCurrentPage((prevState) => prevState - 1)
  }

  function handleSetPage(page: number) {
    setCurrentPage(page)
  }

  function handleSelectNewDate(newDate: Date) {
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
      const response = await api.get('/transactions', {
        params: {
          _page: currentPage,
          _limit: maxTransactionsPerPage,
          q: query,
          createdAt_gte: filters.initialDate,
          createdAt_lte: filters.finalDate,
        },
      })

      setTransactions(response.data)
      setTotalTransactions(Number(response.headers?.['x-total-count'] || 0))
    },
    [currentPage, filters.finalDate, filters.initialDate],
  )

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  return (
    <>
      <Header />

      <TransactionsContainer>
        <DateFilterButton
          currentDate={filters.initialDate}
          onSelectDate={handleSelectNewDate}
        />

        <Summary transactions={transactions} />

        <SearchForm />

        <div style={{ overflowX: 'auto' }}>
          <TransactionsTable>
            <tbody>
              {transactions.map((transaction) => {
                return (
                  <tr key={transaction.id}>
                    <td width="50%">{transaction.description}</td>
                    <td>
                      <PriceHighlight variant={transaction.type}>
                        {transaction.type === 'outcome' && '- '}
                        {priceFormatter.format(transaction.price)}
                      </PriceHighlight>
                    </td>
                    <td>{transaction.category}</td>
                    <td>
                      {dateFormatter.format(new Date(transaction.createdAt))}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </TransactionsTable>
        </div>

        <Pagination
          currentPage={currentPage}
          totalItems={totalTransactions}
          totalItemsPerPage={maxTransactionsPerPage}
          onNextPage={handleNextPage}
          onPrevPage={handlePrevPage}
          onSetPage={handleSetPage}
        />
      </TransactionsContainer>
    </>
  )
}
