import axios from "axios";

const DELHIVERY_API_URL =
  process.env.DELHIVERY_API_URL || "https://track.delhivery.com";

const DELHIVERY_API_TOKEN = process.env.DELHIVERY_API_TOKEN;

const DELHIVERY_CLIENT_NAME =
  process.env.DELHIVERY_CLIENT_NAME || "BOSERA";

const DELHIVERY_PICKUP_LOCATION =
  process.env.DELHIVERY_PICKUP_LOCATION || "BOSERA";

function cleanText(value = "") {
  return String(value)
    .replace(/[&#%;\\]/g, "")
    .trim();
}

function getOrderItems(order) {
  return order.orderItems || order.items || order.products || [];
}

function getProductsDescription(order) {
  const items = getOrderItems(order);

  if (!items.length) return "Product";

  return items
    .map((item) => {
      const name = item.name || item.title || "Product";
      const quantity = item.quantity || item.qty || 1;
      const size = item.size ? ` Size: ${item.size}` : "";
      return `${name}${size} x ${quantity}`;
    })
    .join(", ");
}

function getTotalQuantity(order) {
  const items = getOrderItems(order);

  if (!items.length) return 1;

  return items.reduce((total, item) => {
    return total + Number(item.quantity || item.qty || 1);
  }, 0);
}

function buildTrackingUrl(awb) {
  if (!awb) return null;
  return `https://www.delhivery.com/track/package/${awb}`;
}

function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

export async function createDelhiveryShipment(order) {
  if (!DELHIVERY_API_TOKEN) {
    throw new Error("DELHIVERY_API_TOKEN is missing");
  }

  if (!DELHIVERY_PICKUP_LOCATION) {
    throw new Error("DELHIVERY_PICKUP_LOCATION is missing");
  }

  const shipping = order.shippingAddress || {};

  const customerName =
    shipping.fullName ||
    shipping.name ||
    order.customerName ||
    order.name ||
    "Customer";

  const phone =
    shipping.phone ||
    order.phone ||
    order.customerPhone ||
    "";

  const addressLine = [
    shipping.addressLine1,
    shipping.addressLine2,
    shipping.address,
    shipping.fullAddress,
  ]
    .filter(Boolean)
    .join(", ");

  const city = shipping.city || "";
  const state = shipping.state || "";
  const pincode = shipping.pincode || shipping.pin || shipping.zip || "";

  const totalAmount = Number(
    order.totalPrice ||
      order.totalAmount ||
      order.amount ||
      order.total ||
      0
  );

  if (!customerName || !phone || !addressLine || !city || !state || !pincode) {
    throw new Error(
      "Missing customer shipping details required for Delhivery shipment"
    );
  }

  const orderId = String(order._id || order.id);

  const shipment = {
    name: cleanText(customerName),
    add: cleanText(addressLine),
    pin: String(pincode),
    city: cleanText(city),
    state: cleanText(state),
    country: "India",
    phone: String(phone),

    order: orderId,

    // Important: Delhivery docs use "Prepaid", not "Pre-paid"
    payment_mode: "Prepaid",

    return_pin: String(process.env.STORE_RETURN_PIN || "784526"),
    return_city: cleanText(process.env.STORE_RETURN_CITY || "Kokrajhar"),
    return_phone: String(process.env.STORE_RETURN_PHONE || "7636811101"),
    return_add: cleanText(process.env.STORE_RETURN_ADDRESS || "Kalikhol, Assam"),
    return_state: cleanText(process.env.STORE_RETURN_STATE || "Assam"),
    return_country: "India",

    products_desc: cleanText(getProductsDescription(order)),
    hsn_code: "",
    cod_amount: "",
    order_date: getTodayDate(),
    total_amount: String(totalAmount),

    seller_add: cleanText(process.env.STORE_RETURN_ADDRESS || "Kalikhol, Assam"),
    seller_name: cleanText(DELHIVERY_CLIENT_NAME),
    seller_inv: orderId,

    quantity: String(getTotalQuantity(order)),
    waybill: "",

    // Delhivery sample includes these. Better to include them.
    shipment_width: "10",
    shipment_height: "10",
    shipment_length: "10",
    weight: "0.5",

    shipping_mode: "Surface",
    address_type: "home"
  };

  const payload = {
    shipments: [shipment],
    pickup_location: {
      name: cleanText(DELHIVERY_PICKUP_LOCATION),
    },
  };

const formBody = new URLSearchParams();
formBody.append("format", "json");
formBody.append("data", JSON.stringify(payload));

const response = await axios.post(
  `${DELHIVERY_API_URL}/api/cmu/create.json`,
  formBody.toString(),
  {
    headers: {
      Authorization: `Token ${DELHIVERY_API_TOKEN}`,
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    timeout: 20000,
  }
);

  const data = response.data;

  if (data?.error === true || data?.success === false) {
    throw new Error(
      data?.rmk || data?.message || "Delhivery rejected shipment creation"
    );
  }

  const packageInfo =
    data?.packages?.[0] ||
    data?.Package?.[0] ||
    data?.data?.packages?.[0] ||
    {};

  const awb =
    packageInfo?.waybill ||
    packageInfo?.wbn ||
    packageInfo?.awb ||
    packageInfo?.tracking_number ||
    data?.waybill ||
    data?.wbn ||
    data?.awb ||
    null;

  if (!awb) {
    throw new Error("Delhivery shipment created but AWB was not returned");
  }

  return {
    success: true,
    awb,
    trackingUrl: buildTrackingUrl(awb),
    rawResponse: data,
  };
}

export async function createShipmentForPaidOrder(order) {
  try {
    if (!order) {
      throw new Error("Order is missing");
    }

    if (!order.isPaid) {
      return order;
    }

    if (order.delhivery?.awb) {
      return order;
    }

    const delhiveryResult = await createDelhiveryShipment(order);

    order.delhivery = {
      awb: delhiveryResult.awb,
      status: "created",
      trackingUrl: delhiveryResult.trackingUrl,
      rawResponse: delhiveryResult.rawResponse,
      error: null,
      createdAt: new Date(),
    };

    order.trackingNumber = delhiveryResult.awb;
    order.orderStatus = "confirmed";

    return await order.save();
  } catch (error) {
    order.delhivery = {
      awb: null,
      status: "failed",
      trackingUrl: null,
      rawResponse: null,
      error: error.message,
      createdAt: new Date(),
    };

    return await order.save();
  }
}