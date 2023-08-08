import React, { useEffect, useState } from 'react'
import { getAddress, getMetamaskInstance } from '../SocialConnections/client'
import { MemeAccountModal } from './modal/MemeAccountModal'
import { HDNodeWallet, Wallet } from 'ethers'

export interface CreateAccountProps {
  onLogin: (address: string | Wallet | HDNodeWallet) => void
}

const CreateAccount: React.FC<CreateAccountProps> = ({onLogin}) => {
  const [isProgress, setIsProgress] = React.useState<boolean>(false)
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  const onMetamaskClick = async () => {
    setIsProgress(true)
    setTimeout(() => {
      setIsProgress(false)
    }, 3000)
    try {
      const instance = await getMetamaskInstance()
      if (instance.isConnected()) {
        const address = await getAddress()
        onLogin && onLogin(address)
      }
    } catch (e) {
      console.log('Metamask login error', e)
    } finally {
      setIsProgress(false)
    }

    setTimeout(async () => {
      try {
        const address = await getAddress()
        address && onLogin && onLogin(address)
      } catch (e) {
      }
    }, 300)
  }

  const onFastAccountClick = () => {
    // setIsProgress(true)
    // console.log('Fast Account clicked')
    handleShow()
  }

  useEffect(() => {
    try {


      window?.ethereum?.on('accountsChanged', data => {
        // @ts-ignore
        if (!(data && data.length > 0)) {
          return
        }

        // @ts-ignore
        onLogin && onLogin(data[0])
      })
    } catch (e) {
      console.log('Cannot add event listener to Metamask', e)
    }
  }, [])

  return (
      <div className="vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="col-12 col-sm-8 col-md-4 col-lg-3 mx-auto text-center">
          <p className="fs-4 mb-4 p-sm-5 p-md-1">
            To enter, use Metamask to login with your existing account or create a Fast Meme Account.
          </p>

          {isProgress && <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
          </div>}

          {!isProgress && <>
              <div className="row mb-3 px-3 px-sm-0">
                  <button className="btn btn-outline-secondary btn-lg w-100" onClick={onMetamaskClick}
                          disabled={isProgress}>
                      🦊 Metamask
                  </button>
              </div>
              <div className="row px-3 px-sm-0">
                  <button className="btn btn-outline-primary btn-lg w-100" onClick={onFastAccountClick}
                          disabled={isProgress}>
                      🚀 Meme Account
                  </button>
              </div>
          </>}
        </div>

        <MemeAccountModal show={show} handleClose={handleClose} onLogin={onLogin}/>
      </div>
  )
}

export default CreateAccount
