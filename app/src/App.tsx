import React from 'react'
import Main from './components/Main'
import CreateAccount from './components/CreateAccount'
import { useStatus } from './provider/StatusProvider'

export enum AppStatus {
    CreatingAccount = 'creating_account',
    LoggedIn = 'logged_in',
}

/**
 * App component
 */
const App: React.FC = () => {
    const [status, setStatus] = React.useState<string>(AppStatus.CreatingAccount)
    const { setAddress} = useStatus()

    return (
        <>
            {status === AppStatus.CreatingAccount && <CreateAccount onLogin={address => {
                setAddress(address)
                setStatus(AppStatus.LoggedIn)
            }}/>}

            {status === AppStatus.LoggedIn && <Main/>}
        </>
    )
}

export default App
