import { ethers } from 'ethers'
import SocialConnectionsAbi from './SocialConnectionsAbi.json'
import ForwarderAbi from './Forwarder.json'

const SCAddress = process.env.REACT_APP_SOCIAL_CONNECTIONS_ADDRESS;
const ForwarderAddress = process.env.REACT_APP_FORWARDER_ADDRESS
const relayUrl = process.env.REACT_APP_RELAY_URL
const chainId = Number(process.env.REACT_APP_CHAIN_ID)
const networkName = process.env.REACT_APP_NETWORK_NAME

if (!SCAddress) {
    throw new Error('REACT_APP_SOCIAL_CONNECTIONS_ADDRESS is not defined');
}

if (!ForwarderAddress) {
    throw new Error('REACT_APP_FORWARDER_ADDRESS is not defined');
}

if (!chainId){
    throw new Error('REACT_APP_NETWORK_ID is not defined');
}

if (!networkName){
    throw new Error('REACT_APP_NETWORK_NAME is not defined');
}

if (!relayUrl) {
    throw new Error('REACT_APP_RELAY_URL is not defined');
}

const EIP712DomainType = [
    { name: 'name', type: 'string' },
    { name: 'version', type: 'string' },
    { name: 'chainId', type: 'uint256' },
    { name: 'verifyingContract', type: 'address' }
]

const ForwardRequestType = [
    { name: 'from', type: 'address' },
    { name: 'to', type: 'address' },
    { name: 'value', type: 'uint256' },
    { name: 'gas', type: 'uint256' },
    { name: 'nonce', type: 'uint256' },
    { name: 'data', type: 'bytes' },
    { name: 'validUntilTime', type: 'uint256' },
]

const TypedData = {
    domain: {
        name: 'Defender',
        version: '1',
        chainId: chainId,
        verifyingContract: ForwarderAddress,
    },
    primaryType: 'ForwardRequest',
    types: {
        EIP712Domain: EIP712DomainType,
        ForwardRequest: ForwardRequestType
    },
    message: {}
};

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

export async function follow(addresses: string[]): Promise<any> {
    // Initialize provider and signer from metamask
    // @ts-ignore
    await window.ethereum.enable();

    // @ts-ignore
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const from = await signer.getAddress();
    const network = await provider.getNetwork();
    if (network.chainId !== chainId) throw new Error(`Must be connected to "${networkName}"`);
    // Get nonce for current signer
    const forwarder = new ethers.Contract(ForwarderAddress!, ForwarderAbi, provider);
    // @ts-ignore
    const nonce = Number(await forwarder.getNonce(from).then(nonce => nonce.toString()));
    // Encode meta-tx request
    const scContractInterface = new ethers.utils.Interface(SocialConnectionsAbi);
    const data = scContractInterface.encodeFunctionData('follow', [addresses]);
    const request = {
        from,
        to: SCAddress,
        value: 0,
        gas: 1e6,
        nonce,
        validUntilTime: getFutureTimestamp(),
        data,
    };

    const toSign = { ...TypedData, message: request };
    // Directly call the JSON RPC interface, since ethers does not support signTypedDataV4 yet
    // See https://github.com/ethers-io/ethers.js/issues/830
    const signature = await provider.send('eth_signTypedData_v4', [from, JSON.stringify(toSign)]);
    const body = JSON.stringify({ ...request, signature })
    return fetch(relayUrl!, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body
    }).then(r => r.json());
}