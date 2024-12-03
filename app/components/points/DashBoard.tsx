"use client"
import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { Wallet, Coins, CreditCard, History, ArrowLeft, Copy } from 'lucide-react';
import { useUser } from "@/app/context/user";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, PublicKey } from "@solana/web3.js";
import { AccountLayout } from "@solana/spl-token";
import { toast } from "react-toastify";
import { useTransaction } from "../TransactionContext";



const TOKEN_MINT_ADDRESS = "DvhNHdqpHvUFpxm7LtAWZYMGSV4MPAygJrM5YZ2Aixjg"; 
const RPC_URL = "https://rpc.testnet.soo.network/rpc"; 


const PointsDashboard: React.FC = () => {
  const router = useRouter();
  const userContext = useUser();
  const { publicKey } = useWallet();
  const walletAddress = publicKey?.toBase58() || "Not Connected";
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const { transactionDetails } = useTransaction();

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

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
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
              <button 
               onClick={() => handleCopyText(walletAddress, 'Wallet Address')}
               className="ml-2 hover:text-blue-600">
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

        {transactionDetails && (
          <div className="bg-white shadow-md rounded-lg p-6 mt-6">
            <div className="flex items-center mb-4">
              <History className="mr-3 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-700">Last Transaction</h2>
            </div>
            <div className="space-y-2">
  <div className="flex items-center">
    <span className="font-medium text-gray-600 mr-2">Signature: </span>
    <span className="text-blue-500 truncate flex-grow">{transactionDetails.signature}</span>
    <button 
      onClick={() => handleCopyText(transactionDetails.signature!, 'Signature')}
      className="ml-2 hover:text-blue-600"
    >
      <Copy size={16} />
    </button>
  </div>
  <div className="flex items-center">
    <span className="font-medium text-gray-600 mr-2">To: </span>
    <span className="text-green-500 truncate flex-grow">{transactionDetails.recipientPublicKey}</span>
    <button 
      onClick={() => handleCopyText(transactionDetails.recipientPublicKey!, 'Recipient Address')}
      className="ml-2 hover:text-blue-600"
    >
      <Copy size={16} />
    </button>
  </div>
  <div className="flex items-center">
    <span className="font-medium text-gray-600 mr-2">From: </span>
    <span className="text-green-500 truncate flex-grow">DvhNHdqpHvUFpxm7LtAWZYMGSV4MPAygJrM5YZ2Aixjg</span>
    <button 
      onClick={() => handleCopyText('DvhNHdqpHvUFpxm7LtAWZYMGSV4MPAygJrM5YZ2Aixjg', 'Sender Address')}
      className="ml-2 hover:text-blue-600"
    >
      <Copy size={16} />
    </button>
  </div>
  <div>
    <span className="font-medium text-gray-600">Reward: </span>
    <span className="text-purple-500">10 $DEXUS</span>
  </div>
 </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PointsDashboard;