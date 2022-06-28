import { useContext } from 'react'
import { EthContext } from './EthProvider'

export const useEth = () => useContext(EthContext)
