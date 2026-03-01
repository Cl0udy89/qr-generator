'use client'

import { useState, useEffect } from 'react'
import { createQRCode, getQRCodes } from '@/lib/api'
import Link from 'next/link'
import { QrCode, ArrowRight, BarChart3, Plus, Link as LinkIcon, Download, Loader2, Target } from 'lucide-react'

export default function Dashboard() {
  const [qrs, setQrs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  const [campaignName, setCampaignName] = useState('')
  const [targetUrl, setTargetUrl] = useState('')

  const fetchQRs = async () => {
    try {
      const data = await getQRCodes()
      setQrs(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQRs()
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!campaignName || !targetUrl) return

    setCreating(true)
    try {
      await createQRCode(campaignName, targetUrl)
      setCampaignName('')
      setTargetUrl('')
      await fetchQRs()
    } catch (err) {
      console.error("Failed to create", err)
      alert("Failed to create QR code. Check API.")
    } finally {
      setCreating(false)
    }
  }

  const getImageUrl = (path: string) => {
    if (typeof window !== 'undefined') {
      return `http://${window.location.hostname}:8000${path}`;
    }
    return `http://localhost:8000${path}`;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 animate-slide-up">

      {/* Sidebar: Create Form */}
      <div className="lg:col-span-4">
        <div className="glass-panel p-8 rounded-3xl sticky top-28 transition-all hover:shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl border border-blue-200 dark:border-blue-800/50">
              <Plus size={24} strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white">
              New Campaign
            </h2>
          </div>

          <form onSubmit={handleCreate} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Campaign Name</label>
              <input
                type="text"
                required
                value={campaignName}
                onChange={e => setCampaignName(e.target.value)}
                className="w-full px-5 py-3.5 bg-white/50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 font-medium"
                placeholder="e.g. Summer Promo 2024"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <LinkIcon size={16} className="text-blue-500" /> Target URL
              </label>
              <input
                type="url"
                required
                value={targetUrl}
                onChange={e => setTargetUrl(e.target.value)}
                className="w-full px-5 py-3.5 bg-white/50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 font-medium"
                placeholder="https://example.com/promo"
              />
            </div>
            <button
              type="submit"
              disabled={creating}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:active:scale-100 mt-4 group"
            >
              {creating ? <Loader2 size={20} className="animate-spin" /> : (
                <>
                  Generate Flow <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Main Content: List */}
      <div className="lg:col-span-8 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-extrabold flex items-center gap-3 text-slate-800 dark:text-white">
            <QrCode size={28} className="text-indigo-500" />
            Active Sources
          </h2>
          <span className="px-4 py-1.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold rounded-full text-sm">
            {qrs.length} Total
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="glass-panel p-6 rounded-3xl h-64 animate-pulse flex flex-col justify-between">
                <div className="h-6 w-3/4 bg-slate-200/50 dark:bg-slate-700/50 rounded-lg"></div>
                <div className="flex gap-4 items-center">
                  <div className="w-20 h-20 bg-slate-200/50 dark:bg-slate-700/50 rounded-xl"></div>
                  <div className="h-4 w-1/2 bg-slate-200/50 dark:bg-slate-700/50 rounded-md"></div>
                </div>
                <div className="flex gap-3">
                  <div className="h-10 w-full bg-slate-200/50 dark:bg-slate-700/50 rounded-xl"></div>
                </div>
              </div>
            ))}
          </div>
        ) : qrs.length === 0 ? (
          <div className="glass-panel p-16 rounded-3xl text-center flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-24 h-24 bg-blue-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <QrCode size={48} className="text-blue-500 opacity-50" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">No flows created yet</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">Generate your first QR code campaign using the panel to start gathering deep analytics instantly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {qrs.map((qr, i) => (
              <div key={qr.id} className="glass-panel p-6 rounded-3xl group hover:-translate-y-1 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500/30 flex flex-col" style={{ animationDelay: `${i * 100}ms` }}>

                <div className="flex justify-between items-start mb-6">
                  <div className="pr-4">
                    <h3 className="font-extrabold text-xl text-slate-800 dark:text-white line-clamp-1 mb-1" title={qr.campaign_name}>
                      {qr.campaign_name}
                    </h3>
                    <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      {new Date(qr.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2.5 py-1 flex items-center gap-1 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700">
                    #{qr.id}
                  </div>
                </div>

                <div className="flex gap-5 items-center mb-8 flex-1">
                  <div className="w-20 h-20 bg-white p-1.5 border-2 border-slate-100 dark:border-slate-700 rounded-2xl shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-500">
                    <img src={getImageUrl(qr.qr_image_url)} alt="QR" className="w-full h-full object-contain mix-blend-multiply" />
                  </div>
                  <div className="overflow-hidden space-y-1.5">
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                      <Target size={12} /> Target URL
                    </p>
                    <a href={qr.target_url} target="_blank" rel="noreferrer" className="text-sm font-semibold text-blue-600 dark:text-blue-400 truncate block hover:text-blue-700 hover:underline decoration-blue-500/30 underline-offset-4 transition-colors" title={qr.target_url}>
                      {qr.target_url}
                    </a>
                  </div>
                </div>

                <div className="flex gap-3 mt-auto">
                  <Link href={`/qr/${qr.id}`} className="flex-1 bg-slate-900 dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 text-white py-3 rounded-xl text-sm font-bold transition-transform active:scale-95 flex items-center justify-center gap-2 shadow-md">
                    <BarChart3 size={18} /> Analytics Space
                  </Link>
                  <a href={getImageUrl(qr.qr_image_url)} download={`qr-${qr.id}.png`} target="_blank" className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 py-3 px-4 rounded-xl text-sm font-bold transition-all active:scale-95 flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md group/dl">
                    <Download size={18} className="group-hover/dl:translate-y-0.5 transition-transform" />
                  </a>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
