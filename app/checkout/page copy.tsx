"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import Image from "next/image";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";
import { validateRequired, validateEmail, validatePhone, validatePincode } from "@/app/utils/validate";
import LoginRegisterModal from "@/components/LoginRegisterModal";
import { loadRazorpayScript } from "../utils/loadRazorpay";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const DOMAIN_URL = process.env.NEXT_PUBLIC_DOMAIN;




const image = "/images/razorpay.svg";

export default function CheckoutPage() {
  const { cartItems, removeFromCart, updateQty, clearCart } = useCart();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsLoggedIn(!!localStorage.getItem("token"));
    }
  }, []);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.qty),
    0
  );

  // Calculate taxes
  const calculateTaxes = () => {
    let totalTax = 0;
    const taxDetails: { name: string; rate: number; amount: number; productName: string }[] = [];

    cartItems.forEach((item) => {
      const price = Number(item.price) * Number(item.qty);
      const taxRate = Number(item.tax_rate || 0);
      const taxAmount = (price * taxRate) / 100;

      if (taxRate > 0) {
        taxDetails.push({
          name: item.tax_name || "Tax",
          rate: taxRate,
          amount: taxAmount,
          productName: item.name,
        });
      }

      totalTax += taxAmount;
    });

    return { totalTax, taxDetails };
  };

  const { totalTax, taxDetails } = calculateTaxes();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    order_notes: "",
    city: "",
    state: "",
    country: "India",
    pincode: "",
    payment: "cod",
    coupon: "",
  });

  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [shippingMethods, setShippingMethods] = useState<
    { id: number; method_name: string; cost: number }[]
  >([]);
  const [selectedMethod, setSelectedMethod] = useState<{
    id: number;
    method_name: string;
    cost: number;
  } | null>(null);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const capitalize = (str: string) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Detect shipping zone
  const detectShippingZone = async (updatedForm: typeof form) => {
    const { country, state, city } = updatedForm;

    if (!country || !state) {
      setShippingMethods([]);
      setSelectedMethod(null);
      return;
    }

    try {
      const params = new URLSearchParams();
      params.append("country", country.trim().toLowerCase());
      params.append("state", state.trim().toLowerCase());
      if (city) params.append("city", city.trim().toLowerCase());

      const res = await fetch(
        `${BASE_URL}detect-zone?${params.toString()}`
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        setShippingMethods([]);
        setSelectedMethod(null);
        if (data.message) {
          toast.error(data.message);
        }
        return;
      }

      setShippingMethods(data.methods || []);
      if (data.methods && data.methods.length > 0) {
        const cheapest = data.methods.reduce(
          (prev: any, curr: any) =>
            Number(curr.cost) < Number(prev.cost) ? curr : prev,
          data.methods[0]
        );
        setSelectedMethod(cheapest);
      } else {
        setSelectedMethod(null);
      }
    } catch (err) {
      console.error("Zone detection failed:", err);
      setShippingMethods([]);
      setSelectedMethod(null);
      toast.error("Failed to detect shipping zone");
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!validateRequired(form.name)) newErrors.name = "Full Name is required";
    if (!validateEmail(form.email)) newErrors.email = "Enter a valid email";
    if (!validatePhone(form.phone))
      newErrors.phone = "Enter a valid 10-digit phone number";
    if (!validatePincode(form.pincode))
      newErrors.pincode = "Enter a valid 6-digit pincode";
    if (!validateRequired(form.address)) newErrors.address = "Address is required";
    if (!validateRequired(form.city)) newErrors.city = "City is required";
    if (!validateRequired(form.state)) newErrors.state = "State is required";
    if (!validateRequired(form.country)) newErrors.country = "Country is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const subtotal = Number(totalPrice) || 0;
  const discount = Number(appliedDiscount) || 0;
  const shipping = Number(selectedMethod?.cost) || 0;
  const finalTotal = subtotal - discount + shipping + totalTax;

  // Place order function
  const placeOrder = async (paymentDetails?: any) => {
    try {
      const token = localStorage.getItem("token");

      const orderData = {
        cartItems: cartItems.map((item) => ({
          product_id: item.productId || item.id,
          qty: item.qty,
          price: item.price,
          unit: item.unit || null,
        })),
        total_amount: finalTotal,
        payment_method: form.payment,
        payment_status: form.payment === "cod" ? "pending" : "paid",
        shipping_address: {
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: form.address,
          city: form.city,
          state: form.state,
          country: form.country,
          pincode: form.pincode,
          order_notes: form.order_notes,
        },
        coupon: form.coupon || null,
        discount: appliedDiscount || 0,
        shipping_method: selectedMethod ? selectedMethod.method_name : null,
        shipping_cost: selectedMethod ? selectedMethod.cost : 0,
        tax_details: taxDetails,
        total_tax: totalTax,
        subtotal: totalPrice,
        payment_details: paymentDetails || null,
      };

      const response = await fetch(`${BASE_URL}order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        toast.error(data.message || "Failed to place order");
        return null;
      }

      toast.success("Order placed successfully!");
      await clearCart();
      localStorage.removeItem("cart");
      return data.order_number;
    } catch (error) {
      console.error("Order submission error:", error);
      toast.error("Something went wrong!");
      return null;
    }
  };

  // Razorpay Payment Handler
  const handleRazorpayPayment = async () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    if (!validateForm()) {
      toast.error("Please fix the highlighted fields!");
      return;
    }

    if (!isLoggedIn) {
      toast.error("Please login or register before placing your order!");
      setShowModal(true);
      return;
    }

    setIsProcessing(true);

    // Load Razorpay script
    const res = await loadRazorpayScript();
    if (!res) {
      toast.error("Razorpay SDK failed to load. Are you online?");
      setIsProcessing(false);
      return;
    }

    try {
      // Create Razorpay order
      const orderRes = await fetch(`${BASE_URL}razorpay-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Math.round(finalTotal),
          order_id: Date.now(),
        }),
      });

      const orderData = await orderRes.json();

      if (!orderData.success) {
        throw new Error("Order creation failed");
      }

      // Razorpay options
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Your Store Name",
        description: "Order Payment",
        order_id: orderData.razorpay_order_id,
        handler: async function (response: any) {
          console.log("Payment Response:", response);

          try {
            
            const verifyRes = await fetch(
              `${BASE_URL}razorpay-verify`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              }
            );

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              toast.success("Payment verified successfully!");

              // Place order with payment details
              const orderNumber = await placeOrder({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });

              if (orderNumber) {
                window.location.href = `/order-placed?order_number=${orderNumber}`;
              }
            } else {
              toast.error("Payment verification failed!");
            }
          } catch (error) {
            console.error("Verification error:", error);
            toast.error("Payment verification failed!");
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: { color: "#0d3b2e" },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            toast.error("Payment cancelled");
          },
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Payment failed. Please try again.");
      setIsProcessing(false);
    }
  };

  // COD Order Handler
  const handleCODOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    if (!validateForm()) {
      toast.error("Please fix the highlighted fields!");
      return;
    }

    if (!isLoggedIn) {
      toast.error("Please login or register before placing your order!");
      setShowModal(true);
      return;
    }

    setIsProcessing(true);

    const orderNumber = await placeOrder();

    if (orderNumber) {
      window.location.href = `/order-placed?order_number=${orderNumber}`;
    }

    setIsProcessing(false);
  };

  // Apply coupon
  const applyCoupon = async () => {
    if (!form.coupon) return toast.error("Enter a coupon code");

    try {
      const res = await fetch(
        `${BASE_URL}coupon/${form.coupon.trim()}`
      );
      const data = await res.json();

      if (!data.success) {
        setAppliedDiscount(0);
        toast.error(data.message || "Invalid coupon");
        return;
      }

      const coupon = data.coupon;
      let discountAmount = 0;

      if (coupon.type === "fixed") {
        discountAmount = Number(coupon.value);
      } else if (coupon.type === "percent") {
        discountAmount = (subtotal * Number(coupon.value)) / 100;
        if (coupon.max_discount) {
          discountAmount = Math.min(discountAmount, Number(coupon.max_discount));
        }
      }

      setAppliedDiscount(discountAmount);
      toast.success(`Coupon applied: ₹${discountAmount.toFixed(2)} off`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to apply coupon");
    }
  };

  const handleIncrease = (id: number, variationId?: number) => {
    updateQty(id, variationId, "increase");
  };

  const handleDecrease = (id: number, variationId?: number) => {
    updateQty(id, variationId, "decrease");
  };

  const renderVariations = (item: any) => {
    const variations =
      item.variations || item.variation || item.options || item.attributes || null;

    if (!variations) return null;

    if (Array.isArray(variations)) {
      return (
        <div className="flex gap-2 flex-wrap">
          {variations.map((v: any, idx: number) => {
            if (typeof v === "string") {
              return (
                <span
                  key={idx}
                  className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded"
                >
                  {v}
                </span>
              );
            }
            if (v.name && v.value) {
              return (
                <span
                  key={idx}
                  className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded"
                >
                  {v.name}: {v.value}
                </span>
              );
            }
            return (
              <span
                key={idx}
                className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded"
              >
                {JSON.stringify(v)}
              </span>
            );
          })}
        </div>
      );
    }

    if (typeof variations === "object") {
      return (
        <div className="flex gap-2 flex-wrap">
          {Object.entries(variations).map(([k, v]) => (
            <span
              key={k}
              className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded"
            >
              {k}: {String(v)}
            </span>
          ))}
        </div>
      );
    }

    return null;
  };

  const paymentMethods = [
    { id: "cod", label: "Cash on Delivery (Pay in Cash)" },
    {
      id: "online",
      label: "Pay Online (UPI / Credit / Debit / Netbanking / Wallets)",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f8f5f0] to-[#e8e3de] py-12 px-4 md:px-12">
      <h1 className="text-4xl md:text-5xl font-serif text-center font-bold mb-12 text-gray-800">
        Checkout
      </h1>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10">
        {/* Left side: Shipping Details */}
        <form
          onSubmit={handleCODOrder}
          className="bg-white p-8 rounded-3xl shadow-xl flex flex-col gap-5"
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Shipping Details
          </h2>

          {/* Full Name */}
          <div className="grid">
            <label className="mb-1 font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              className={`border p-3 rounded-lg focus:ring-2 w-full ${
                errors.name
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-[#0d3b2e]"
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="grid">
            <label className="mb-1 font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              className={`border p-3 rounded-lg focus:ring-2 w-full ${
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-[#0d3b2e]"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div className="grid">
            <label className="mb-1 font-medium text-gray-700">Phone Number</label>
            <input
              type="text"
              name="phone"
              placeholder="Enter your phone number"
              value={form.phone}
              onChange={handleChange}
              className={`border p-3 rounded-lg focus:ring-2 w-full ${
                errors.phone
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-[#0d3b2e]"
              }`}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Pincode */}
          <div className="grid">
            <label className="mb-1 font-medium text-gray-700">Pincode</label>
            <input
              type="text"
              name="pincode"
              placeholder="Enter your pincode"
              value={form.pincode}
              onChange={handleChange}
              className={`border p-3 rounded-lg focus:ring-2 w-full ${
                errors.pincode
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-[#0d3b2e]"
              }`}
            />
            {errors.pincode && (
              <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>
            )}
          </div>

          {/* Address */}
          <div className="grid">
            <label className="mb-1 font-medium text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              placeholder="Enter your address"
              value={form.address}
              onChange={handleChange}
              className={`border p-3 rounded-lg focus:ring-2 w-full ${
                errors.address
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-[#0d3b2e]"
              }`}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address}</p>
            )}
          </div>

          {/* Order Notes */}
          <div className="grid">
            <label className="mb-1 font-medium text-gray-700">
              Order Notes (optional)
            </label>
            <textarea
              name="order_notes"
              placeholder="Any additional instructions"
              value={form.order_notes}
              onChange={handleChange}
              className="border p-3 rounded-lg focus:ring-2 focus:ring-[#0d3b2e] w-full resize-none h-24"
            />
          </div>

          {/* City, State, Country */}
          <div className="grid md:grid-cols-3 gap-4">
            {/* City */}
            <div>
              <label className="mb-1 font-medium text-gray-700">City</label>
              <input
                type="text"
                name="city"
                placeholder="Enter city"
                value={form.city}
                onChange={(e) => {
                  const val = capitalize(e.target.value);
                  setForm({ ...form, city: val });
                  setErrors({ ...errors, city: "" });
                  detectShippingZone({ ...form, city: val });
                }}
                className={`border p-3 rounded-lg focus:ring-2 w-full ${
                  errors.city
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-[#0d3b2e]"
                }`}
              />
              {errors.city && (
                <p className="text-red-500 text-sm mt-1">{errors.city}</p>
              )}
            </div>

            {/* State */}
            <div>
              <label className="mb-1 font-medium text-gray-700">State</label>
              <input
                type="text"
                name="state"
                placeholder="Enter state"
                value={form.state}
                onChange={(e) => {
                  const val = capitalize(e.target.value);
                  setForm({ ...form, state: val });
                  setErrors({ ...errors, state: "" });
                  detectShippingZone({ ...form, state: val });
                }}
                className={`border p-3 rounded-lg focus:ring-2 w-full ${
                  errors.state
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-[#0d3b2e]"
                }`}
              />
              {errors.state && (
                <p className="text-red-500 text-sm mt-1">{errors.state}</p>
              )}
            </div>

            {/* Country */}
            <div>
              <label className="mb-1 font-medium text-gray-700">Country</label>
              <input
                type="text"
                name="country"
                placeholder="Enter country"
                value={form.country}
                onChange={(e) => {
                  const val = capitalize(e.target.value);
                  setForm({ ...form, country: val });
                  setErrors({ ...errors, country: "" });
                  detectShippingZone({ ...form, country: val });
                }}
                className={`border p-3 rounded-lg focus:ring-2 w-full ${
                  errors.country
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-[#0d3b2e]"
                }`}
              />
              {errors.country && (
                <p className="text-red-500 text-sm mt-1">{errors.country}</p>
              )}
            </div>
          </div>
        </form>

        {/* Right side: Order Summary */}
        <div className="bg-white p-8 rounded-3xl shadow-xl flex flex-col gap-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Order Summary
          </h2>
          <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto">
            {cartItems.map((item) => (
              <div
                key={`${item.id}-${item.variationId ?? 0}`}
                className="flex justify-between items-center bg-[#f9f9f9] p-4 rounded-2xl hover:bg-[#f0f0f0] transition-all"
              >
                <div className="flex items-start gap-4">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    className="rounded-lg object-cover"
                  />
                  <div className="min-w-[160px]">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">
                        {item.name}
                      </span>
                    </div>

                    <div className="text-sm text-gray-600 mt-1">
                      ₹{Number(item.price).toFixed(2)}
                    </div>

                    <div className="mt-2">
                      {item.variationName ? (
                        <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {item.variationName}
                        </span>
                      ) : (
                        renderVariations(item) || (
                          <span className="text-xs text-gray-500">
                            No variations
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-2">
                    <button
                      onClick={() => handleDecrease(item.id, item.variationId)}
                      className="px-3 py-1 text-gray-700 hover:text-[#0d3b2e] transition font-bold text-lg"
                    >
                      −
                    </button>
                    <div className="w-10 text-center font-medium text-gray-800">
                      {item.qty}
                    </div>
                    <button
                      onClick={() => handleIncrease(item.id, item.variationId)}
                      className="px-3 py-1 text-gray-700 hover:text-[#0d3b2e] transition font-bold text-lg"
                    >
                      +
                    </button>
                  </div>
                  <div className="text-sm font-semibold text-gray-900">
                    ₹{(Number(item.price) * Number(item.qty)).toFixed(2)}
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id, item.variationId)}
                    className="text-red-500 hover:text-red-700 text-sm mt-1"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <input
              type="text"
              name="coupon"
              placeholder="Enter coupon code"
              value={form.coupon}
              onChange={handleChange}
              className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-[#0d3b2e]"
            />
            <button
              type="button"
              onClick={applyCoupon}
              className="bg-[#0d3b2e] text-white px-6 py-3 rounded-lg hover:bg-[#145c45] transition"
            >
              Apply
            </button>
          </div>

          <div className="border-t mt-4 pt-4 flex flex-col gap-2">
            <div className="flex justify-between text-gray-700 font-medium">
              <span>Subtotal:</span>
              <span>₹{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-700 font-medium">
              <span>Shipping:</span>
              <span>
                ₹{Number(selectedMethod?.cost || 0).toFixed(2)}
                {selectedMethod ? ` (${selectedMethod.method_name})` : ""}
              </span>
            </div>
            <div className="flex justify-between text-green-600 font-medium">
              <span>
                Discount{form.coupon ? ` (${form.coupon.toUpperCase()})` : ""}:
              </span>
              <span>- ₹{discount.toFixed(2)}</span>
            </div>
            <div className="border-t mt-4 pt-4 flex flex-col gap-2">
              <h3 className="font-medium text-gray-800">Tax Details:</h3>
              {taxDetails.map((t, idx) => (
                <div
                  key={idx}
                  className="flex justify-between text-gray-700 text-sm"
                >
                  <span>
                    {t.productName} ({t.rate}% {t.name}):
                  </span>
                  <span>₹{t.amount.toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-gray-900 mt-2">
                <span>Total Tax:</span>
                <span>₹{totalTax.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-between text-gray-900 font-bold text-xl mt-3">
              <span>Total:</span>
              <span>₹{finalTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Payment Method
            </h3>
            <div className="flex flex-col gap-3">
              {paymentMethods.map((method) => (
                <div key={method.id}>
                  <label
                    className={`flex items-center justify-between p-4 border rounded-2xl cursor-pointer transition
                        ${
                          form.payment === method.id
                            ? "border-[#0d3b2e] bg-[#e6f2ee]"
                            : "border-gray-300 hover:border-[#0d3b2e]"
                        }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={form.payment === method.id}
                        onChange={(e) =>
                          setForm({ ...form, payment: e.target.value })
                        }
                        className="accent-[#0d3b2e] w-5 h-5"
                      />
                      <span className="font-medium text-gray-800">
                        {method.label}
                      </span>
                    </div>
                  </label>
                </div>
              ))}
              <img
                src={image}
                alt="Payment Method"
                className="h-4 w-auto mt-3 text-left"
              />
            </div>
          </div>

          {form.payment === "cod" ? (
            <button
              type="submit"
              onClick={handleCODOrder}
              disabled={isProcessing}
              className={`mt-6 bg-[#0d3b2e] text-white py-3 rounded-2xl font-semibold text-lg hover:bg-[#145c45] transition ${
                isProcessing ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isProcessing ? "Processing..." : "Place Order"}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleRazorpayPayment}
              disabled={isProcessing}
              className={`mt-6 bg-[#0d3b2e] text-white py-3 rounded-2xl font-semibold text-lg hover:bg-[#145c45] transition ${
                isProcessing ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isProcessing ? "Processing..." : "Pay Now"}
            </button>
          )}

          <LoginRegisterModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            onSuccess={() => {
              setIsLoggedIn(true);
              setShowModal(false);
              toast.success("Logged in successfully! Please continue checkout.");
            }}
          />
        </div>
      </div>
    </main>
  );
}