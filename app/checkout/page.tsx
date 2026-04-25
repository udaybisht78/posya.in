"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/components/CartContext";
import Image from "next/image";
import toast from "react-hot-toast";
import { Trash2, Plus, Minus, ChevronRight, Tag, Truck, ShieldCheck } from "lucide-react";
import { validateRequired, validateEmail, validatePhone, validatePincode } from "@/app/utils/validate";
import LoginRegisterModal from "@/components/LoginRegisterModal";
import { loadRazorpayScript } from "../utils/loadRazorpay";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function CheckoutPage() {
  const { cartItems, removeFromCart, updateQty, clearCart } = useCart();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  const totalPrice = cartItems.reduce((sum, item) => sum + Number(item.price) * Number(item.qty), 0);

  const calculateTaxes = () => {
    let totalTax = 0;
    const taxDetails: { name: string; rate: number; amount: number; productName: string }[] = [];
    cartItems.forEach((item) => {
      const price = Number(item.price) * Number(item.qty);
      const taxRate = Number(item.tax_rate || 0);
      const taxAmount = (price * taxRate) / 100;
      if (taxRate > 0) taxDetails.push({ name: item.tax_name || "Tax", rate: taxRate, amount: taxAmount, productName: item.name });
      totalTax += taxAmount;
    });
    return { totalTax, taxDetails };
  };
  const { totalTax, taxDetails } = calculateTaxes();

  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", order_notes: "", city: "", state: "", country: "India", pincode: "", payment: "cod", coupon: "" });
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [shippingMethods, setShippingMethods] = useState<{ id: number; method_name: string; cost: number }[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<{ id: number; method_name: string; cost: number } | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const capitalize = (str: string) => str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm({ ...form, [e.target.name]: e.target.value });

  const detectShippingZone = async (updatedForm: typeof form) => {
    const { country, state, city } = updatedForm;
    if (!country || !state) { setShippingMethods([]); setSelectedMethod(null); return; }
    try {
      const params = new URLSearchParams();
      params.append("country", country.trim().toLowerCase());
      params.append("state", state.trim().toLowerCase());
      if (city) params.append("city", city.trim().toLowerCase());
      const res = await fetch(`${BASE_URL}detect-zone?${params.toString()}`);
      const data = await res.json();
      if (!res.ok || !data.success) { setShippingMethods([]); setSelectedMethod(null); return; }
      setShippingMethods(data.methods || []);
      if (data.methods?.length > 0) {
        const cheapest = data.methods.reduce((prev: any, curr: any) => Number(curr.cost) < Number(prev.cost) ? curr : prev, data.methods[0]);
        setSelectedMethod(cheapest);
      } else setSelectedMethod(null);
    } catch { setShippingMethods([]); setSelectedMethod(null); }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!validateRequired(form.name)) newErrors.name = "Full Name is required";
    if (!validateEmail(form.email)) newErrors.email = "Enter a valid email";
    if (!validatePhone(form.phone)) newErrors.phone = "Enter a valid 10-digit phone";
    if (!validatePincode(form.pincode)) newErrors.pincode = "Enter a valid 6-digit pincode";
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

  const placeOrder = async (paymentDetails?: any) => {
    try {
      const token = localStorage.getItem("token");
      const orderData = {
        cartItems: cartItems.map((item) => ({ product_id: item.productId || item.id, qty: item.qty, price: item.price, unit: item.unit || null })),
        total_amount: finalTotal, payment_method: form.payment, payment_status: form.payment === "cod" ? "pending" : "paid",
        shipping_address: { name: form.name, email: form.email, phone: form.phone, address: form.address, city: form.city, state: form.state, country: form.country, pincode: form.pincode, order_notes: form.order_notes },
        coupon: form.coupon || null, discount: appliedDiscount || 0,
        shipping_method: selectedMethod ? selectedMethod.method_name : null, shipping_cost: selectedMethod ? selectedMethod.cost : 0,
        tax_details: taxDetails, total_tax: totalTax, subtotal: totalPrice, payment_details: paymentDetails || null,
      };
      const response = await fetch(`${BASE_URL}order`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify(orderData) });
      const data = await response.json();
      if (!response.ok || !data.success) { toast.error(data.message || "Failed to place order"); return null; }
      toast.success("Order placed successfully!");
      await clearCart();
      localStorage.removeItem("cart");
      return data.order_number;
    } catch { toast.error("Something went wrong!"); return null; }
  };

  const handleRazorpayPayment = async () => {
    if (cartItems.length === 0) { toast.error("Your cart is empty!"); return; }
    if (!validateForm()) { toast.error("Please fix the highlighted fields!"); return; }
    if (!isLoggedIn) { toast.error("Please login before placing your order!"); setShowModal(true); return; }
    setIsProcessing(true);
    const res = await loadRazorpayScript();
    if (!res) { toast.error("Razorpay SDK failed to load."); setIsProcessing(false); return; }
    try {
      const orderRes = await fetch(`${BASE_URL}razorpay-order`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ amount: Math.round(finalTotal), order_id: Date.now() }) });
      const orderData = await orderRes.json();
      if (!orderData.success) throw new Error("Order creation failed");
      const options = {
        key: orderData.key, amount: orderData.amount, currency: orderData.currency, name: "Posya", description: "Order Payment",
        order_id: orderData.razorpay_order_id,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch(`${BASE_URL}razorpay-verify`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ razorpay_order_id: response.razorpay_order_id, razorpay_payment_id: response.razorpay_payment_id, razorpay_signature: response.razorpay_signature }) });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              const orderNumber = await placeOrder({ razorpay_order_id: response.razorpay_order_id, razorpay_payment_id: response.razorpay_payment_id, razorpay_signature: response.razorpay_signature });
              if (orderNumber) window.location.href = `/order-placed?order_number=${orderNumber}`;
            } else toast.error("Payment verification failed!");
          } catch { toast.error("Payment verification failed!"); } finally { setIsProcessing(false); }
        },
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: "#cb8836" },
        modal: { ondismiss: function () { setIsProcessing(false); toast.error("Payment cancelled"); } },
      };
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch { toast.error("Payment failed. Please try again."); setIsProcessing(false); }
  };

  const handleCODOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) { toast.error("Your cart is empty!"); return; }
    if (!validateForm()) { toast.error("Please fix the highlighted fields!"); return; }
    if (!isLoggedIn) { toast.error("Please login before placing your order!"); setShowModal(true); return; }
    setIsProcessing(true);
    const orderNumber = await placeOrder();
    if (orderNumber) window.location.href = `/order-placed?order_number=${orderNumber}`;
    setIsProcessing(false);
  };

  const applyCoupon = async () => {
    if (!form.coupon) return toast.error("Enter a coupon code");
    try {
      const res = await fetch(`${BASE_URL}coupon/${form.coupon.trim()}`);
      const data = await res.json();
      if (!data.success) { setAppliedDiscount(0); toast.error(data.message || "Invalid coupon"); return; }
      const coupon = data.coupon;
      let discountAmount = coupon.type === "fixed" ? Number(coupon.value) : Math.min((subtotal * Number(coupon.value)) / 100, coupon.max_discount ? Number(coupon.max_discount) : Infinity);
      setAppliedDiscount(discountAmount);
      toast.success(`Coupon applied: ₹${discountAmount.toFixed(2)} off`);
    } catch { toast.error("Failed to apply coupon"); }
  };

  const Field = ({ label, name, type = "text", placeholder, error, extraOnChange }: any) => (
    <div className="chk-field">
      <label className="chk-label">{label}</label>
      <input type={type} name={name} placeholder={placeholder} value={(form as any)[name]} onChange={(e) => { handleChange(e); extraOnChange?.(e); }}
        className={`chk-input ${error ? "chk-input--error" : ""}`} />
      {error && <p className="chk-error">{error}</p>}
    </div>
  );

  return (
    <main className="min-h-screen" style={{ background: "#f2eee9" }}>

      {/* Hero */}
      <div className="chk-hero">
        <p className="chk-eyebrow">Almost There</p>
        <h1 className="chk-hero-heading">Checkout</h1>
      </div>

      <div className="chk-page-wrap">

        <div className="chk-layout">

          {/* ── LEFT: Shipping form ── */}
          <form onSubmit={handleCODOrder} className="chk-form-card">

            <div className="chk-section-label">
              <span className="chk-step-num">1</span>
              Shipping Details
            </div>

            <div className="chk-fields-grid">
              <Field label="Full Name" name="name" placeholder="Your full name" error={errors.name} />
              <Field label="Email" name="email" type="email" placeholder="your@email.com" error={errors.email} />
              <Field label="Phone Number" name="phone" placeholder="10-digit phone" error={errors.phone} />
              <Field label="Pincode" name="pincode" placeholder="6-digit pincode" error={errors.pincode} />
            </div>

            <Field label="Address" name="address" placeholder="House no, street, area" error={errors.address} />

            <div className="chk-fields-grid chk-fields-grid--3">
              <div className="chk-field">
                <label className="chk-label">City</label>
                <input name="city" placeholder="City" value={form.city} className={`chk-input ${errors.city ? "chk-input--error" : ""}`}
                  onChange={(e) => { const v = capitalize(e.target.value); setForm({ ...form, city: v }); detectShippingZone({ ...form, city: v }); }} />
                {errors.city && <p className="chk-error">{errors.city}</p>}
              </div>
              <div className="chk-field">
                <label className="chk-label">State</label>
                <input name="state" placeholder="State" value={form.state} className={`chk-input ${errors.state ? "chk-input--error" : ""}`}
                  onChange={(e) => { const v = capitalize(e.target.value); setForm({ ...form, state: v }); detectShippingZone({ ...form, state: v }); }} />
                {errors.state && <p className="chk-error">{errors.state}</p>}
              </div>
              <div className="chk-field">
                <label className="chk-label">Country</label>
                <input name="country" placeholder="Country" value={form.country} className={`chk-input ${errors.country ? "chk-input--error" : ""}`}
                  onChange={(e) => { const v = capitalize(e.target.value); setForm({ ...form, country: v }); detectShippingZone({ ...form, country: v }); }} />
                {errors.country && <p className="chk-error">{errors.country}</p>}
              </div>
            </div>

            <div className="chk-field">
              <label className="chk-label">Order Notes <span style={{ color: "#a89070", fontWeight: 400 }}>(optional)</span></label>
              <textarea name="order_notes" placeholder="Any special instructions..." value={form.order_notes} onChange={handleChange} rows={3} className="chk-input chk-textarea" />
            </div>

            {/* Shipping method */}
            {shippingMethods.length > 0 && (
              <div className="chk-shipping-methods">
                <div className="chk-section-label" style={{ marginBottom: "12px" }}>
                  <Truck size={16} /> Shipping Method
                </div>
                {shippingMethods.map((m) => (
                  <label key={m.id} className={`chk-method-option ${selectedMethod?.id === m.id ? "chk-method-option--active" : ""}`}>
                    <input type="radio" name="shipping" checked={selectedMethod?.id === m.id} onChange={() => setSelectedMethod(m)} className="chk-radio" />
                    <span>{m.method_name}</span>
                    <span className="chk-method-price">₹{Number(m.cost).toFixed(2)}</span>
                  </label>
                ))}
              </div>
            )}

            {/* Payment method */}
            <div className="chk-payment-block">
              <div className="chk-section-label" style={{ marginBottom: "12px" }}>
                <span className="chk-step-num">2</span> Payment Method
              </div>
              {[
                { id: "cod", label: "Cash on Delivery" },
                { id: "online", label: "Pay Online (UPI / Card / Netbanking)" },
              ].map((m) => (
                <label key={m.id} className={`chk-method-option ${form.payment === m.id ? "chk-method-option--active" : ""}`}>
                  <input type="radio" name="payment" value={m.id} checked={form.payment === m.id} onChange={(e) => setForm({ ...form, payment: e.target.value })} className="chk-radio" />
                  <span>{m.label}</span>
                </label>
              ))}
              <img src="/images/razorpay.svg" alt="Razorpay" className="chk-razorpay-logo" />
            </div>

            {/* Place order button */}
            {form.payment === "cod" ? (
              <button type="submit" className="chk-place-btn" disabled={isProcessing}>
                {isProcessing ? "Processing..." : "Place Order →"}
              </button>
            ) : (
              <button type="button" onClick={handleRazorpayPayment} className="chk-place-btn" disabled={isProcessing}>
                {isProcessing ? "Processing..." : "Pay Now →"}
              </button>
            )}

            <div className="chk-trust">
              <ShieldCheck size={14} /> <span>Secure & Encrypted Checkout</span>
            </div>
          </form>

          {/* ── RIGHT: Order summary ── */}
          <div className="chk-summary-col">
            <div className="chk-summary-card">
              <div className="chk-section-label" style={{ marginBottom: "16px" }}>
                <span className="chk-step-num">3</span> Order Summary
              </div>

              {/* Items list */}
              <div className="chk-items-list">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.variationId ?? 0}`} className="chk-item">
                    <div className="chk-item-img-wrap">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="chk-item-info">
                      <p className="chk-item-name">{item.name}</p>
                      {item.variationName && <span className="chk-item-variation">{item.variationName}</span>}
                      <p className="chk-item-price">₹{Number(item.price).toFixed(2)}</p>
                    </div>
                    <div className="chk-item-controls">
                      <div className="chk-qty-row">
                        <button type="button" className="chk-qty-btn" onClick={() => updateQty(item.id, item.variationId, "decrease")}><Minus size={12} /></button>
                        <span className="chk-qty-num">{item.qty}</span>
                        <button type="button" className="chk-qty-btn" onClick={() => updateQty(item.id, item.variationId, "increase")}><Plus size={12} /></button>
                      </div>
                      <p className="chk-item-total">₹{(Number(item.price) * Number(item.qty)).toFixed(2)}</p>
                      <button type="button" className="chk-remove-btn" onClick={() => removeFromCart(item.id, item.variationId)}><Trash2 size={13} /></button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon */}
              <div className="chk-coupon-row">
                <div className="chk-coupon-wrap">
                  <Tag size={14} className="chk-coupon-icon" />
                  <input type="text" name="coupon" placeholder="Coupon code" value={form.coupon} onChange={handleChange} className="chk-coupon-input" />
                </div>
                <button type="button" onClick={applyCoupon} className="chk-coupon-btn">Apply</button>
              </div>

              {/* Totals */}
              <div className="chk-totals">
                <div className="chk-total-row">
                  <span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="chk-total-row">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <span style={{ color: "#22a065", fontWeight: 700 }}>Free</span> : `₹${shipping.toFixed(2)}`}</span>
                </div>
                {discount > 0 && (
                  <div className="chk-total-row" style={{ color: "#22a065" }}>
                    <span>Discount {form.coupon && `(${form.coupon.toUpperCase()})`}</span>
                    <span>− ₹{discount.toFixed(2)}</span>
                  </div>
                )}
                {taxDetails.length > 0 && (
                  <div className="chk-tax-block">
                    <p className="chk-tax-heading">Tax Details</p>
                    {taxDetails.map((t, i) => (
                      <div key={i} className="chk-total-row chk-total-row--small">
                        <span>{t.productName} ({t.rate}% {t.name})</span>
                        <span>₹{t.amount.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="chk-divider" />
                <div className="chk-grand-total">
                  <span>Total</span>
                  <span>₹{finalTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <LoginRegisterModal isOpen={showModal} onClose={() => setShowModal(false)}
        onSuccess={() => { setIsLoggedIn(true); setShowModal(false); toast.success("Logged in! Continue checkout."); }} />
    </main>
  );
}