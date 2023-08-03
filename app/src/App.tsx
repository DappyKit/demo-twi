import React from 'react'
import Main from './components/Main'
import CreateAccount from './components/CreateAccount'

export enum AppStatus {
    CreatingAccount = 'creating_account',
    LoggedIn = 'logged_in',
}

/**
 * App component
 */
const App: React.FC = () => {
    const [status, setStatus] = React.useState<string>(AppStatus.CreatingAccount)
    return (
        <>
            {status === AppStatus.CreatingAccount && <CreateAccount onLogin={() => {
                setStatus(AppStatus.LoggedIn)
            }}/>}

            {status === AppStatus.LoggedIn && <Main/>}
        </>
    )
}

export default App
