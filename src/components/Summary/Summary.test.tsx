import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Summary } from '.'
import { TransactionsContext } from '../../contexts/TransactionsContext'

describe('<Summary />', () => {
  it('should render the summary', () => {
    const fakeContextProviderValues = {
      transactions: [],
      transactionsCount: 0,
      currentMonthSummary: {
        income: 14000,
        outcome: 50,
        total: 13950,
      },
      filters: {
        page: 1,
        limitPerPage: 1,
        initialDate: new Date(),
        finalDate: new Date(),
      },
      isCreateingNewTransaction: false,
      isLoadingTransactions: false,
      fetchTransactions: async () => {},
      createTransaction: async () => {},
      nextPage: () => {},
      prevPage: () => {},
      selectPage: () => {},
      selectNewDate: () => {},
    }

    render(
      <TransactionsContext.Provider value={fakeContextProviderValues}>
        <Summary />
      </TransactionsContext.Provider>,
    )

    const incomeText = screen.getByText('Entradas')
    const incomeValue = screen.getByText('R$ 14.000,00')

    const outcomeText = screen.getByText('Saídas')
    const outcomeValue = screen.getByText('R$ 50,00')

    const totalText = screen.getByText('Total')
    const totalValue = screen.getByText('R$ 13.950,00')

    expect(incomeText).toBeInTheDocument()
    expect(incomeValue).toBeInTheDocument()

    expect(outcomeText).toBeInTheDocument()
    expect(outcomeValue).toBeInTheDocument()

    expect(totalText).toBeInTheDocument()
    expect(totalValue).toBeInTheDocument()
  })
})
