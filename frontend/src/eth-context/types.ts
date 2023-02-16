import Web3 from 'web3'
import { Contract } from 'web3-eth-contract'
import { BigHeadsInstance } from '@bigheads-nft/backend'
import BigHeadsArtifact from "@bigheads-nft/backend/build/contracts/BigHeads.json";

export type BigHeadsContract = Omit<Contract, 'methods'> & {
  methods: BigHeadsInstance
}

export type EthContextState = {
  eth?: {
    artifact: typeof BigHeadsArtifact
    web3: Web3
    accounts: string[]
    networkID: number
    contract?: Contract // BigHeadsContract
  }
  error?: Error
}
