'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { UserCircle, Box, Settings, XCircle, RefreshCw, PackageX } from "lucide-react";
import { FileText, Truck } from "lucide-react";
import Link from "next/link";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface User {
  name: string;
  email: string;
  phone: string;
}

interface OrderItem {
  product_name: string;
  quantity: number;
}

interface Order {
  id: number;
  order_number: string;
  date: string;
  items: OrderItem[];
  total: number;
  payment_status: string;
  status: string;
}

interface ReturnRequest {
  id: number;
  order_id: number;
  type: string;
  reason: string;
  status: string;
  created_at: string;
  order: {
    order_number: string;
    total_amount: number;
  };
}

export default function CustomerDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Returns state
  const [selectedOrder, setSelectedOrder] = useState("");
  const [reason, setReason] = useState("");
  const [userRequests, setUserRequests] = useState<ReturnRequest[]>([]);
  const [requestType, setRequestType] = useState("return");

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Fetch user profile
  useEffect(() => {
    if (!token) {
      toast.error("Please login first!");
      router.push("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`${BASE_URL}profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }

        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();
        setUser(data.user);
        setNewEmail(data.user.email || "");
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An error occurred";
        toast.error(errorMessage);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router, token]);

  // Fetch orders
  useEffect(() => {
    if (activeTab !== "orders" && activeTab !== "returns") return;

    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        const res = await fetch(`${BASE_URL}orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }

        if (!res.ok) throw new Error("Failed to fetch orders");

        const data = await res.json();
        setOrders(data.orders);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An error occurred";
        toast.error(errorMessage);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [activeTab, token, router]);

  // Fetch user requests
  const fetchUserRequests = async () => {
    try {
      const res = await fetch(`${BASE_URL}returns`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setUserRequests(data.returns);
    } catch (err) {
      console.log("Failed to fetch requests", err);
    }
  };

  useEffect(() => {
    if (activeTab === "returns") fetchUserRequests();
  }, [activeTab]);

  const validateSettings = () => {
    const newErrors: Record<string, string> = {};
    if (!user?.name.trim()) newErrors.name = "Full name is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,15}$/;

    if (!user?.phone?.trim()) newErrors.phone = "Phone number is required";
    else if (!phoneRegex.test(user.phone)) newErrors.phone = "Enter a valid phone number";

    if (!newEmail.trim()) newErrors.email = "Email is required";
    else if (!emailRegex.test(newEmail)) newErrors.email = "Enter a valid email address";

    if (newPassword && newPassword.length < 6) newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateSettings = async () => {
    if (!validateSettings()) return;

    try {
      const res = await fetch(`${BASE_URL}settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: user?.name,
          email: newEmail,
          phone: user?.phone,
          password: newPassword,
          password_confirmation: newPassword,
        }),
      });

      if (res.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update settings");

      setUser(data.user);
      toast.success("Profile updated successfully!");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      toast.error(errorMessage);
    }
  };

  const handleSubmitRequest = async () => {
    if (!selectedOrder) {
      toast.error("Please select an order");
      return;
    }
    if (!reason.trim()) {
      toast.error(`Please provide a reason for ${requestType}`);
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}${requestType}-request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          order_id: selectedOrder,
          reason: reason,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to submit request");

      toast.success(data.message || `${requestType} request submitted successfully!`);
      
      setSelectedOrder("");
      setReason("");
      fetchUserRequests();
      
      // Refresh orders to update status
      const ordersRes = await fetch(`${BASE_URL}orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const ordersData = await ordersRes.json();
      setOrders(ordersData.orders);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      toast.error(errorMessage);
    }
  };

  const getOrderActionButtons = (order: Order) => {
    const status = order.status.toLowerCase();
    
    // Check if there's already a pending/approved request for this order
    const existingRequest = userRequests.find(
      req => req.order_id === order.id && ['pending', 'approved'].includes(req.status)
    );

    if (existingRequest) {
      return (
        <span className="text-xs text-gray-500 italic">
          {existingRequest.type} request {existingRequest.status}
        </span>
      );
    }

    // Show cancel button for pending/processing orders
    if (['pending', 'processing'].includes(status)) {
      return (
        <button
          onClick={() => {
            setSelectedOrder(order.id.toString());
            setRequestType('cancel');
            setActiveTab('returns');
          }}
          className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition text-sm flex items-center gap-1"
        >
          <XCircle size={14} />
          Cancel
        </button>
      );
    }

    // Show return button for completed/delivered orders
    if (['completed', 'delivered'].includes(status)) {
      return (
        <button
          onClick={() => {
            setSelectedOrder(order.id.toString());
            setRequestType('return');
            setActiveTab('returns');
          }}
          className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition text-sm flex items-center gap-1"
        >
          <RefreshCw size={14} />
          Return
        </button>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500 text-lg">Loading your dashboard...</p>
      </div>
    );
  }

  if (!user) return null;

  const menuItems = [
    { label: "Profile", icon: UserCircle, tab: "profile" },
    { label: "Orders", icon: Box, tab: "orders" },
    { label: "Settings", icon: Settings, tab: "settings" },
    { label: "Returns & Refunds", icon: PackageX, tab: "returns" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col lg:flex-row justify-center py-6 px-4 gap-6 lg:gap-0">
      {/* Sidebar */}
      <aside className="w-full lg:w-72 bg-[#0d3b2e] text-white flex flex-col shadow-lg rounded-xl lg:rounded-l-xl">
        <div className="text-2xl lg:text-3xl font-bold p-6 border-b border-white/20">My Dashboard</div>
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.tab}
                onClick={() => setActiveTab(item.tab)}
                className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeTab === item.tab ? "bg-white/25 font-semibold shadow-lg" : "hover:bg-white/10"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-md lg:text-lg text-white cusDashboardTab">{item.label}</span>
              </button>
            );
          })}
        </nav>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            router.push("/login");
          }}
          className="m-4 mt-auto bg-red-500 text-white px-5 py-3 rounded-lg hover:bg-red-600 transition font-semibold"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-8">
        <h1 className="text-2xl lg:text-3xl font-bold mb-4 lg:mb-6 text-gray-800 capitalize">{activeTab}</h1>
        <div className="flex justify-center">
          <div className="w-full max-w-5xl">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="bg-white shadow-xl rounded-3xl p-6 lg:p-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Profile Information</h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#0d3b2e] focus:ring-2 focus:ring-[#0d3b2e]/20 outline-none transition-all"
                  />
                  <input
                    type="text"
                    placeholder="Phone"
                    value={user.phone}
                    onChange={(e) => setUser({ ...user, phone: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#0d3b2e] focus:ring-2 focus:ring-[#0d3b2e]/20 outline-none transition-all"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={user.email}
                    disabled
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-gray-100 cursor-not-allowed"
                  />
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="bg-white shadow-xl rounded-3xl p-4 lg:p-6">
                <h2 className="text-xl lg:text-2xl font-bold mb-4 text-gray-800">My Orders</h2>

                {loadingOrders ? (
                  <p className="text-gray-500">Loading orders...</p>
                ) : orders.length === 0 ? (
                  <p className="text-gray-500">No orders found.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm border border-gray-200 rounded-xl">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left font-semibold text-gray-700">Order #</th>
                          <th className="px-3 py-2 text-left font-semibold text-gray-700">Date</th>
                          <th className="px-3 py-2 text-left font-semibold text-gray-700">Products</th>
                          <th className="px-3 py-2 text-left font-semibold text-gray-700">Total</th>
                          <th className="px-3 py-2 text-left font-semibold text-gray-700">Payment</th>
                          <th className="px-3 py-2 text-left font-semibold text-gray-700">Status</th>
                          <th className="px-3 py-2 text-left font-semibold text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((o) => (
                          <tr key={o.id} className="border-b last:border-b-0 hover:bg-gray-50 transition">
                            <td className="px-3 py-2 font-medium">#{o.order_number}</td>
                            <td className="px-3 py-2 text-gray-500">{new Date(o.date).toLocaleDateString()}</td>
                            <td className="px-3 py-2">
                              {o.items.map((item, idx) => {
                                const shortName = item.product_name.length > 35
                                  ? item.product_name.slice(0, 20) + "..."
                                  : item.product_name;
                                const slug = item.product_name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
                                return (
                                  <div key={idx} className="mb-1">
                                    <Link
                                      href={`/product/${slug}`}
                                      className="text-blue-600 hover:underline font-medium"
                                    >
                                      - {shortName} x{item.quantity}
                                    </Link>
                                  </div>
                                );
                              })}
                            </td>
                            <td className="px-3 py-2 font-medium">₹{o.total}</td>
                            <td className={`px-3 py-2 font-semibold ${
                              o.payment_status === "paid" ? "text-green-600" : "text-yellow-600"
                            }`}>{o.payment_status}</td>
                            <td className={`px-3 py-2 font-semibold ${
                              o.status === "pending" ? "text-yellow-600" :
                              o.status === "completed" ? "text-green-600" :
                              o.status === "cancelled" ? "text-red-600" :
                              "text-blue-600"
                            }`}>{o.status}</td>
                            <td className="px-3 py-2">
                              <div className="flex flex-row gap-2 items-center">
                                <div className="relative group">
                                  <a
                                    href={`/invoice/${o.order_number}`}
                                    target="_blank"
                                    className="bg-green-600 text-white p-2 rounded-xl hover:bg-green-700 transition flex items-center justify-center"
                                  >
                                    <FileText size={18} />
                                  </a>
                                  <span className="orderButtonsLink absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all bg-[#0d3b2e] text-white text-xs px-3 py-1 rounded-lg shadow-lg whitespace-nowrap font-medium">
                                    Download Invoice
                                  </span>
                                </div>

                                <div className="relative group">
                                  <a
                                    href={`/track-order/${o.order_number}`}
                                    className="bg-[#0d3b2e] text-white p-2 rounded-xl hover:bg-[#0d3b2e]/90 transition flex items-center justify-center"
                                  >
                                    <Truck size={18} />
                                  </a>
                                  <span className="orderButtonsLink absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all bg-[#0d3b2e] text-white text-xs px-3 py-1 rounded-lg shadow-lg whitespace-nowrap font-medium">
                                    Track Order
                                  </span>
                                </div>

                                {getOrderActionButtons(o)}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="bg-white shadow-xl rounded-3xl p-6 lg:p-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Account Settings</h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#0d3b2e] focus:ring-2 focus:ring-[#0d3b2e]/20 outline-none transition-all"
                  />
                  <input
                    type="text"
                    placeholder="Phone"
                    value={user.phone}
                    onChange={(e) => setUser({ ...user, phone: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#0d3b2e] focus:ring-2 focus:ring-[#0d3b2e]/20 outline-none transition-all"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#0d3b2e] focus:ring-2 focus:ring-[#0d3b2e]/20 outline-none transition-all"
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#0d3b2e] focus:ring-2 focus:ring-[#0d3b2e]/20 outline-none transition-all"
                  />
                  <button
                    onClick={handleUpdateSettings}
                    className="w-full sm:w-auto bg-[#0d3b2e] text-white py-3 px-8 rounded-xl hover:bg-[#0d3b2e]/90 transition-all shadow-lg shadow-[#0d3b2e]/20 hover:shadow-xl font-semibold"
                  >
                    Update Settings
                  </button>
                </div>
              </div>
            )}

            {/* Returns & Refunds Tab */}
            {activeTab === "returns" && (
              <div className="bg-white shadow-xl rounded-3xl p-6 lg:p-10 flex flex-col gap-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Manage Returns, Refunds & Cancellations</h2>

                <div className="flex gap-4 mb-6 flex-wrap">
                  <button
                    onClick={() => setRequestType("cancel")}
                    className={`px-4 py-2 rounded-xl font-semibold transition flex items-center gap-2 ${
                      requestType === "cancel" ? "bg-red-600 text-white shadow-lg" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    <XCircle size={18} />
                    Cancel Order
                  </button>
                  <button
                    onClick={() => setRequestType("return")}
                    className={`px-4 py-2 rounded-xl font-semibold transition flex items-center gap-2 ${
                      requestType === "return" ? "bg-blue-600 text-white shadow-lg" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    <RefreshCw size={18} />
                    Return
                  </button>
                  <button
                    onClick={() => setRequestType("refund")}
                    className={`px-4 py-2 rounded-xl font-semibold transition flex items-center gap-2 ${
                      requestType === "refund" ? "bg-green-600 text-white shadow-lg" : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    <PackageX size={18} />
                    Refund
                  </button>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    {requestType === "cancel" && "You can only cancel orders that are pending or in processing."}
                    {requestType === "return" && "Returns are available for completed/delivered orders within 30 days."}
                    {requestType === "refund" && "Refund requests can be made for paid orders."}
                  </p>
                </div>

                {/* Submit New Request Form */}
                <div className="bg-gradient-to-br from-[#0d3b2e]/5 to-white rounded-xl p-6 border border-[#0d3b2e]/20 shadow-md">
                  <h3 className="text-xl font-bold text-slate-900 mb-6">
                    Submit {requestType.charAt(0).toUpperCase() + requestType.slice(1)} Request
                  </h3>

                  <div className="space-y-4">
                    <select
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#0d3b2e] focus:ring-2 focus:ring-[#0d3b2e]/20 outline-none transition-all"
                      value={selectedOrder}
                      onChange={(e) => setSelectedOrder(e.target.value)}
                    >
                      <option value="">Select Order</option>
                      {orders
                        .filter(o => {
                          // Filter orders based on request type
                          if (requestType === 'cancel') return ['pending', 'processing'].includes(o.status);
                          if (requestType === 'return') return ['completed', 'delivered'].includes(o.status);
                          if (requestType === 'refund') return o.payment_status === 'paid';
                          return true;
                        })
                        .map((o) => (
                          <option key={o.id} value={o.id}>
                            #{o.order_number} - ₹{o.total} ({o.status})
                          </option>
                        ))}
                    </select>

                    <textarea
                      placeholder={`Reason for ${requestType}`}
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-[#0d3b2e] focus:ring-2 focus:ring-[#0d3b2e]/20 outline-none transition-all resize-none"
                      rows={5}
                    />

                    <button
                      onClick={handleSubmitRequest}
                      className="w-full sm:w-auto bg-[#0d3b2e] text-white py-3 px-8 rounded-xl hover:bg-[#0d3b2e]/90 transition-all shadow-lg shadow-[#0d3b2e]/20 hover:shadow-xl font-semibold"
                    >
                      Submit {requestType.charAt(0).toUpperCase() + requestType.slice(1)} Request
                    </button>
                  </div>
                </div>

                {/* Display Existing Requests */}
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">All Requests</h3>
                  {userRequests.length === 0 ? (
                    <p className="text-gray-500">No requests found.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full border border-gray-200 rounded-xl text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Order #</th>
                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Type</th>
                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Reason</th>
                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Total</th>
                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Status</th>
                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {userRequests.map((r) => (
                            <tr key={r.id} className="border-b last:border-b-0 hover:bg-gray-50 transition">
                              <td className="px-4 py-2 font-medium">#{r.order.order_number}</td>
                              <td className="px-4 py-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  r.type === 'cancel' ? 'bg-red-100 text-red-700' :
                                  r.type === 'return' ? 'bg-blue-100 text-blue-700' :
                                  'bg-green-100 text-green-700'
                                }`}>
                                  {r.type}
                                </span>
                              </td>
                              <td className="px-4 py-2 max-w-xs truncate">{r.reason}</td>
                              <td className="px-4 py-2 font-bold">₹{r.order.total_amount}</td>
                              <td className="px-4 py-2">
                                <span
                                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    r.status === "pending"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : r.status === "approved"
                                      ? "bg-green-100 text-green-700"
                                      : "bg-red-100 text-red-700"
                                  }`}
                                >
                                  {r.status}
                                </span>
                              </td>
                              <td className="px-4 py-2">{new Date(r.created_at).toLocaleDateString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}