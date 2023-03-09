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
    (error: Error) => {
      console.error(error)
      dispatch({ type: 'error', payload: error })
    },
    [dispatch],
  )

  const handleGetAvailableCount = useCallback(() => {
    if (!contract || !account) {
      // handleError(new Error('No contract available or account available'))
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

  const handleMintedNftUpdate = useCallback(
    (error?: unknown) => {
      if (!contract || !account) {
        // handleError(new Error('No contract available or account available'))
        return
      }

      handleGetAvailableCount()

      contract.methods
        .getMinted()
        .call({ from: account })
        .then((minted: number[]) => {
          dispatch({ type: 'update-minted-nfts', payload: minted })
        })
        .catch(handleError)
    },
    [contract, account, dispatch, handleError, handleGetAvailableCount],
  )

  const handleUpdateBalance = useCallback(() => {
    if (!account || !getBalance) {
      // handleError(new Error('No account available'))
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

  const handleMint = useCallback(
    (error?: unknown) => {
      handleMintedNftUpdate()

      if (error instanceof Error) {
        handleError(error)
      } else if (isSupportedError(error)) {
        handleError(new Error(error as any))
      } else {
        handleError(new Error(`An unknown error occurred; ${error}`))
      }
    },
    [handleMintedNftUpdate, handleError],
  )

  return useMemo(
    () => ({
      ...state,
      handleMint,
      handleUpdateBalance,
      handleMintedNftUpdate,
      handleGetAvailableCount,
    }),
    [
      state,
      handleMint,
      handleUpdateBalance,
      handleMintedNftUpdate,
      handleGetAvailableCount,
    ],
  )
}

function isSupportedError(
  error: unknown,
): error is { code: number; message: string; stack: string } {
  return (
    !!error &&
    error.hasOwnProperty('code') &&
    error.hasOwnProperty('message') &&
    error.hasOwnProperty('stack')
  )
}
