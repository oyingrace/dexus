"use client"
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { Wallet, Coins, CreditCard, History, ArrowLeft, Copy } from 'lucide-react';
import { useUser } from "@/app/context/user";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import { AccountLayout } from "@solana/spl-token";



const TOKEN_MINT_ADDRESS = "DvhNHdqpHvUFpxm7LtAWZYMGSV4MPAygJrM5YZ2Aixjg"; // Replace with your token mint address
const RPC_URL = "https://rpc.testnet.soo.network/rpc"; // Your Solana RPC endpoint

// Dummy data 
const dummyTransactions = [
  {
    hash: '0xa1b2c3d4e5f6g7h8i9j0',
    type: 'Reward',
    amount: '+10 DEXUS',
    date: '2024-03-15'
  },
  {
    hash: '0xk1l2m3n4o5p6q7r8s9t0',
    type: 'Reward',
    amount: '+10 DEXUS',
    date: '2024-03-10'
  },
  {
    hash: '0xu1v2w3x4y5z6a7b8c9d0',
    type: 'Reward',
    amount: '+10 DEXUS',
    date: '2024-03-05'
  }
];

const PointsDashboard: React.FC = () => {
  const router = useRouter();
  const userContext = useUser();
  const { publicKey } = useWallet();
  const walletAddress = publicKey?.toBase58() || "Not Connected";
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
  const fetchTokenBalance = async () => {
    if (!publicKey) return;
  
    const connection = new Connection(RPC_URL);
    const tokenAccounts = await connection.getTokenAccountsByOwner(publicKey, {
      mint: new PublicKey(TOKEN_MINT_ADDRESS),
    });
  
    if (tokenAccounts.value.length > 0) {
      const accountInfo = tokenAccounts.value[0].account.data;
      const accountData = AccountLayout.decode(accountInfo);
      const balance = Number(accountData.amount) / (10 ** 9);
      setWalletBalance(balance || 0);
    } else {
      setWalletBalance(0); // No tokens in wallet
    }
  };
  fetchTokenBalance();
  }, [publicKey]); // Depend on the `publicKey`

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!publicKey) return;
      
      const connection = new Connection(RPC_URL);
      
      try {
        // Fetch recent transactions for the wallet
        const txs = await connection.getConfirmedSignaturesForAddress2(publicKey, {
          limit: 3, // Number of transactions to fetch
        });
        
        const txDetails = await Promise.all(
          txs.map(async (tx) => {
            const details = await connection.getTransaction(tx.signature);
            return {
              hash: tx.signature,
              type: details?.meta?.err ? 'Failed' : 'Success',
              amount: details?.meta?.preBalances?.[0] && details?.meta?.postBalances?.[0]
                ? details.meta.preBalances[0] - details.meta.postBalances[0]
                : 0, // Safely calculate change in balance, default to 0 if undefined
              date: details?.blockTime ? new Date(details.blockTime * 1000).toLocaleDateString() : 'Date not available', // Fallback date
            };
          })
        );
        
        
        setTransactions(txDetails);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };
    
    fetchTransactions();
  }, [publicKey]); // Run whenever `publicKey` changes


  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    alert("Wallet address copied!");
  };


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <header className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center">
            <button 
              onClick={() => router.push(`/profile/${userContext?.user?.id}`)}
              className="mr-4 hover:bg-gray-100 rounded-full p-2 transition-colors"
            >
              <ArrowLeft className="text-gray-600 hover:text-gray-800" size={24} />
            </button>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <Wallet className="mr-3 text-blue-600" /> 
              Wallet Dashboard
            </h1>
          </div>
        </header>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Wallet Address Card */}
          <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-700">Wallet Address</h2>
              <Wallet className="text-blue-500" />
            </div>
            <div className="bg-gray-100 p-3 rounded-md">
              <p className="text-sm text-gray-600 truncate">{walletAddress}</p>
              <button onClick={handleCopy} className="ml-2 hover:text-blue-600">
                <Copy size={16} />
              </button>
            </div>
          </div>

          {/* Points Card */}
          <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-700">Points</h2>
              <Coins className="text-green-500" />
            </div>
            <div className="text-3xl font-bold text-green-600">{walletBalance !== null ? Math.floor(walletBalance) : "Loading..."}</div>
          </div>

          {/* DEXUS Tokens Card */}
          <div className="bg-white shadow-md rounded-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-700">$DEXUS Tokens</h2>
              <CreditCard className="text-purple-500" />
            </div>
            <div className="text-3xl font-bold text-purple-600"> {walletBalance !== null ? walletBalance.toFixed(2) : "Loading..."}</div>
          </div>
        </div>

        {/* Transactions Section */}
       {/* <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center mb-4">
            <History className="mr-3 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-700">Recent Transactions</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="p-3">Transaction Hash</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Date</th>
                </tr>
              </thead>
              <tbody>
  {transactions.length > 0 ? (
    transactions.map((transaction, index) => (
      <tr key={index} className="border-b hover:bg-gray-50">
        <td className="p-3 text-blue-500 truncate max-w-[200px]">
          {transaction.hash}
        </td>
        <td className="p-3">{transaction.type}</td>
        <td className={`p-3 font-medium ${
          transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          {transaction.amount > 0 ? `+${transaction.amount}` : transaction.amount}
        </td>
        <td className="p-3 text-gray-600">{transaction.date}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={4} className="text-center p-3">No recent transactions</td>
    </tr>
  )}
</tbody>

            </table>
          </div>
</div> */}
      </div>
    </div>
  );
};

export default PointsDashboard;