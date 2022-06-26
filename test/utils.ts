import { Transfer } from '../types/truffle-contracts/BigHeads'

export const isTransferLog = (log: any): log is Transfer =>
  log.event === 'Transfer'

export async function assertThrows(
  fn: () => Promise<unknown>,
  expectedErrorMessage: string,
) {
  try {
    await fn()
    assert.fail('No error was thrown')
  } catch (error) {
    if (!isError(error)) {
      assert.fail('Critical error')
    }
    assert.ok(
      error.message.includes(expectedErrorMessage),
      `Unexpected error thrown: ${error.message}`,
    )
  }
}

export function isError(x: unknown): x is Error {
  return x instanceof Error
}
