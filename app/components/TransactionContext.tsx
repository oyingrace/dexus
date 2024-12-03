
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface TransactionDetails {
  signature?: string;
  recipientPublicKey?: string;
  amount?: number;
}

interface TransactionContextType {
  transactionDetails: TransactionDetails | null;
  updateTransactionDetails: (details: TransactionDetails) => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactionDetails, setTransactionDetails] = useState<TransactionDetails | null>(null);

  const updateTransactionDetails = (details: TransactionDetails) => {
    setTransactionDetails(details);
  };

  return (
    <TransactionContext.Provider value={{ transactionDetails, updateTransactionDetails }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransaction = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransaction must be used within a TransactionProvider');
  }
  return context;
};