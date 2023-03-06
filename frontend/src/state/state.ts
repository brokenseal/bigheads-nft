export type BaseAction<T, P> = {
  type: T
  payload: P
}
export type UpdateBalanceAction = BaseAction<'update-balance', string>
export type UpdateBigHeadsCountAction = BaseAction<
  'update-minted-nfts',
  string[]
>
export type UpdateBigHeadsAvailableCountAction = BaseAction<
  'update-available-count',
  number
>
export type UpdateBaseUriAction = BaseAction<'update-base-uri', string>
export type ErrorAction = BaseAction<'error', Error>
export type Action =
  | UpdateBalanceAction
  | UpdateBigHeadsCountAction
  | UpdateBigHeadsAvailableCountAction
  | UpdateBaseUriAction
  | ErrorAction

export type AppState = {
  currentBalance?: string
  errors: Error[]
  minted: string[]
  availableCount: number
  baseUri?: string
}

const initialState: AppState = {
  errors: [],
  minted: [],
  availableCount: 0,
  baseUri: undefined,
}

const reducer = (state: AppState, action: Action): AppState => {
  const { type, payload } = action

  switch (type) {
    case 'error':
      return { ...state, errors: [...state.errors, payload] }
    case 'update-balance':
      return { ...state, currentBalance: payload }
    case 'update-minted-nfts':
      return { ...state, minted: payload }
    case 'update-base-uri':
      return { ...state, baseUri: payload }
    case 'update-available-count':
      return { ...state, availableCount: payload }
    default:
      throw new Error(`Unhandled or undefined reducer action type ${type}`)
  }
}

export { initialState, reducer }
