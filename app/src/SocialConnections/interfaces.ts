import { BrowserProvider } from 'ethers'

/**
 * Information about the Ethereum provider
 */
export interface ProviderInfo {
    /**
     * The address of the provider
     */
    from: string;
    /**
     * The provider
     */
    provider: BrowserProvider;
}

/**
 * Request data for a transaction
 */
export interface TransactionRequest {
    /**
     * The address from which the transaction is sent
     */
    from: string;
    /**
     * The address to which the transaction is sent
     */
    to: string;
    /**
     * The value being sent with the transaction
     */
    value: number;
    /**
     * The gas limit for the transaction
     */
    gas: number;
    /**
     * The nonce for the transaction
     */
    nonce: number;
    /**
     * The time until which the transaction is valid
     */
    validUntilTime: number;
    /**
     * The data being sent with the transaction
     */
    data: string;
}

/**
 * Data required for signing a method
 */
export interface MethodData {
    /**
     * The `from` field from the provider info
     */
    from: string;
    /**
     * The provider info
     */
    provider: BrowserProvider;
    /**
     * The transaction request data
     */
    request: TransactionRequest;
    /**
     * The stringified version of the transaction data
     */
    data: string;
}