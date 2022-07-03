import { useContext } from 'react'
import { EthContext } from './EthContext'

export const useEth = () => useContext(EthContext)
