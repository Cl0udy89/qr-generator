'use client'

import { useState, useEffect } from 'react'
import { createQRCode, getQRCodes } from '@/lib/api'
import Link from 'next/link'
import { QrCode, ArrowRight, BarChart3, Plus, Link as LinkIcon, Download, Loader2 } from 'lucide-react'

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

  // Fallback for MVP if the backend isn't mounted with the right host
  const getImageUrl = (path: string) => `http://localhost:8000${path}`

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

      {/* Sidebar: Create Form */}
      <div className="md:col-span-1">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-24">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Plus size={20} />
            </div>
            <h2 className="text-xl font-bold">New QR Code</h2>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Campaign Name</label>
              <input
                type="text"
                required
                value={campaignName}
                onChange={e => setCampaignName(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="e.g. Summer Promo 2024"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-1">
                <LinkIcon size={14} /> Target URL
              </label>
              <input
                type="url"
                required
                value={targetUrl}
                onChange={e => setTargetUrl(e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="https://example.com/promo"
              />
            </div>
            <button
              type="submit"
              disabled={creating}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {creating ? <Loader2 size={18} className="animate-spin" /> : "Generate QR"}
            </button>
          </form>
        </div>
      </div>

      {/* Main Content: List */}
      <div className="md:col-span-2">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <QrCode size={20} className="text-slate-400" />
          Your Campaigns
        </h2>

        {loading ? (
          <div className="flex justify-center py-12 text-slate-400">
            <Loader2 size={32} className="animate-spin" />
          </div>
        ) : qrs.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-100 border-dashed text-center text-slate-500">
            <QrCode size={48} className="mx-auto mb-4 opacity-50 text-slate-400" />
            <p>No QR codes created yet.</p>
            <p className="text-sm mt-1">Create your first campaign to start tracking.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {qrs.map(qr => (
              <div key={qr.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-slate-800 line-clamp-1" title={qr.campaign_name}>
                      {qr.campaign_name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(qr.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="bg-blue-50 text-blue-600 px-2 py-1 flex items-center gap-1 rounded text-xs font-semibold">
                    ID: {qr.id}
                  </div>
                </div>

                <div className="flex gap-4 items-center mb-6 bg-slate-50 p-3 rounded-lg">
                  <div className="w-16 h-16 bg-white p-1 border border-slate-200 rounded shrink-0">
                    <img src={getImageUrl(qr.qr_image_url)} alt="QR" className="w-full h-full object-contain" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
                      <LinkIcon size={12} /> Target
                    </p>
                    <a href={qr.target_url} target="_blank" rel="noreferrer" className="text-sm text-blue-600 truncate block hover:underline" title={qr.target_url}>
                      {qr.target_url}
                    </a>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link href={`/qr/${qr.id}`} className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                    <BarChart3 size={16} /> Analytics
                  </Link>
                  <a href={getImageUrl(qr.qr_image_url)} download={`qr-${qr.id}.png`} target="_blank" className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center">
                    <Download size={16} />
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
