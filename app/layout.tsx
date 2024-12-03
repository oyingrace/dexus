"use client"

import UserProvider from './context/user'
import AllOverlays from "@/app/components/AllOverlays"
import './globals.css'
import { metadata } from './metadata'
import AppWalletProvider from './components/AppWalletProvider'
import { ToastContainer, toast, TypeOptions, ToastPosition } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TransactionProvider } from './components/TransactionContext'


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
     <AppWalletProvider>
      
      <UserProvider>
        <body>
          <TransactionProvider>
          <AllOverlays />
          {children}
          <ToastContainer
              toastClassName={(context) => {
                // Handle type safely and apply className based on type
                const type = context?.type;
                return `toast-message ${
                  type === 'success'
                    ? 'toast-success'
                    : type === 'error'
                    ? 'toast-error'
                    : type === 'info'
                    ? 'toast-info'
                    : '' // fallback if type is undefined
                }`;
              }}
              bodyClassName="flex justify-between items-center"
              closeButton={({ closeToast }) => (
                <button onClick={closeToast} className="toast-close">
                  ✖
                </button>
              )}
              position="top-right"
              autoClose={2000}
            />
            </TransactionProvider>
        </body>

      </UserProvider>
      </AppWalletProvider>
    </html>
  )
}