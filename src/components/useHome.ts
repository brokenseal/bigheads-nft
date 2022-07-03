import { useCallback, useEffect, useMemo } from 'react'
import { useEth } from '../eth-context'
import { useAppState } from '../state'

export function useHome() {
  const { state, dispatch } = useAppState()
  const ethContextState = useEth()

  const handleMintedNftUpdate = useCallback(async () => {
    const count = await ethContextState?.eth?.contract?.methods
      .count()
      .call({ from: ethContextState?.eth?.accounts[0] })

    const countAsNumber = Number(count)
    if (isNaN(countAsNumber)) {
      return
    }

    dispatch({
      type: 'update-big-heads-count',
      payload: countAsNumber,
    })
  }, [ethContextState?.eth?.contract, ethContextState?.eth?.accounts, dispatch])

  const handleUpdateBalance = useCallback(() => {
    ethContextState?.eth?.web3.eth
      .getBalance(ethContextState?.eth.accounts[0])
      .then((balance) =>
        dispatch({
          type: 'update-balance',
          payload: balance,
        }),
      )
      .catch((error: Error) =>
        dispatch({
          type: 'error',
          payload: error,
        }),
      )
  }, [dispatch, ethContextState?.eth])

  useEffect(() => {
    handleUpdateBalance()
  }, [handleUpdateBalance])

  useEffect(() => {
    handleMintedNftUpdate()
  }, [handleMintedNftUpdate])

  return useMemo(
    () => ({
      ...state,
      handleUpdateBalance,
      handleMintedNftUpdate,
    }),
    [state, handleUpdateBalance, handleMintedNftUpdate],
  )
}
