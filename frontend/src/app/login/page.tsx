'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { QrCode, Lock, ArrowRight } from 'lucide-react'

export default function Login() {
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        if (password === 'Spark2026') {
            document.cookie = "auth_password=Spark2026; path=/; max-age=86400"
            router.push('/')
            router.refresh()
        } else {
            setError('Invalid password')
        }
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center animate-fade-in relative z-10 px-4">
            <div className="glass-panel p-8 sm:p-12 rounded-3xl w-full max-w-md shadow-2xl border border-white/10 dark:border-slate-800 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl"></div>

                <div className="relative text-center mb-10">
                    <div className="mx-auto w-20 h-20 mb-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <QrCode size={40} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 mb-2">QRytics Admin</h1>
                    <p className="text-slate-400 font-medium">Enter your password to access the dashboard</p>
                </div>

                <form onSubmit={handleLogin} className="relative space-y-6">
                    <div className="space-y-2">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Lock size={18} className="text-slate-400" />
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full pl-11 pr-5 py-4 bg-slate-900/50 border ${error ? 'border-red-500/50 focus:ring-red-500/20' : 'border-slate-700/60 focus:ring-blue-500/20 focus:border-blue-500'} rounded-xl outline-none transition-all placeholder:text-slate-500 font-medium text-white`}
                                placeholder="Password"
                                required
                            />
                        </div>
                        {error && <p className="text-red-400 text-sm font-semibold pl-1 animate-pulse">{error}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
                    >
                        Access Dashboard <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>
            </div>
        </div>
    )
}
