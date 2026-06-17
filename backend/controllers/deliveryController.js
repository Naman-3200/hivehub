const Order = require('../models/Order')
const User = require('../models/User')
const asyncHandler = require('../utils/asyncHandler')

const sumEarnings = (orders) => orders.reduce((sum, o) => sum + (o.deliveryEarnings || 0), 0)

const getDeliveryAnalytics = asyncHandler(async (req, res) => {
  const deliveryPartnerId = req.user._id

  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - 6)
  startOfWeek.setHours(0, 0, 0, 0)
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const allOrders = await Order.find({ assignedDeliveryPartner: deliveryPartnerId })
    .sort({ updatedAt: -1 })
    .lean()

  const deliveredOrders = allOrders.filter((o) => o.orderStatus === 'delivered')
  const todayDelivered = deliveredOrders.filter((o) => new Date(o.updatedAt) >= startOfToday)
  const weekDelivered = deliveredOrders.filter((o) => new Date(o.updatedAt) >= startOfWeek)
  const monthDelivered = deliveredOrders.filter((o) => new Date(o.updatedAt) >= startOfMonth)
  const activeOrders = allOrders.filter((o) => ['confirmed', 'processing', 'shipped'].includes(o.orderStatus))
  const failedOrders = allOrders.filter((o) => o.orderStatus === 'failed_delivery')

  // Last 7 days bar chart data
  const weeklyStats = []
  for (let i = 6; i >= 0; i--) {
    const day = new Date(now)
    day.setDate(now.getDate() - i)
    day.setHours(0, 0, 0, 0)
    const dayEnd = new Date(day)
    dayEnd.setDate(day.getDate() + 1)
    const dayOrders = deliveredOrders.filter((o) => {
      const d = new Date(o.updatedAt)
      return d >= day && d < dayEnd
    })
    weeklyStats.push({
      day: day.toLocaleDateString('en-IN', { weekday: 'short' }),
      date: day.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      count: dayOrders.length,
      earnings: sumEarnings(dayOrders),
    })
  }

  // Recent payouts (last 10 delivered orders as earning entries)
  const recentEarnings = deliveredOrders.slice(0, 10).map((o) => ({
    orderId: o._id,
    orderNumber: o.orderNumber,
    amount: o.deliveryEarnings || 0,
    date: o.updatedAt,
    customerName: o.deliveryAddress?.fullName || '',
  }))

  res.json({
    analytics: {
      totalAssigned: allOrders.length,
      totalDelivered: deliveredOrders.length,
      totalFailed: failedOrders.length,
      activeOrders: activeOrders.length,
      todayDelivered: todayDelivered.length,
      todayEarnings: sumEarnings(todayDelivered),
      weekDelivered: weekDelivered.length,
      weekEarnings: sumEarnings(weekDelivered),
      monthDelivered: monthDelivered.length,
      monthEarnings: sumEarnings(monthDelivered),
      totalEarnings: sumEarnings(deliveredOrders),
      weeklyStats,
      recentEarnings,
      deliveryStatus: req.user.deliveryStatus,
      shiftStart: req.user.shiftStart,
      shiftEnd: req.user.shiftEnd,
    },
  })
})

const updateAvailability = asyncHandler(async (req, res) => {
  const { deliveryStatus, shiftStart, shiftEnd } = req.body

  const user = await User.findById(req.user._id)
  if (!user) return res.status(404).json({ message: 'User not found' })

  if (deliveryStatus && ['offline', 'online', 'break'].includes(deliveryStatus)) {
    user.deliveryStatus = deliveryStatus
  }
  if (shiftStart !== undefined) user.shiftStart = shiftStart
  if (shiftEnd !== undefined) user.shiftEnd = shiftEnd

  await user.save()

  res.json({
    message: 'Availability updated',
    deliveryStatus: user.deliveryStatus,
    shiftStart: user.shiftStart,
    shiftEnd: user.shiftEnd,
  })
})

const getPartnerDetails = asyncHandler(async (req, res) => {
  const partner = await User.findOne({ _id: req.params.id, role: 'delivery' })
    .select('-password')
    .lean()
  if (!partner) return res.status(404).json({ message: 'Delivery partner not found' })

  const orders = await Order.find({ assignedDeliveryPartner: req.params.id })
    .sort({ updatedAt: -1 })
    .lean()

  const deliveredOrders = orders.filter((o) => o.orderStatus === 'delivered')
  const activeOrders = orders.filter((o) => ['confirmed', 'processing', 'shipped', 'out_for_delivery'].includes(o.orderStatus))

  res.json({
    partner,
    stats: {
      totalOrders: orders.length,
      deliveredOrders: deliveredOrders.length,
      activeOrders: activeOrders.length,
      totalEarnings: sumEarnings(deliveredOrders),
      walletBalance: partner.wallet?.balance || 0,
      walletTransactions: (partner.wallet?.transactions || []).slice(0, 20),
    },
    recentOrders: orders.slice(0, 20),
  })
})

module.exports = { getDeliveryAnalytics, updateAvailability, getPartnerDetails }
