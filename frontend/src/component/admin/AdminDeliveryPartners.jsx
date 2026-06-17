import { useEffect, useState, useMemo } from 'react'
import { Truck, Phone, Envelope, MagnifyingGlass, UserCircle, LockSimple, LockSimpleOpen, X, Wallet, Package, CheckCircle, Clock } from '@phosphor-icons/react'
import { API_PATHS, buildApiUrl } from '../../config/apiEndpoints'

function PartnerDetailModal({ partner, token, onClose }) {
  const [details, setDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const pid = partner.id || partner._id
    fetch(buildApiUrl(API_PATHS.delivery.partnerDetails.replace(':id', pid)), {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.partner) setDetails(d)
        else setError(d.message || 'Failed to load details')
      })
      .catch(() => setError('Failed to load partner details'))
      .finally(() => setLoading(false))
  }, [partner, token])

  const statusColor = (s) => {
    const map = {
      delivered: 'bg-emerald-100 text-emerald-700',
      confirmed: 'bg-blue-100 text-blue-700',
      processing: 'bg-amber-100 text-amber-700',
      shipped: 'bg-indigo-100 text-indigo-700',
      out_for_delivery: 'bg-purple-100 text-purple-700',
      cancelled: 'bg-red-100 text-red-700',
      failed_delivery: 'bg-red-100 text-red-700',
      pending: 'bg-gray-100 text-gray-600',
    }
    return map[s] || 'bg-gray-100 text-gray-600'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative mt-8 w-full max-w-3xl rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
              <UserCircle size={24} weight="fill" className="text-amber-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{partner.username}</p>
              <p className="text-xs text-gray-500">{partner.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
            <X size={18} weight="bold" />
          </button>
        </div>

        {loading && (
          <div className="flex h-64 items-center justify-center">
            <span className="h-7 w-7 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
          </div>
        )}
        {error && !loading && (
          <div className="p-6 text-center text-sm text-red-600">{error}</div>
        )}

        {details && !loading && (
          <>
            {/* Stats cards */}
            <div className="grid grid-cols-2 gap-4 p-6 sm:grid-cols-4">
              {[
                { label: 'Wallet Balance', value: `₹${(details.stats.walletBalance || 0).toFixed(2)}`, color: 'text-amber-700', bg: 'bg-amber-50', icon: <Wallet size={18} className="text-amber-500" /> },
                { label: 'Total Earnings', value: `₹${(details.stats.totalEarnings || 0).toFixed(2)}`, color: 'text-emerald-700', bg: 'bg-emerald-50', icon: <CheckCircle size={18} className="text-emerald-500" /> },
                { label: 'Delivered', value: details.stats.deliveredOrders, color: 'text-emerald-700', bg: 'bg-emerald-50', icon: <Package size={18} className="text-emerald-500" /> },
                { label: 'Active Orders', value: details.stats.activeOrders, color: 'text-blue-700', bg: 'bg-blue-50', icon: <Clock size={18} className="text-blue-500" /> },
              ].map((s) => (
                <div key={s.label} className={`rounded-xl border border-gray-100 ${s.bg} p-4`}>
                  <div className="flex items-center gap-2">{s.icon}<p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{s.label}</p></div>
                  <p className={`mt-2 text-xl font-bold ${s.color}`}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100 px-6">
              {[['overview', 'Overview'], ['deliveries', 'All Deliveries'], ['wallet', 'Wallet History']].map(([tab, label]) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`mr-4 border-b-2 pb-3 text-sm font-medium transition-colors ${activeTab === tab ? 'border-amber-500 text-amber-700' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="max-h-80 overflow-y-auto p-6">
              {activeTab === 'overview' && (
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Phone</p>
                      <p className="mt-1 font-medium text-gray-800">{details.partner.phone || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Vehicle Number</p>
                      <p className="mt-1 font-medium text-gray-800">{details.partner.vehicleNumber || '—'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Status</p>
                      <p className="mt-1 font-medium text-gray-800 capitalize">{details.partner.deliveryStatus || 'offline'}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Account Status</p>
                      <p className={`mt-1 font-medium ${details.partner.isBlocked ? 'text-red-600' : 'text-emerald-600'}`}>
                        {details.partner.isBlocked ? 'Suspended' : 'Active'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Total Orders Assigned</p>
                      <p className="mt-1 font-medium text-gray-800">{details.stats.totalOrders}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Member Since</p>
                      <p className="mt-1 font-medium text-gray-800">
                        {new Date(details.partner.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'deliveries' && (
                <div>
                  {details.recentOrders.length === 0 ? (
                    <p className="text-center text-sm text-gray-400">No orders assigned yet.</p>
                  ) : (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                          <th className="pb-3">Order</th>
                          <th className="pb-3">Customer</th>
                          <th className="pb-3">Earnings</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {details.recentOrders.map((o) => (
                          <tr key={o._id} className="text-sm">
                            <td className="py-2.5 font-medium text-gray-800">{o.orderNumber}</td>
                            <td className="py-2.5 text-gray-600">{o.deliveryAddress?.fullName || '—'}</td>
                            <td className="py-2.5 font-semibold text-emerald-700">
                              {o.deliveryEarnings != null ? `₹${Number(o.deliveryEarnings).toFixed(2)}` : '—'}
                            </td>
                            <td className="py-2.5">
                              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${statusColor(o.orderStatus)}`}>
                                {o.orderStatus.replace(/_/g, ' ')}
                              </span>
                            </td>
                            <td className="py-2.5 text-gray-500">
                              {new Date(o.updatedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {activeTab === 'wallet' && (
                <div>
                  <div className="mb-4 flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                    <p className="text-sm font-semibold text-amber-800">Current Wallet Balance</p>
                    <p className="text-xl font-bold text-amber-700">₹{(details.stats.walletBalance || 0).toFixed(2)}</p>
                  </div>
                  {details.stats.walletTransactions.length === 0 ? (
                    <p className="text-center text-sm text-gray-400">No transactions yet.</p>
                  ) : (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                          <th className="pb-3">Type</th>
                          <th className="pb-3">Description</th>
                          <th className="pb-3">Amount</th>
                          <th className="pb-3">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {details.stats.walletTransactions.map((t, i) => (
                          <tr key={i}>
                            <td className="py-2.5">
                              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${t.type === 'credit' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                {t.type}
                              </span>
                            </td>
                            <td className="py-2.5 text-gray-600">{t.description}</td>
                            <td className={`py-2.5 font-semibold ${t.type === 'credit' ? 'text-emerald-700' : 'text-red-600'}`}>
                              {t.type === 'credit' ? '+' : '-'}₹{Number(t.amount).toFixed(2)}
                            </td>
                            <td className="py-2.5 text-gray-500">
                              {new Date(t.createdAt || t.date || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

function AdminDeliveryPartners() {
  const [partners, setPartners] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [actionLoading, setActionLoading] = useState('')
  const [selectedPartner, setSelectedPartner] = useState(null)

  const token = localStorage.getItem('authToken')

  const fetchAll = async () => {
    try {
      const [partnersRes, ordersRes] = await Promise.all([
        fetch(buildApiUrl(`${API_PATHS.auth.users}?role=delivery`), { headers: { Authorization: `Bearer ${token}` } }),
        fetch(buildApiUrl(API_PATHS.orders.all), { headers: { Authorization: `Bearer ${token}` } }),
      ])
      const [partnersData, ordersData] = await Promise.all([partnersRes.json(), ordersRes.json()])
      if (partnersRes.ok) setPartners(partnersData.users || [])
      else setError(partnersData.message || 'Failed to load partners')
      if (ordersRes.ok) setOrders(ordersData.orders || [])
    } catch (_) {
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const orderCountMap = useMemo(() => {
    const map = {}
    orders.forEach((o) => {
      if (o.assignedDeliveryPartner) {
        const pid = o.assignedDeliveryPartner._id || o.assignedDeliveryPartner
        map[pid] = (map[pid] || 0) + 1
      }
    })
    return map
  }, [orders])

  const activeOrderCountMap = useMemo(() => {
    const map = {}
    const active = new Set(['confirmed', 'processing', 'shipped'])
    orders.forEach((o) => {
      if (o.assignedDeliveryPartner && active.has(o.orderStatus)) {
        const pid = o.assignedDeliveryPartner._id || o.assignedDeliveryPartner
        map[pid] = (map[pid] || 0) + 1
      }
    })
    return map
  }, [orders])

  const deliveredCountMap = useMemo(() => {
    const map = {}
    orders.forEach((o) => {
      if (o.assignedDeliveryPartner && o.orderStatus === 'delivered') {
        const pid = o.assignedDeliveryPartner._id || o.assignedDeliveryPartner
        map[pid] = (map[pid] || 0) + 1
      }
    })
    return map
  }, [orders])

  const earningsMap = useMemo(() => {
    const map = {}
    orders.forEach((o) => {
      if (o.assignedDeliveryPartner && o.orderStatus === 'delivered' && o.deliveryEarnings) {
        const pid = o.assignedDeliveryPartner._id || o.assignedDeliveryPartner
        map[pid] = (map[pid] || 0) + o.deliveryEarnings
      }
    })
    return map
  }, [orders])

  const filtered = useMemo(() => {
    if (!search.trim()) return partners
    const q = search.trim().toLowerCase()
    return partners.filter(
      (p) => p.username?.toLowerCase().includes(q) || p.email?.toLowerCase().includes(q) || p.phone?.includes(q) || p.vehicleNumber?.toLowerCase().includes(q),
    )
  }, [partners, search])

  const handleToggleBlock = async (partner) => {
    const action = partner.isBlocked ? 'Approve / Unblock' : 'Suspend / Block'
    if (!confirm(`${action} "${partner.username}"?`)) return
    setActionLoading(partner.id)
    try {
      const res = await fetch(buildApiUrl(API_PATHS.auth.toggleBlock.replace(':id', partner.id)), {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (res.ok) {
        setPartners((prev) => prev.map((p) => (p.id === partner.id ? { ...p, isBlocked: data.user.isBlocked } : p)))
      }
    } catch (_) {}
    setActionLoading('')
  }

  const totalActive = orders.filter((o) => o.assignedDeliveryPartner && ['confirmed', 'processing', 'shipped'].includes(o.orderStatus)).length
  const totalDelivered = orders.filter((o) => o.orderStatus === 'delivered').length
  const suspended = partners.filter((p) => p.isBlocked).length

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <span className="inline-block h-7 w-7 animate-spin rounded-full border-2 border-gray-900 border-t-transparent" />
      </div>
    )
  }

  return (
    <section className="space-y-5">
      {selectedPartner && (
        <PartnerDetailModal partner={selectedPartner} token={token} onClose={() => setSelectedPartner(null)} />
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Fleet Management</p>
          <h2 className="mt-0.5 text-xl font-semibold text-gray-900">Delivery Partners</h2>
          <p className="mt-0.5 text-sm text-gray-500">{partners.length} registered partner{partners.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="relative w-full sm:w-64">
          <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search name, phone, vehicle…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
          />
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: 'Total Partners', value: partners.length, color: 'text-gray-900' },
          { label: 'Active Deliveries', value: totalActive, color: 'text-amber-600' },
          { label: 'Completed', value: totalDelivered, color: 'text-emerald-600' },
          { label: 'Suspended', value: suspended, color: 'text-red-600' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{s.label}</p>
            <p className={`mt-2 text-3xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white py-16 text-center shadow-sm">
          <Truck size={36} weight="thin" className="mx-auto text-gray-300" />
          <p className="mt-3 text-sm font-medium text-gray-500">
            {partners.length === 0 ? 'No delivery partners registered yet' : 'No partners match your search'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((partner) => {
            const pid = partner.id
            const total = orderCountMap[pid] || 0
            const active = activeOrderCountMap[pid] || 0
            const delivered = deliveredCountMap[pid] || 0
            const earnings = earningsMap[pid] || 0
            const isLoading = actionLoading === pid

            return (
              <article key={pid} className={`rounded-xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md ${partner.isBlocked ? 'border-red-200 opacity-80' : 'border-gray-200'}`}>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100">
                    <UserCircle size={24} weight="fill" className="text-gray-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-gray-900">{partner.username}</p>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="inline-flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[11px] font-medium text-amber-700">
                        <Truck size={10} weight="bold" /> Delivery
                      </span>
                      {partner.isBlocked && (
                        <span className="inline-flex items-center rounded-md border border-red-200 bg-red-50 px-1.5 py-0.5 text-[11px] font-medium text-red-700">
                          Suspended
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-1.5 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Envelope size={13} className="shrink-0 text-gray-400" />
                    <span className="truncate">{partner.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={13} className="shrink-0 text-gray-400" />
                    <span>{partner.phone || '—'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck size={13} className="shrink-0 text-gray-400" />
                    <span className="font-medium text-gray-800">{partner.vehicleNumber || 'No vehicle number'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wallet size={13} className="shrink-0 text-amber-500" />
                    <span className="font-semibold text-amber-700">₹{earnings.toFixed(2)} earned</span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 border-t border-gray-100 pt-4">
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">{total}</p>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Total</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-amber-600">{active}</p>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Active</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-emerald-600">{delivered}</p>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">Done</p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2 border-t border-gray-100 pt-4">
                  <button
                    type="button"
                    onClick={() => setSelectedPartner(partner)}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleBlock(partner)}
                    disabled={isLoading}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition-colors disabled:opacity-50 ${
                      partner.isBlocked
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        : 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
                    }`}
                  >
                    {isLoading ? (
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : partner.isBlocked ? (
                      <LockSimpleOpen size={13} weight="bold" />
                    ) : (
                      <LockSimple size={13} weight="bold" />
                    )}
                    {partner.isBlocked ? 'Unblock' : 'Block'}
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default AdminDeliveryPartners
