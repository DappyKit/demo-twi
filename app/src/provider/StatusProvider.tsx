import React, { createContext, useState, useContext, ReactNode } from 'react';

export enum ProviderStatus {
    NotFollowing = 'not_following',
    Followed = 'followed',
}

interface StatusContextProps {
    status: string;
    setStatus: React.Dispatch<React.SetStateAction<string>>;
    address: string;
    setAddress: React.Dispatch<React.SetStateAction<string>>;
}

const StatusContext = createContext<StatusContextProps | undefined>(undefined);

interface StatusProviderProps {
    children: ReactNode;
}

export const StatusProvider: React.FC<StatusProviderProps> = ({ children }) => {
    const [status, setStatus] = useState<string>(ProviderStatus.NotFollowing);
    const [address, setAddress] = useState<string>(ProviderStatus.NotFollowing);

    return (
        <StatusContext.Provider value={{ status, setStatus, address, setAddress }}>
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
