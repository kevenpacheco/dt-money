import { useContextSelector } from 'use-context-selector'
import { Header } from '../../components/Header'
import { Summary } from '../../components/Summary'
import { TransactionsContext } from '../../contexts/TransactionsContext'
import { dateFormatter, priceFormatter } from '../../utils/formatter'
import { DateFilterButton } from './components/DateFilterButton'
import { Pagination } from './components/Pagination'
import { SearchForm } from './components/SearchForm'
import {
  PriceHighlight,
  TransactionsContainer,
  TransactionsTable,
} from './styles'

export function Transactions() {
  const dataContext = useContextSelector(TransactionsContext, (context) => ({
    transactions: context.transactions,
    transactionsCount: context.transactionsCount,
    filters: context.filters,
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
