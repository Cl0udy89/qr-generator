'use client'

import { useState, useEffect } from 'react'
import { getAnalytics } from '@/lib/api'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, QrCode, Globe, Target, Smartphone, PieChart as PieChartIcon, MousePointerClick, CalendarDays } from 'lucide-react'
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, BarChart, Bar
} from 'recharts'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function AnalyticsDetails() {
    const { id } = useParams()
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!id) return
        getAnalytics(id as string)
            .then(res => setData(res))
            .catch(err => console.error(err))
            .finally(() => setLoading(false))
    }, [id])

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 size={32} className="animate-spin text-blue-600" />
            </div>
        )
    }

    if (!data) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Not Found</h2>
                <p className="text-slate-500 mb-6">Analytics data for this QR code could not be loaded.</p>
                <Link href="/" className="text-blue-600 hover:underline inline-flex items-center gap-2">
                    <ArrowLeft size={16} /> Back to Dashboard
                </Link>
            </div>
        )
    }

    const { qr_code, total_scans, scans_over_time, os_stats, browser_stats, location_stats } = data

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Link href="/" className="text-slate-500 hover:text-slate-800 inline-flex items-center gap-2 font-medium transition-colors">
                    <ArrowLeft size={16} /> Back
                </Link>
                <div className="bg-white px-3 py-1 rounded-full text-xs font-semibold text-slate-500 border border-slate-200">
                    ID: {qr_code.id}
                </div>
            </div>

            {/* Header Info */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-6 items-center md:items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">{qr_code.campaign_name}</h1>
                    <a href={qr_code.target_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1.5 text-sm">
                        <Target size={14} /> {qr_code.target_url}
                    </a>
                </div>

                <div className="flex gap-6 items-center">
                    <div className="text-center bg-blue-50 px-6 py-4 rounded-xl border border-blue-100">
                        <p className="text-sm font-semibold text-blue-600 mb-1 flex items-center justify-center gap-1">
                            <MousePointerClick size={16} /> Total Scans
                        </p>
                        <p className="text-3xl font-black text-blue-800">{total_scans}</p>
                    </div>
                    <div className="w-24 h-24 bg-white p-1 border border-slate-200 rounded flex-shrink-0">
                        <img src={`http://localhost:8000${qr_code.qr_image_url}`} alt="QR Code" className="w-full h-full object-contain" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Scans over time */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <CalendarDays size={18} className="text-slate-400" /> Scans Over Time
                    </h3>
                    <div className="h-72 w-full">
                        {scans_over_time && scans_over_time.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={scans_over_time} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} dot={{ strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-400">No data available yet</div>
                        )}
                    </div>
                </div>

                {/* OS Stats */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Smartphone size={18} className="text-slate-400" /> Operating Systems
                    </h3>
                    <div className="h-64 w-full">
                        {os_stats && os_stats.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={os_stats} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                        {os_stats.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : <div className="h-full flex items-center justify-center text-slate-400">No data available</div>}
                    </div>
                    {/* Custom Legend */}
                    <div className="flex flex-wrap justify-center gap-4 mt-2">
                        {os_stats.slice(0, 4).map((stat: any, i: number) => (
                            <div key={i} className="flex items-center gap-1.5 text-sm">
                                <span className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }}></span>
                                <span className="text-slate-600">{stat.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Browser Stats */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Globe size={18} className="text-slate-400" /> Browsers
                    </h3>
                    <div className="h-64 w-full">
                        {browser_stats && browser_stats.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={browser_stats} cx="50%" cy="50%" innerRadius={0} outerRadius={80} dataKey="value">
                                        {browser_stats.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : <div className="h-full flex items-center justify-center text-slate-400">No data available</div>}
                    </div>
                    {/* Custom Legend */}
                    <div className="flex flex-wrap justify-center gap-4 mt-2">
                        {browser_stats.slice(0, 4).map((stat: any, i: number) => (
                            <div key={i} className="flex items-center gap-1.5 text-sm">
                                <span className="w-3 h-3 rounded-full" style={{ background: COLORS[(i + 2) % COLORS.length] }}></span>
                                <span className="text-slate-600">{stat.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Locations (Bar Chart) */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 lg:col-span-2">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <Globe size={18} className="text-slate-400" /> Top Locations
                    </h3>
                    <div className="h-64 w-full">
                        {location_stats && location_stats.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={location_stats} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} fontSize={12} stroke="#64748b" width={100} />
                                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={24} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : <div className="h-full flex items-center justify-center text-slate-400">No data available</div>}
                    </div>
                </div>

            </div>
        </div>
    )
}
