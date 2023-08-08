import { BrowserProvider, ethers, HDNodeWallet, Interface, JsonRpcApiProvider, Provider } from 'ethers'
import SocialConnectionsAbi from './SocialConnectionsAbi.json'
import ForwarderAbi from './Forwarder.json'
import { MethodData, UserInfo } from './interfaces'
import { MetaMaskSDK } from '@metamask/sdk'

const SCAddress = process.env.REACT_APP_SOCIAL_CONNECTIONS_ADDRESS
const ForwarderAddress = process.env.REACT_APP_FORWARDER_ADDRESS
const relayUrl = process.env.REACT_APP_RELAY_URL
const networkName = process.env.REACT_APP_NETWORK_NAME

let MMSDK: MetaMaskSDK

if (!SCAddress) {
  throw new Error('REACT_APP_SOCIAL_CONNECTIONS_ADDRESS is not defined')
}

if (!ForwarderAddress) {
  throw new Error('REACT_APP_FORWARDER_ADDRESS is not defined')
}

if (!process.env.REACT_APP_CHAIN_ID) {
  throw new Error('REACT_APP_CHAIN_ID is not defined')
}

if (!networkName) {
  throw new Error('REACT_APP_NETWORK_NAME is not defined')
}

if (!relayUrl) {
  throw new Error('REACT_APP_RELAY_URL is not defined')
}

const chainId = BigInt(process.env.REACT_APP_CHAIN_ID)

export const EIP712DomainType = [
  {name: 'name', type: 'string'},
  {name: 'version', type: 'string'},
  {name: 'chainId', type: 'uint256'},
  {name: 'verifyingContract', type: 'address'}
]

export const ForwardRequestType = [
  {name: 'from', type: 'address'},
  {name: 'to', type: 'address'},
  {name: 'value', type: 'uint256'},
  {name: 'gas', type: 'uint256'},
  {name: 'nonce', type: 'uint256'},
  {name: 'data', type: 'bytes'},
  {name: 'validUntilTime', type: 'uint256'},
]

export const TypedData = {
  domain: {
    name: 'Defender',
    version: '1',
    chainId: Number(chainId),
    verifyingContract: ForwarderAddress,
  },
  primaryType: 'ForwardRequest',
  types: {
    EIP712Domain: EIP712DomainType,
    ForwardRequest: ForwardRequestType
  },
  message: {}
}

/**
 * Gets future timestamp
 *
 * @param hours Hours to add to current timestamp
 */
function getFutureTimestamp(hours = 24): number {
  const now = Date.now()
  const future = now + hours * 60 * 60 * 1000 // Add specified hours in milliseconds
  return Math.floor(future / 1000) // Convert to Unix timestamp (seconds)
}

/**
 * Gets Metamask instance
 */
export const getMetamaskInstance = async () => {
  const options = {
    checkInstallationImmediately: true,
    checkInstallationOnAllCalls: true,
    dappMetadata: {
      name: 'Web3 Social Network',
    }
  }

  if (MMSDK) {
    return MMSDK.getProvider()
  } else {
    MMSDK = new MetaMaskSDK(options)

    if (!MMSDK.isInitialized()) {
      await MMSDK.init()
    }

    return MMSDK.getProvider()
  }
}

/**
 * Gets an active address of Metamask
 */
export const getAddress = async (): Promise<string> => {
  const accounts = (await (await getMetamaskInstance()).request({
    method: 'eth_requestAccounts',
    params: []
  })) as string[]

  if (accounts && accounts.length) {
    return accounts[0]
  } else {
    throw new Error('Metamask address can not be received')
  }
}

/**
 * Gets Metamask provider
 */
export async function getMetamaskProvider(): Promise<Provider> {
  const instance = await getMetamaskInstance()

  return new BrowserProvider(instance)
}

/**
 * Validates if the correct network is selected
 * @param provider
 */
export async function validateCorrectNetwork(provider: BrowserProvider | JsonRpcApiProvider): Promise<void> {
  const network = await provider.getNetwork()

  if (network.chainId !== chainId) throw new Error(`Must be connected to "${networkName}"`)
}

/**
 * Gets `from` address of provider
 *
 * @param provider Web3 provider
 */
export async function getFrom(provider: BrowserProvider | JsonRpcApiProvider): Promise<string> {
  const signer = await provider.getSigner()

  return signer.getAddress()
}

/**
 * Signs typed data with Metamask
 *
 * @param provider Metamask provider
 * @param params Parameters for signing
 */
export async function signData(provider: BrowserProvider | HDNodeWallet, params: Record<string, any>): Promise<unknown> {
  if (params.length !== 2) {
    throw new Error('signData: Invalid params length')
  }

  if (provider instanceof BrowserProvider) {
    return await provider.send('eth_signTypedData_v4', params)
  } else {
    return provider.signTypedData(TypedData.domain, {ForwardRequest: TypedData.types.ForwardRequest}, JSON.parse(params[1]).message)
  }
}

export async function signDataEthersOnly(provider: JsonRpcApiProvider, params: Array<any> | Record<string, any>): Promise<string> {
  return (await provider.getSigner()).signTypedData(TypedData.domain, TypedData.types, params)
}

/**
 * Sends a POST request to the relay server
 *
 * @param body Request body
 */
export async function postData(body: string): Promise<unknown> {
  const data = await (await fetch(relayUrl!, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body
  })).json()

  if (data.status === 'error') {
    throw new Error(data.message)
  }

  return data
}

/**
 * Gets a data for the specified method
 *
 * @param provider Metamask provider
 * @param methodName Method name
 * @param params Method parameters
 */
export async function getMethodDataToSign(provider: BrowserProvider | HDNodeWallet, methodName: string, params: unknown): Promise<MethodData> {
  let from = ''
  if (provider instanceof BrowserProvider) {
    from = await getFrom(provider)
  } else {
    from = provider.address
  }

  const forwarder = new ethers.Contract(ForwarderAddress!, ForwarderAbi, provider)
  // @ts-ignore
  const nonce = Number(await forwarder.getNonce(from).then(nonce => nonce.toString()))
  // Encode meta-tx request
  const scContractInterface = new Interface(SocialConnectionsAbi)
  const data = scContractInterface.encodeFunctionData(methodName, [params])

  const request = {
    from,
    to: SCAddress!,
    value: 0,
    // todo calculate dynamically
    gas: 1e6 * 2,
    nonce,
    validUntilTime: getFutureTimestamp(),
    data,
  }

  return {
    from,
    request,
    data: JSON.stringify({...TypedData, message: request})
  }
}

/**
 * Gets a signed body for the specified method
 *
 * @param provider Web3 provider
 * @param from Address of the sender
 * @param methodName Method name
 * @param params Method parameters
 */
export async function getSignedBody(provider: BrowserProvider | HDNodeWallet, methodName: string, params: unknown, from = '') {
  const methodData = await getMethodDataToSign(provider, methodName, params)
  const {request, data} = methodData
  const signature = await signData(provider, [from ? from : methodData.from, data])

  return JSON.stringify({...request, signature})
}

/**
 * Follows specified addresses
 *
 * @param provider Web3 provider
 * @param addresses Addresses to follow
 * @param from From address
 * @param onAfterSign Callback after signing
 */
export async function follow(provider: BrowserProvider | HDNodeWallet, addresses: string[], from: string, onAfterSign?: () => void): Promise<any> {
  const data = await getSignedBody(provider, 'follow', addresses, from)
  onAfterSign && onAfterSign()

  return postData(data)
}

/**
 * Gets user info by address
 *
 * @param provider Web3 provider
 * @param address User address
 */
export async function getUser(provider: Provider, address: string): Promise<UserInfo> {
  const scContract = new ethers.Contract(SCAddress!, SocialConnectionsAbi, provider)

  return scContract.getUser(address)
}

