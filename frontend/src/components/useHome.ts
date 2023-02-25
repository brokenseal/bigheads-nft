import { useCallback, useEffect, useMemo } from 'react'
import { useEth } from '../eth-context'
import { useAppState } from '../state'

export function useHome() {
  const { state, dispatch } = useAppState()
  const ethContextState = useEth()

  const contract = ethContextState?.eth?.contract
  const eth = ethContextState?.eth
  const account = eth?.accounts[0]
  const getBalance = eth?.web3.eth.getBalance

  const handleError = useCallback(
    (error: Error) => dispatch({ type: 'error', payload: error }),
    [dispatch],
  )

  const handleMintedNftUpdate = useCallback(() => {
    if (!contract || !account) {
      handleError(new Error('No contract available or account available'))
      return
    }

    handleGetAvailableCount()

    contract.methods
      .getMinted()
      .call({ from: account })
      .then((minted: string[]) => {
        dispatch({ type: 'update-minted-nfts', payload: minted })
      })
      .catch(handleError)
  }, [contract, account, dispatch, handleError])

  const handleGetAvailableCount = useCallback(() => {
    if (!contract || !account) {
      handleError(new Error('No contract available or account available'))
      return
    }

    contract.methods
      .getAvailableCount()
      .call({ from: account })
      .then((count: string) => {
        dispatch({ type: 'update-available-count', payload: Number(count) })
      })
      .catch(handleError)
  }, [contract, account, dispatch, handleError])

  const handleUpdateBalance = useCallback(() => {
    if (!account || !getBalance) {
      handleError(new Error('No account available'))
      return
    }

    getBalance(account)
      .then((balance) => dispatch({ type: 'update-balance', payload: balance }))
      .catch(handleError)
  }, [account, getBalance, dispatch, handleError])

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
      handleGetAvailableCount,
    }),
    [
      state,
      handleUpdateBalance,
      handleMintedNftUpdate,
      handleGetAvailableCount,
    ],
  )
}
