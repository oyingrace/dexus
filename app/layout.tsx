import UserProvider from './context/user'
import AllOverlays from "@/app/components/AllOverlays"
import './globals.css'
import type { Metadata } from 'next'
import AppWalletProvider from './components/AppWalletProvider'

export const metadata: Metadata = {
  title: 'Dexus',
  description: 'Dexus',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
     <AppWalletProvider>
      
      <UserProvider>
        <body>
          <AllOverlays />
          {children}
        </body>

      </UserProvider>
      </AppWalletProvider>
    </html>
  )
}