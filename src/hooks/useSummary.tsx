import { useContextSelector } from 'use-context-selector'
import { TransactionsContext } from '../contexts/TransactionsContext'

export function useSummary() {
  const summary = useContextSelector(TransactionsContext, (context) => {
    return context.currentMonthSummary
  })

  return summary
}
