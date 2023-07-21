import Account from './components/rpc.jsx'
import Connect from './components/connect.jsx'
import Network from './components/network.jsx'
import Send from './components/send.tsx'
import SignMessage from './components/sign-message.jsx'
import VerifyMessage from './components/verify-message.jsx'
import { useFilsnapContext } from './hooks/filsnap.js'

export function App() {
  const { isConnected } = useFilsnapContext()

  return (
    <main class="App">
      <h1>⨎ Filsnap</h1>
      <div class="Grid">
        <Connect />
        {isConnected && (
          <>
            <Network />
            <Send />
            <details class="Cell100">
              <summary>Advanced</summary>
              <Account />
              <SignMessage />
              <VerifyMessage />
            </details>
          </>
        )}
        <div class="Cell100 Box">
          <h3>Links</h3>
          <ul>
            <li>
              {' '}
              Docs:{' '}
              <a
                target="_blank"
                href="https://filecoin-project.github.io/filsnap/"
                rel="noreferrer"
              >
                filecoin-project.github.io/filsnap
              </a>
            </li>
            <li>
              {' '}
              Github:{' '}
              <a
                target="_blank"
                href="https://github.com/filecoin-project/filsnap"
                rel="noreferrer"
              >
                github.com/filecoin-project/filsnap
              </a>
            </li>
          </ul>
          <br />
        </div>
      </div>
    </main>
  )
}
