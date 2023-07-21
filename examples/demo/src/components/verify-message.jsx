/* eslint-disable unicorn/no-useless-undefined */
import { useState } from 'preact/hooks'
import { useFilsnapContext } from '../hooks/filsnap.js'
import { verifyMessage } from '@stfil/filecoin-utils'
import { NetworkPrefix } from '@stfil/filecoin-utils/build/artifacts/address'

// @ts-ignore-next-line
const VerifyMessage = () => {
  const { isLoading, snap } = useFilsnapContext()
  const [address, setAddress] = useState(
    /** @type {string | undefined | null} */ (undefined)
  )
  const [error, setError] = useState(
    /** @type {string | undefined } */ (undefined)
  )

  /** @type {import('preact/src/jsx.js').JSXInternal.GenericEventHandler<HTMLFormElement>} */
  async function handleSubmit(event) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const message = data.get('message') || ''
    const signature = data.get('signature') || ''
    const networkPrefix = (snap?.config?.network || 'testnet') == 'mainnet' ? NetworkPrefix.Mainnet : NetworkPrefix.Testnet
    
    console.log('snap: ', snap?.config?.network)

    if (message && signature) {
      try {
        // @ts-ignore
        const address = await verifyMessage(message, signature, networkPrefix)
        setAddress(address)
        // @ts-ignore
        setError(null)
      } catch (err) {
        // @ts-ignore
        setError(err.toString())
      }
    }
  }

  return (
    <div class="Box Cell100">
      <h3>Verify</h3>
      {error && <code data-testid="error">{error}</code>}
      <form method="post" onSubmit={handleSubmit}>
        <label>
          Message: <input name="message" />
          Signature: <input name="signature" />
          <button
            type="submit"
            data-testid="get-public-key"
            disabled={isLoading}
          >
            Verify Message
          </button>
        </label>
      </form>
      <code data-testid="output">{address}</code>
    </div>
  )
}

export default VerifyMessage
