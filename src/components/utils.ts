import Web3 from 'web3'

export const formatWeiValue = (web3: Web3, value: string) =>
  parseFloat(web3.utils.fromWei(value, 'ether')).toPrecision(4)
