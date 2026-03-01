'use client'

import { useState, useEffect } from 'react'
import { getAnalytics, getAnalyticsLogs } from '@/lib/api'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, QrCode, Globe, Target, Smartphone, PieChart as PieChartIcon, MousePointerClick, CalendarDays, BarChart3, Clock, MapPin, Monitor } from 'lucide-react'
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, BarChart, Bar
} from 'recharts'

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const timeframes = [
    { label: 'Today', value: 'today' },
    { label: 'This Week', value: 'week' },
    { label: 'This Month', value: 'month' },
    { label: 'Last 6 Months', value: '6months' },
    { label: 'This Year', value: 'year' },
    { label: 'All Time', value: 'all' },
]

export default function AnalyticsDetails() {
    const { id } = useParams()
    const [data, setData] = useState<any>(null)
    const [logs, setLogs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [timeframe, setTimeframe] = useState('all')

    const fetchData = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const [analyticsRes, logsRes] = await Promise.all([
                getAnalytics(id as string, timeframe),
                getAnalyticsLogs(id as string)
            ]);
            setData(analyticsRes);
            setLogs(logsRes);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, [id, timeframe])

    if (loading && !data) {
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 size={32} className="animate-spin text-blue-600" />
            </div>
        )
    }

    if (!data) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Not Found</h2>
                <p className="text-slate-500 mb-6">Analytics data for this QR code could not be loaded.</p>
                <Link href="/" className="text-blue-600 hover:underline inline-flex items-center gap-2">
                    <ArrowLeft size={16} /> Back to Dashboard
                </Link>
            </div>
        )
    }

    const { qr_code, total_scans, scans_over_time, os_stats, browser_stats, location_stats } = data

    return (
        <div className="space-y-8 animate-slide-up">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <Link href="/" className="text-slate-500 hover:text-blue-600 inline-flex items-center gap-2 font-bold transition-colors bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm px-4 py-2 rounded-xl border border-slate-200/50 dark:border-slate-700 shadow-sm hover:shadow">
                    <ArrowLeft size={18} /> Back to Dashboard
                </Link>
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700 shadow-sm flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        ID: {qr_code.id}
                    </div>
                    <select
                        value={timeframe}
                        onChange={(e) => setTimeframe(e.target.value)}
                        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-sm font-bold rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500/50 ml-auto sm:ml-0"
                    >
                        {timeframes.map((tf) => (
                            <option key={tf.value} value={tf.value}>{tf.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Header Info */}
            <div className="glass-panel p-8 rounded-3xl flex flex-col md:flex-row gap-8 items-center md:items-start justify-between relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                {loading && (
                    <div className="absolute top-4 right-4 z-20">
                        <Loader2 size={24} className="animate-spin text-blue-500" />
                    </div>
                )}

                <div className="relative z-10 w-full md:w-auto">
                    <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 mb-3">{qr_code.campaign_name}</h1>
                    <a href={qr_code.target_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors">
                        <Target size={16} /> {qr_code.target_url}
                    </a>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 items-center relative z-10 w-full md:w-auto">
                    <div className="text-center bg-gradient-to-br from-blue-600 to-indigo-600 px-8 py-5 rounded-2xl shadow-lg shadow-blue-500/20 text-white w-full sm:w-auto transform group-hover:-translate-y-1 transition-transform duration-500">
                        <p className="text-sm font-medium text-blue-100 mb-1 flex items-center justify-center gap-1.5 opacity-90">
                            <MousePointerClick size={16} /> Filtered Scans
                        </p>
                        <p className="text-5xl font-black tracking-tight">{total_scans}</p>
                    </div>
                    <div className="w-28 h-28 bg-white p-2 border-2 border-white/50 rounded-2xl shadow-xl shrink-0 group-hover:scale-105 transition-transform duration-500">
                        <img src={qr_code.qr_image_url} alt="QR Code" className="w-full h-full object-contain mix-blend-multiply" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Scans over time */}
                <div className="glass-panel p-8 rounded-3xl lg:col-span-2 group hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-extrabold flex items-center gap-3 text-slate-800 dark:text-white">
                            <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl">
                                <CalendarDays size={20} />
                            </div>
                            Scans Over Time
                        </h3>
                    </div>

                    <div className="h-80 w-full">
                        {scans_over_time && scans_over_time.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={scans_over_time} margin={{ top: 10, right: 10, bottom: 10, left: -20 }}>
                                    <defs>
                                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
                                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dx={-10} allowDecimals={false} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)' }}
                                    />
                                    <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={4} dot={{ strokeWidth: 3, r: 5, fill: '#fff', stroke: '#3b82f6' }} activeDot={{ r: 8, strokeWidth: 0, fill: '#2563eb' }} />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 dark:bg-slate-800/20 rounded-2xl border border-dashed border-slate-200">
                                <BarChart3 size={32} className="mb-2 opacity-50" />
                                <p className="font-medium">No temporal data available yet</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* OS Stats */}
                <div className="glass-panel p-8 rounded-3xl group hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500">
                    <h3 className="text-xl font-extrabold mb-8 flex items-center gap-3 text-slate-800 dark:text-white">
                        <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-xl">
                            <Smartphone size={20} />
                        </div>
                        Operating Systems
                    </h3>
                    <div className="h-64 w-full relative">
                        {os_stats && os_stats.length > 0 ? (
                            <>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={os_stats} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={os_stats.length > 1 ? 4 : 0} dataKey="value" stroke="none">
                                            {os_stats.map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </>
                        ) : <div className="h-full flex items-center justify-center text-slate-400 bg-slate-50/50 dark:bg-slate-800/20 rounded-2xl border border-dashed border-slate-200">No data available</div>}
                    </div>
                    {/* Custom Legend */}
                    <div className="flex flex-wrap justify-center gap-4 mt-6">
                        {os_stats?.slice(0, 4).map((stat: any, i: number) => (
                            <div key={i} className="flex items-center gap-2 text-sm bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700">
                                <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ background: COLORS[i % COLORS.length] }}></span>
                                <span className="text-slate-700 font-semibold">{stat.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Browser Stats */}
                <div className="glass-panel p-8 rounded-3xl group hover:shadow-2xl hover:shadow-cyan-500/5 transition-all duration-500">
                    <h3 className="text-xl font-extrabold mb-8 flex items-center gap-3 text-slate-800 dark:text-white">
                        <div className="p-2 bg-cyan-500/10 text-cyan-500 rounded-xl">
                            <Globe size={20} />
                        </div>
                        Browsers
                    </h3>
                    <div className="h-64 w-full">
                        {browser_stats && browser_stats.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={browser_stats} cx="50%" cy="50%" innerRadius={40} outerRadius={90} paddingAngle={browser_stats.length > 1 ? 4 : 0} dataKey="value" stroke="none">
                                        {browser_stats.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : <div className="h-full flex items-center justify-center text-slate-400 bg-slate-50/50 dark:bg-slate-800/20 rounded-2xl border border-dashed border-slate-200">No data available</div>}
                    </div>
                    {/* Custom Legend */}
                    <div className="flex flex-wrap justify-center gap-4 mt-6">
                        {browser_stats?.slice(0, 4).map((stat: any, i: number) => (
                            <div key={i} className="flex items-center gap-2 text-sm bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700">
                                <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ background: COLORS[(i + 2) % COLORS.length] }}></span>
                                <span className="text-slate-700 font-semibold">{stat.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Locations (Bar Chart) */}
                <div className="glass-panel p-8 rounded-3xl lg:col-span-2 group hover:shadow-2xl hover:shadow-fuchsia-500/5 transition-all duration-500">
                    <h3 className="text-xl font-extrabold mb-8 flex items-center gap-3 text-slate-800 dark:text-white">
                        <div className="p-2 bg-fuchsia-500/10 text-fuchsia-500 rounded-xl">
                            <MapPin size={20} />
                        </div>
                        Top Locations
                    </h3>
                    <div className="h-80 w-full">
                        {location_stats && location_stats.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={location_stats} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" strokeOpacity={0.5} />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} fontSize={13} fontWeight={600} stroke="#475569" width={120} />
                                    <Tooltip cursor={{ fill: 'rgba(241, 245, 249, 0.4)' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                                    <Bar dataKey="value" fill="#8b5cf6" radius={[0, 8, 8, 0]} barSize={32}>
                                        {
                                            location_stats.map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))
                                        }
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        ) : <div className="h-full flex items-center justify-center text-slate-400 bg-slate-50/50 dark:bg-slate-800/20 rounded-2xl border border-dashed border-slate-200">No data available</div>}
                    </div>
                </div>

                {/* Raw Logs Data Table */}
                <div className="glass-panel p-8 rounded-3xl lg:col-span-2 group hover:shadow-2xl hover:shadow-slate-500/5 transition-all duration-500 overflow-hidden">
                    <h3 className="text-xl font-extrabold mb-8 flex items-center gap-3 text-slate-800 dark:text-white">
                        <div className="p-2 bg-slate-500/10 text-slate-500 dark:text-slate-300 rounded-xl">
                            <Monitor size={20} />
                        </div>
                        Raw Access Logs
                    </h3>

                    <div className="w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                        {logs && logs.length > 0 ? (
                            <table className="w-full text-left border-collapse text-sm whitespace-nowrap">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400">
                                        <th className="px-6 py-4 font-bold">Time</th>
                                        <th className="px-6 py-4 font-bold">IP Address</th>
                                        <th className="px-6 py-4 font-bold">OS</th>
                                        <th className="px-6 py-4 font-bold">Browser</th>
                                        <th className="px-6 py-4 font-bold">Device</th>
                                        <th className="px-6 py-4 font-bold">Location</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map((log) => (
                                        <tr key={log.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors text-slate-700 dark:text-slate-300 font-medium">
                                            <td className="px-6 py-4 flex items-center gap-2">
                                                <Clock size={14} className="text-slate-400" />
                                                {new Date(log.scanned_at).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 font-mono text-xs">{log.ip_address}</td>
                                            <td className="px-6 py-4">{log.os}</td>
                                            <td className="px-6 py-4">{log.browser}</td>
                                            <td className="px-6 py-4">{log.device_type}</td>
                                            <td className="px-6 py-4">{log.city !== "Unknown" ? `${log.country} - ${log.city}` : "Unknown"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="h-40 flex items-center justify-center text-slate-400 bg-slate-50/50 dark:bg-slate-800/20">
                                No access logs generated yet
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}
