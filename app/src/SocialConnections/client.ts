import { ethers, Interface, BrowserProvider } from 'ethers'
import SocialConnectionsAbi from './SocialConnectionsAbi.json'
import ForwarderAbi from './Forwarder.json'
import { MethodData, ProviderInfo } from './interfaces'

const SCAddress = process.env.REACT_APP_SOCIAL_CONNECTIONS_ADDRESS
const ForwarderAddress = process.env.REACT_APP_FORWARDER_ADDRESS
const relayUrl = process.env.REACT_APP_RELAY_URL
const networkName = process.env.REACT_APP_NETWORK_NAME

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

const EIP712DomainType = [
    {name: 'name', type: 'string'},
    {name: 'version', type: 'string'},
    {name: 'chainId', type: 'uint256'},
    {name: 'verifyingContract', type: 'address'}
]

const ForwardRequestType = [
    {name: 'from', type: 'address'},
    {name: 'to', type: 'address'},
    {name: 'value', type: 'uint256'},
    {name: 'gas', type: 'uint256'},
    {name: 'nonce', type: 'uint256'},
    {name: 'data', type: 'bytes'},
    {name: 'validUntilTime', type: 'uint256'},
]

const TypedData = {
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
 * Get current Unix timestamp and add specified hours to it
 * @param {number} [hours=24] - The number of hours to add to the current Unix timestamp
 * @returns {number} Unix timestamp for the time after specified hours from now
 */
function getFutureTimestamp(hours = 24): number {
    const now = Date.now()
    const future = now + hours * 60 * 60 * 1000 // Add specified hours in milliseconds
    return Math.floor(future / 1000) // Convert to Unix timestamp (seconds)
}

/**
 * Checks that Metamask is available
 */
export const isMetamaskAvailable = (): boolean => // @ts-ignore
    typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask

/**
 * Gets Metamask instance
 */
export const getMetamaskInstance = () => {
    if (!isMetamaskAvailable()) {
        throw new Error('Please install and unlock Metamask to use this feature.')
    }

    // @ts-ignore
    return window.ethereum
}

/**
 * Gets an active address of Metamask
 */
export const getAddress = async (): Promise<string> => {
    const accounts = await getMetamaskInstance().request({
        method: 'eth_requestAccounts',
    })
    if (accounts && accounts.length) {
        return accounts[0]
    } else {
        throw new Error('Metamask address can not be received')
    }
}

/**
 * Gets Metamask provider info
 */
export async function getProviderInfo(): Promise<ProviderInfo> {
    const instance = await getMetamaskInstance()
    const provider = new BrowserProvider(instance)
    const signer = await provider.getSigner()
    const from = await signer.getAddress()
    const network = await provider.getNetwork()

    // todo switch to required network instead of error
    if (network.chainId !== chainId) throw new Error(`Must be connected to "${networkName}"`)

    return {
        provider,
        from,
    }
}

/**
 * Signs typed data with Metamask
 *
 * @param provider Metamask provider
 * @param params Parameters for signing
 */
export async function signData(provider: ethers.BrowserProvider, params: Array<any> | Record<string, any>): Promise<unknown> {
    return provider.send('eth_signTypedData_v4', params)
}

/**
 * Sends a POST request to the relay server
 *
 * @param body Request body
 */
export async function postData(body: string): Promise<unknown> {
    return (await fetch(relayUrl!, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body
    })).json
}

export async function getMethodDataToSign(methodName: string, params: unknown): Promise<MethodData> {
    const {from, provider} = await getProviderInfo()
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
        gas: 1e6,
        nonce,
        validUntilTime: getFutureTimestamp(),
        data,
    }

    return {
        from,
        provider,
        request,
        data: JSON.stringify({...TypedData, message: request})
    }
}

export async function getSignedBody(methodName: string, params: unknown) {
    const {from, provider, request, data} = await getMethodDataToSign(methodName, params)
    // Directly call the JSON RPC interface, since ethers does not support signTypedDataV4 yet
    // See https://github.com/ethers-io/ethers.js/issues/830
    const signature = await signData(provider, [from, data])
    return JSON.stringify({...request, signature})
}

/**
 * Follows specified addresses
 *
 * @param addresses Addresses to follow
 */
export async function follow(addresses: string[]): Promise<any> {
    return postData(await getSignedBody('follow', addresses))
}