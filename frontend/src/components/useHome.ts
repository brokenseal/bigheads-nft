import { useCallback, useEffect, useMemo } from 'react'
import { useEth } from '../eth-context'
import { useAppState } from '../state'

export function useHome() {
  const { state, dispatch } = useAppState()
  const ethContextState = useEth()

  const handleMintedNftUpdate = useCallback(async () => {
    const contract = ethContextState?.eth?.contract

    if (!contract) {
      return
    }

    const minted: string[] = await contract.methods
      .getMinted()
      .call({ from: ethContextState?.eth?.accounts[0] })

    dispatch({
      type: 'update-minted-nfts',
      payload: minted,
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
