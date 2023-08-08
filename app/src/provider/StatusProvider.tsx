import React, { createContext, useState, useContext, ReactNode } from 'react';
import { BrowserProvider, HDNodeWallet, JsonRpcApiProvider, Provider, Wallet } from 'ethers'

export enum ProviderStatus {
    NotFollowing = 'not_following',
    Followed = 'followed',
}

interface StatusContextProps {
    status: string;
    setStatus: React.Dispatch<React.SetStateAction<string>>;
    address: string;
    setAddress: React.Dispatch<React.SetStateAction<string>>;
    wallet: Wallet | HDNodeWallet | undefined;
    setWallet: React.Dispatch<React.SetStateAction<Wallet | HDNodeWallet | undefined>>;
    web3Provider: BrowserProvider  | undefined;
    setWeb3Provider: React.Dispatch<React.SetStateAction<BrowserProvider | undefined>>;
}

const StatusContext = createContext<StatusContextProps | undefined>(undefined);

interface StatusProviderProps {
    children: ReactNode;
}

export const StatusProvider: React.FC<StatusProviderProps> = ({ children }) => {
    const [status, setStatus] = useState<string>(ProviderStatus.NotFollowing);
    const [address, setAddress] = useState<string>('');
    const [wallet, setWallet] = useState<Wallet | HDNodeWallet | undefined>();
    const [web3Provider, setWeb3Provider] = useState<BrowserProvider | undefined>();

    return (
        <StatusContext.Provider value={{ status, setStatus, address, setAddress, wallet, setWallet, web3Provider, setWeb3Provider }}>
            {children}
        </StatusContext.Provider>
    );
}

export const useStatus = (): StatusContextProps => {
    const context = useContext(StatusContext);
    if (!context) {
        throw new Error('useStatus must be used within a StatusProvider');
    }
    return context;
}
