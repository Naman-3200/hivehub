const express = require('express')
const { getDeliveryAnalytics, updateAvailability, getPartnerDetails } = require('../controllers/deliveryController')
const { protect, restrictTo } = require('../middlewares/authMiddleware')

const router = express.Router()

router.use(protect)

router.get('/analytics', restrictTo('delivery'), getDeliveryAnalytics)
router.patch('/availability', restrictTo('delivery'), updateAvailability)
router.get('/partner/:id', restrictTo('admin'), getPartnerDetails)

module.exports = router
