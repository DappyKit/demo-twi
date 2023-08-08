import React from 'react'
import Main from './components/Main'
import CreateAccount from './components/CreateAccount'
import { useStatus } from './provider/StatusProvider'
import { getMetamaskProvider, validateCorrectNetwork } from './SocialConnections/client'
import { BrowserProvider, JsonRpcProvider, Wallet } from 'ethers'

export enum AppStatus {
  CreatingAccount = 'creating_account',
  LoggedIn = 'logged_in',
}

/**
 * App component
 */
const App: React.FC = () => {
  const [status, setStatus] = React.useState<string>(AppStatus.CreatingAccount)
  const {setAddress, setWallet, setWeb3Provider} = useStatus()

  return (
      <>
        {status === AppStatus.CreatingAccount && <CreateAccount onLogin={async walletOrAddress => {
          try {
            let provider
            if (typeof walletOrAddress === 'string') {
              provider = await getMetamaskProvider() as BrowserProvider
              setWeb3Provider(provider)
              setAddress(walletOrAddress)
            } else {
              provider = new JsonRpcProvider(process.env.REACT_APP_PROVIDER_URL)
              const connectedWallet = walletOrAddress.connect(provider)
              setAddress(connectedWallet.address)
              setWeb3Provider(connectedWallet.provider as BrowserProvider)
              setWallet(connectedWallet)
            }

            await validateCorrectNetwork(provider)
            setStatus(AppStatus.LoggedIn)
          } catch (e) {
            alert(`Error: ${(e as Error).message}`)
          }
        }}/>}

        {status === AppStatus.LoggedIn && <Main/>}
      </>
  )
}

export default App
