import { useCallback, useEffect, useState } from 'react'
import { Transaction } from '../../@types/Transaction'
import { Header } from '../../components/Header'
import { Summary } from '../../components/Summary'
import { api } from '../../lib/axios'
import { dateFormatter, priceFormatter } from '../../utils/formatter'
import { Pagination } from './components/Pagination'
import { SearchForm } from './components/SearchForm'
import {
  PriceHighlight,
  TransactionsContainer,
  TransactionsTable,
} from './styles'

export function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [totalTransactions, setTotalTransactions] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  function handleNextPage() {
    setCurrentPage((prevState) => prevState + 1)
  }

  function handlePrevPage() {
    setCurrentPage((prevState) => prevState - 1)
  }

  function handleSetPage(page: number) {
    setCurrentPage(page)
  }

  const fetchTransactions = useCallback(
    async (query?: string) => {
      const response = await api.get('/transactions', {
        params: {
          _page: currentPage,
          _limit: 10,
          q: query,
        },
      })

      setTransactions(response.data)
      setTotalTransactions(Number(response.headers?.['X-Total-Count'] || 0))
    },
    [currentPage],
  )

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  return (
    <div>
      <Header />
      <Summary />

      <TransactionsContainer>
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
          totalItemsPerPage={transactions.length}
          onNextPage={handleNextPage}
          onPrevPage={handlePrevPage}
          onSetPage={handleSetPage}
        />
      </TransactionsContainer>
    </div>
  )
}
