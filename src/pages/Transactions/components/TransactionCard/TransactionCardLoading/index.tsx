import * as SBase from '../styles'
import * as S from './styles'

export function TransactionCardLoading() {
  return (
    <SBase.TransactionCardContainer>
      <td width="50%">
        <S.Loading />
      </td>
      <td>
        <S.Loading />
      </td>
      <td>
        <S.Loading />
      </td>
      <td>
        <S.Loading />
      </td>
    </SBase.TransactionCardContainer>
  )
}
