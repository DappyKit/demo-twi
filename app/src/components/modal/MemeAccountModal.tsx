import React, { useState, useRef, useEffect } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import arrowLeft from 'bootstrap-icons/icons/arrow-left.svg'
import meme from '../../img/meme.jpg'
import { MemeWallet } from '@dappykit/meme-wallet'
import { HDNodeWallet, Wallet } from 'ethers'

interface MemeAccountModalProps {
  show: boolean;
  handleClose: () => void;
  onLogin: (wallet: Wallet | HDNodeWallet) => void;
}

export const MIN_PASSWORD_LENGTH = 6
const STEP_INIT = 'init'
const STEP_CREATE = 'create'
const STEP_CREATE_DOWNLOAD = 'download'
const STEP_UPLOAD = 'upload'

async function getImageBytes(path: string): Promise<Uint8Array> {
  const response = await fetch(path)
  const blob = await response.blob()
  const arrayBuffer = await new Response(blob).arrayBuffer()
  return new Uint8Array(arrayBuffer)
}

function displayImageOnCanvas(bytes: Uint8Array, canvas: HTMLCanvasElement) {
  const blob = new Blob([bytes], {type: 'image/jpeg'})
  const url = URL.createObjectURL(blob)
  const img = new Image()

  img.onload = () => {
    const ctx = canvas.getContext('2d')
    if (ctx) {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
    }
    URL.revokeObjectURL(url)
  }

  img.src = url
}

function downloadBytesAsJPG(bytes: Uint8Array, filename: string) {
  const blob = new Blob([bytes], {type: 'image/jpeg'})
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')

  a.href = url
  a.download = filename
  a.click()

  URL.revokeObjectURL(url)
}

async function readFileAsArrayBuffer(file: File): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      resolve(new Uint8Array(e.target!.result as ArrayBuffer))
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsArrayBuffer(file)
  })
}

export function MemeAccountModal({show, handleClose, onLogin}: MemeAccountModalProps) {
  const [imageBytes, setImageBytes] = useState<Uint8Array>(new Uint8Array([]))
  const [imageExistsBytes, setImageExistsBytes] = useState<Uint8Array>(new Uint8Array([]))
  const [secretImageBytes, setSecretImageBytes] = useState<Uint8Array>(new Uint8Array([]))
  const [wallet, setWallet] = useState<HDNodeWallet>()
  const [step, setStep] = useState(STEP_INIT)
  const [password, setPassword] = useState('')
  const [passwordValid, setPasswordValid] = useState(true)
  const [showUpload, setShowUpload] = useState(false)
  const fileCreatedInputRef = useRef<HTMLInputElement>(null)
  const fileExistsInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleNewAccount = () => {
    setStep(STEP_CREATE)
  }

  const handleExistingAccount = () => {
    setShowUpload(true)
    setStep(STEP_UPLOAD)
  }

  const handleNextCreate = async () => {
    if (password.length >= MIN_PASSWORD_LENGTH) {
      const wallet = Wallet.createRandom()
      setWallet(wallet)
      setSecretImageBytes(await MemeWallet.embedWallet(imageBytes, wallet, password))
      setStep(STEP_CREATE_DOWNLOAD)
    } else {
      setPasswordValid(false)
    }
  }

  const handleBack = () => {
    setStep(STEP_CREATE)
    setShowUpload(false)
    setPassword('')
  }

  const handleDownloadCreatedCanvas = () => {
    downloadBytesAsJPG(secretImageBytes, 'meme.jpg')
    setShowUpload(true)
  }

  const handleCreatedUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    async function run() {
      const file = event.target.files?.[0]
      if (file) {
        const bytes = await readFileAsArrayBuffer(file)
        const extractedWallet = await MemeWallet.extractWallet(bytes, password)
        if (extractedWallet.address === wallet?.address) {
          alert('Wallet is valid!')
          onLogin && onLogin(extractedWallet)
        } else {
          alert('Wallet is not valid!')
        }
      }
    }

    run()
  }

  const handleExistsUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    async function run() {
      const file = event.target.files?.[0]
      if (file) {
        const bytes = await readFileAsArrayBuffer(file)
        setImageExistsBytes(bytes)
      }
    }

    run()
  }

  const handleLogin = async (bytes: Uint8Array, password: string) => {
    try {
      const extractedWallet = await MemeWallet.extractWallet(bytes, password)
      onLogin && onLogin(extractedWallet)
    } catch (e) {
      console.log('Wallet login error: ', e)
      alert('Incorrect password or image')
    }
  }

  useEffect(() => {
    async function run() {
      const data = await getImageBytes(meme)
      setImageBytes(data)
    }

    if (show) {
      setStep(STEP_INIT)
      setPassword('')
      setShowUpload(false)
    }

    run()
  }, [show])

  useEffect(() => {
    if (!canvasRef) {
      return
    }

    if (step === STEP_CREATE_DOWNLOAD) {
      displayImageOnCanvas(secretImageBytes, canvasRef.current!)
    }
  }, [step, canvasRef])

  return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Meme Account Creation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {step === STEP_INIT && (
              <>
                <Button variant="outline-primary" onClick={handleNewAccount} className="w-100 mb-2">
                  🆕 New Account
                </Button>
                <Button variant="outline-secondary" onClick={handleExistingAccount} className="w-100">
                  ✅ Already Have an Meme
                </Button>
              </>
          )}

          {step === STEP_CREATE && (
              <>
                <Form.Group controlId="password">
                  <Form.Control
                      placeholder="Enter a password for your account"
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        setPasswordValid(e.target.value.length >= MIN_PASSWORD_LENGTH)
                      }}
                      isInvalid={!passwordValid}
                  />
                  <Form.Control.Feedback type="invalid">
                    Password must be at least {MIN_PASSWORD_LENGTH} characters long.
                  </Form.Control.Feedback>
                </Form.Group>
                <div className="mt-3">
                  <Button variant="outline-primary" onClick={handleNextCreate} className="w-100"
                          disabled={password.length < MIN_PASSWORD_LENGTH}>
                    Next
                  </Button>
                </div>
              </>
          )}

          {step === STEP_CREATE_DOWNLOAD && (
              <>
                <Button variant="link" onClick={handleBack} style={{padding: '0', borderRadius: '50%'}}
                        className={'mb-3'}>
                  <img src={arrowLeft} alt="back" style={{width: '20px', height: '20px', borderRadius: '50%'}}/>
                </Button>

                <p>Hold up! This image is your secret key to your Meme Wallet, so guard it like a treasure. Don't share
                  it around. In crypto, your security is top priority! 👑🔒</p>
                <canvas ref={canvasRef} style={{width: '100%', height: 'auto'}}></canvas>
                <Button variant="outline-primary" onClick={handleDownloadCreatedCanvas} className="w-100 mb-3">
                  Download
                </Button>
                {showUpload && (
                    <>
                      <input ref={fileCreatedInputRef} type="file" hidden onChange={handleCreatedUpload}/>
                      <Button variant="outline-primary" onClick={() => fileCreatedInputRef.current?.click()}
                              className="w-100">
                        Upload
                      </Button>
                    </>
                )}
              </>
          )}
          {step === STEP_UPLOAD && (
              <>
                <Button variant="link" onClick={() => setStep(STEP_INIT)} className="mb-3"
                        style={{padding: '0', borderRadius: '50%'}}>
                  <img src={arrowLeft} alt="back" style={{width: '20px', height: '20px', borderRadius: '50%'}}/>
                </Button>
                <input ref={fileExistsInputRef} type="file" hidden onChange={handleExistsUpload}/>
                <Button variant="outline-secondary" onClick={() => fileExistsInputRef.current?.click()}
                        className="w-100 mb-3">
                  📂 Select Meme Wallet
                </Button>
                <Form.Group controlId="password">
                  <Form.Control
                      placeholder="Enter your password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>
                <div className="mt-3">
                  <Button variant="outline-primary" onClick={() => handleLogin(imageExistsBytes, password)}
                          className="w-100"
                          disabled={!(password.length >= MIN_PASSWORD_LENGTH && imageExistsBytes.length > 0)}>
                    Login
                  </Button>
                </div>
              </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
  )
}
