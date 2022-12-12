import { Loading } from '../../../../../components/Loading'
import * as SBase from '../styles'

export function TransactionCardLoading() {
  return (
    <SBase.TransactionCardContainer>
      <td width="50%">
        <Loading />
      </td>
      <td>
        <Loading />
      </td>
      <td>
        <Loading />
      </td>
      <td>
        <Loading />
      </td>
    </SBase.TransactionCardContainer>
  )
}
