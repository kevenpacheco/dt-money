import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TransactionCardLoading } from '.'

describe('<TransactionCardLoading />', () => {
  it('should render transaction card loading', () => {
    render(<TransactionCardLoading />)

    const sut = screen.getByTestId('transaction-card-loading-component')

    expect(sut).toBeInTheDocument()
  })
})
