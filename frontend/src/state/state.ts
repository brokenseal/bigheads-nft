export type BaseAction<T, P> = {
  type: T
  payload: P
}
export type UpdateBalanceAction = BaseAction<'update-balance', string>
export type UpdateBigHeadsCountAction = BaseAction<
  'update-minted-nfts',
  string[]
>
export type ErrorAction = BaseAction<'error', Error>
export type Action =
  | UpdateBalanceAction
  | UpdateBigHeadsCountAction
  | ErrorAction

export type AppState = {
  currentBalance?: string
  errors: Error[]
  minted: string[]
}

const initialState: AppState = { errors: [], minted: [] }

const reducer = (state: AppState, action: Action): AppState => {
  const { type, payload } = action

  switch (type) {
    case 'error':
      return { ...state, errors: [...state.errors, payload] }
    case 'update-balance':
      return { ...state, currentBalance: payload }
    case 'update-minted-nfts':
      return { ...state, minted: payload }
    default:
      throw new Error(`Unhandled or undefined reducer action type ${type}`)
  }
}

export { initialState, reducer }
