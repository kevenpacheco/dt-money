import { useContextSelector } from 'use-context-selector'
import { Header } from '../../components/Header'
import { Summary } from '../../components/Summary'
import { TransactionsContext } from '../../contexts/TransactionsContext'
import { DateFilterButton } from './components/DateFilterButton'
import { Pagination } from './components/Pagination'
import { SearchForm } from './components/SearchForm'
import { TransactionCard } from './components/TransactionCard'
import { TransactionCardLoading } from './components/TransactionCard/TransactionCardLoading'
import { TransactionsContainer, TransactionsTable } from './styles'

export function Transactions() {
  const dataContext = useContextSelector(TransactionsContext, (context) => ({
    transactions: context.transactions,
    transactionsCount: context.transactionsCount,
    filters: context.filters,
    isCreateingNewTransaction: context.isCreateingNewTransaction,
    selectNewDate: context.selectNewDate,
    fetchTransactions: context.fetchTransactions,
    nextPage: context.nextPage,
    prevPage: context.prevPage,
    selectPage: context.selectPage,
  }))

  const {
    transactions,
    transactionsCount,
    filters,
    isCreateingNewTransaction,
    selectNewDate,
    fetchTransactions,
    nextPage,
    prevPage,
    selectPage,
  } = dataContext

  return (
    <>
      <Header />

      <TransactionsContainer>
        <DateFilterButton
          currentDate={filters.initialDate}
          onSelectDate={selectNewDate}
        />

        <Summary />

        <SearchForm onSearch={fetchTransactions} />

        <div style={{ overflowX: 'auto' }}>
          <TransactionsTable>
            <tbody>
              {isCreateingNewTransaction && <TransactionCardLoading />}
              {transactions.map((transaction) => {
                return (
                  <TransactionCard key={transaction.id} data={transaction} />
                )
              })}
            </tbody>
          </TransactionsTable>
        </div>

        <Pagination
          currentPage={filters.page}
          totalItems={transactionsCount}
          totalItemsPerPage={filters.limitPerPage}
          onNextPage={nextPage}
          onPrevPage={prevPage}
          onSetPage={selectPage}
        />
      </TransactionsContainer>
    </>
  )
}
