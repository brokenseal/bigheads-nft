const actions = {
  init: 'INIT',
}

export type AppState = {
  artifact: any
  web3: any
  accounts: any
  networkID: any
  contract: any
}

const initialState: AppState = {
  artifact: null,
  web3: null,
  accounts: null,
  networkID: null,
  contract: null,
}

const reducer = (state: AppState, action: any): AppState => {
  const { type, data } = action

  switch (type) {
    case actions.init:
      return { ...state, ...data }
    default:
      throw new Error(`Undefined reducer action type ${type}`)
  }
}

export { actions, initialState, reducer }
