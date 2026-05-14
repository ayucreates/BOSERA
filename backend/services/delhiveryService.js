import axios from 'axios';

const DELHIVERY_API_URL = process.env.DELHIVERY_API_URL || 'https://track.delhivery.com';
const DELHIVERY_API_TOKEN = process.env.DELHIVERY_API_TOKEN;
const DELHIVERY_CLIENT_NAME = process.env.DELHIVERY_CLIENT_NAME || 'Litebouys zone';
const DELHIVERY_PICKUP_LOCATION = process.env.DELHIVERY_PICKUP_LOCATION || 'Litebouys zone';

const cleanText = (value = '') =>
  String(value)
    .replace(/[&#%;\\]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const getProductsDescription = (items = []) => {
  if (!Array.isArray(items) || items.length === 0) return 'Lite Bouys Zone order';

  return items
    .map((item) => `${item.name || 'Product'} x ${item.quantity || 1}`)
    .join(', ')
    .slice(0, 250);
};

const getTotalQuantity = (items = []) => {
  if (!Array.isArray(items) || items.length === 0) return 1;

  return items.reduce((total, item) => total + Number(item.quantity || 1), 0);
};

const buildTrackingUrl = (awb) => {
  if (!awb) return null;
  return `https://www.delhivery.com/track/package/${awb}`;
};

const extractAwb = (data) => {
  const packages = data?.packages || data?.Packages || data?.data?.packages || [];
  const firstPackage = Array.isArray(packages) ? packages[0] : packages;

  return (
    firstPackage?.waybill ||
    firstPackage?.awb ||
    firstPackage?.tracking_number ||
    data?.waybill ||
    data?.awb ||
    null
  );
};

export const createDelhiveryShipment = async (order) => {
  if (!DELHIVERY_API_TOKEN) {
    throw new Error('DELHIVERY_API_TOKEN is missing');
  }

  if (!DELHIVERY_PICKUP_LOCATION) {
    throw new Error('DELHIVERY_PICKUP_LOCATION is missing');
  }

  const address = order.shippingAddress || {};
  const fullAddress = cleanText(
    `${address.addressLine1 || ''} ${address.addressLine2 || ''}`
  );

  if (!address.fullName || !address.phone || !fullAddress || !address.pincode) {
    throw new Error('Customer name, phone, address, and pincode are required for Delhivery shipment');
  }

  const orderId = order._id.toString();
  const totalAmount = Number(order.totalPrice || 0);

  const shipment = {
    name: cleanText(address.fullName),
    add: fullAddress,
    pin: String(address.pincode),
    city: cleanText(address.city),
    state: cleanText(address.state),
    country: 'India',
    phone: String(address.phone),

    order: orderId,
    payment_mode: order.paymentMethod === 'cod' ? 'COD' : 'Pre-paid',
    cod_amount: order.paymentMethod === 'cod' ? String(totalAmount) : '0',

    products_desc: cleanText(getProductsDescription(order.orderItems)),
    quantity: String(getTotalQuantity(order.orderItems)),
    total_amount: String(totalAmount),

    seller_name: cleanText(DELHIVERY_CLIENT_NAME),
    client: cleanText(DELHIVERY_CLIENT_NAME),
    pickup_location: {
      name: cleanText(DELHIVERY_PICKUP_LOCATION)
    },

    return_name: cleanText(process.env.STORE_RETURN_NAME || DELHIVERY_CLIENT_NAME),
    return_add: cleanText(process.env.STORE_RETURN_ADDRESS || fullAddress),
    return_city: cleanText(process.env.STORE_RETURN_CITY || address.city),
    return_state: cleanText(process.env.STORE_RETURN_STATE || address.state),
    return_pin: String(process.env.STORE_RETURN_PIN || address.pincode),
    return_phone: String(process.env.STORE_RETURN_PHONE || address.phone),

    fragile_shipment: false
  };

  const payload = {
    shipments: [shipment],
    pickup_location: {
      name: cleanText(DELHIVERY_PICKUP_LOCATION)
    }
  };

  const formBody = new URLSearchParams();
  formBody.append('format', 'json');
  formBody.append('data', JSON.stringify(payload));

  const { data } = await axios.post(
    `${DELHIVERY_API_URL}/api/cmu/create.json`,
    formBody.toString(),
    {
      headers: {
        Authorization: `Token ${DELHIVERY_API_TOKEN}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json'
      },
      timeout: 20000
    }
  );

  const awb = extractAwb(data);

  return {
    awb,
    trackingUrl: buildTrackingUrl(awb),
    rawResponse: data
  };
};

export const createShipmentForPaidOrder = async (order) => {
  if (order.delhivery?.status === 'created' && order.delhivery?.awb) {
    return order;
  }

  try {
    const shipment = await createDelhiveryShipment(order);

    order.delhivery = {
      awb: shipment.awb,
      status: shipment.awb ? 'created' : 'created_without_awb',
      trackingUrl: shipment.trackingUrl,
      rawResponse: shipment.rawResponse,
      createdAt: new Date(),
      error: null
    };

    if (shipment.awb) {
      order.trackingNumber = shipment.awb;
    }
  } catch (error) {
    order.delhivery = {
      awb: order.delhivery?.awb || null,
      status: 'failed',
      trackingUrl: order.delhivery?.trackingUrl || null,
      rawResponse: order.delhivery?.rawResponse || null,
      createdAt: order.delhivery?.createdAt || null,
      error: error.response?.data || error.message
    };
  }

  await order.save();
  return order;
};
