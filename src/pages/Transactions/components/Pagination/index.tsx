import { CaretLeft, CaretRight } from 'phosphor-react'
import { useContextSelector } from 'use-context-selector'
import { TransactionsContext } from '../../../../contexts/TransactionsContext'
import {
  PaginationContainer,
  PaginationNavigateButton,
  PaginationPageButton,
} from './styles'

interface PaginationProps {
  currentPage: number
  onPrevPage: () => void
  onNextPage: () => void
  onSetPage: (page: number) => void
}

export function Pagination({
  currentPage,
  onNextPage,
  onPrevPage,
  onSetPage,
}: PaginationProps) {
  const transactionsPageCount = useContextSelector(
    TransactionsContext,
    (context) => {
      return Math.ceil(context.transactions.length / 1)
    },
  )

  const isLastPage = currentPage === transactionsPageCount
  const isFirstPage = currentPage === 1

  function renderPageButtons() {
    const pages = []
    const maxPageButtons = 4
    const interval = maxPageButtons / 2

    const numberOfPageButtonsToAddOnTheRight =
      interval - currentPage >= 0 ? interval - currentPage : 0

    const numberOfPageButtonsToAddOnTheLeft =
      currentPage + interval - transactionsPageCount >= 0
        ? currentPage + interval - transactionsPageCount
        : 0

    for (
      let numberPage = 1;
      numberPage <= transactionsPageCount;
      numberPage++
    ) {
      const isVisible =
        numberPage <=
          currentPage + interval + numberOfPageButtonsToAddOnTheRight &&
        numberPage > currentPage - interval - numberOfPageButtonsToAddOnTheLeft

      if (isVisible) {
        pages.push(
          <PaginationPageButton
            key={numberPage}
            isActive={numberPage === currentPage}
            onClick={() => onSetPage(numberPage)}
          >
            {numberPage}
          </PaginationPageButton>,
        )
      }
    }

    return pages
  }

  return (
    <PaginationContainer>
      <PaginationNavigateButton disabled={isFirstPage} onClick={onPrevPage}>
        <CaretLeft weight="bold" size={24} />
      </PaginationNavigateButton>

      <div>{renderPageButtons()}</div>

      <PaginationNavigateButton disabled={isLastPage} onClick={onNextPage}>
        <CaretRight weight="bold" size={24} />
      </PaginationNavigateButton>
    </PaginationContainer>
  )
}
