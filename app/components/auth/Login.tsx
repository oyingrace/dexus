import TextInput from "../TextInput";
import { useState } from "react";
import { ShowErrorObject } from "@/app/types";
import { useUser } from "@/app/context/user";
import { useGeneralStore } from "@/app/stores/general";
import { BiLoaderCircle } from "react-icons/bi";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";

export default function Login() {
    let { setIsLoginOpen } = useGeneralStore();

    const contextUser = useUser()

    const wallet = useWallet();

    const [loading, setLoading] = useState<boolean>(false);
    const [email, setEmail] = useState<string | ''>('');
    const [password, setPassword] = useState<string | ''>('');
    const [error, setError] = useState<ShowErrorObject | null>(null)

    const showError = (type: string) => {
        if (error && Object.entries(error).length > 0 && error?.type == type) {
            return error.message
        }
        return ''
    }

    const validate = () => {
        setError(null)
        let isError = false

        if (!email) {
            setError({ type: 'email', message: 'An Email is required'})
            isError = true
        } else if (!password) {
            setError({ type: 'password', message: 'A Password is required'})
            isError = true
        } else if (!wallet.connected) {
            setError({ type: "wallet", message: "Please connect your wallet" });
            isError = true;
        }
        return isError
    }

    const login = async () => {
        let isError = validate()
        if (isError) return
        if (!contextUser) return

        try {
            setLoading(true)
            await contextUser.login(email, password)
            setLoading(false)
            setIsLoginOpen(false)
        } catch (error) {
            console.log(error)
            setLoading(false)
            alert(error)
        }
    }

    return (
        <>
            <div>
                <h1 className="text-center text-[28px] mb-4 font-bold">Log in</h1>

                <div className="px-6 pb-2">
                    <TextInput 
                        string={email}
                        placeholder="Email address"
                        onUpdate={setEmail}
                        inputType="email"
                        error={showError('email')}
                    />
                </div>

                <div className="px-6 pb-2">
                    <TextInput 
                        string={password}
                        placeholder="Password"
                        onUpdate={setPassword}
                        inputType="password"
                        error={showError('password')}
                    />
                </div>

                <div className="px-6 pb-2 mt-4">
               <WalletMultiButton style={{
                 backgroundColor: "#F02C56",
                 borderRadius: "5px",
                 width: "100%",
               }} />
               </div>

                <div className="px-6 pb-2 mt-6">
                    <button 
                        disabled={loading || !wallet.connected}
                        onClick={() => login()} 
                        className={`
                            flex items-center justify-center w-full text-[17px] font-semibold text-white py-3 rounded-sm
                            ${(!email || !password ||  !wallet.connected) ? 'bg-gray-200' : 'bg-[#F02C56]'}
                        `}
                    >
                        {loading ? <BiLoaderCircle className="animate-spin" color="#ffffff" size={25} /> : 'Log in'}
                    </button>
                </div>
            </div>
        </>
    )
}
