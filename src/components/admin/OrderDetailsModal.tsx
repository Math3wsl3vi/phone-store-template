import { X, Package, User, MapPin, CreditCard, Calendar, AlertCircle } from 'lucide-react';
import { Order } from '../../store/adminStore';

interface OrderDetailsModalProps {
  order: Order | null;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: Order['status']) => void;
  loading?: boolean;
}

export function OrderDetailsModal({ order, onClose, onUpdateStatus, loading = false }: OrderDetailsModalProps) {
  if (!order) return null;

  // Safe access to order properties with fallbacks
  const orderItems = order.items || [];
  const shippingAddress = order.shipping_address || {};
  const customerName = order.customer_name || 'Unknown Customer';
  const customerEmail = order.customer_email || 'No email provided';
  const customerPhone = order.customer_phone || 'No phone provided';
  const paymentMethod = order.payment_method || 'Unknown';
  const totalAmount = order.total_amount || 0;

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: Order['payment_status']) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Format dates safely
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Unknown';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Invalid Date';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">Order Details</h2>
            <p className="text-gray-600 text-sm">Order #{order.id.slice(-8).toUpperCase()}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Status & Actions */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.payment_status)}`}>
                  Payment: {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                </span>
              </div>
              <select
                value={order.status}
                onChange={(e) => onUpdateStatus(order.id, e.target.value as Order['status'])}
                disabled={loading}
                className="bg-white border border-gray-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="w-5 h-5" />
                Customer Information
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div>
                  <p className="font-medium text-gray-900">{customerName}</p>
                  <p className="text-gray-600">{customerEmail}</p>
                  <p className="text-gray-600">{customerPhone}</p>
                </div>
              </div>

              {/* Shipping Address */}
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Shipping Address
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-900">
                  {shippingAddress.address || 'No address provided'}
                </p>
              </div>

              {/* Order Information */}
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Order Information
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Date:</span>
                  <span className="font-medium">
                    {formatDate(order.created_at)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium">
                    {paymentMethod.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="font-medium">
                    {formatDate(order.updated_at || order.created_at)}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order Items ({orderItems.length})
              </h3>
              
              {orderItems.length === 0 ? (
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <AlertCircle className="w-5 h-5" />
                    <p>No order items found for this order.</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {orderItems.map((item, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex gap-4">
                          {item.product_image ? (
                            <img
                              src={item.product_image}
                              alt={item.product_name || 'Product image'}
                              className="w-16 h-16 object-cover rounded-lg"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64?text=No+Image';
                              }}
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                              <Package className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {item.product_name || 'Unknown Product'}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Quantity: {item.quantity || 0}
                            </p>
                            <p className="text-sm text-gray-600">
                              Unit Price: Ksh {(item.unit_price || 0).toLocaleString()}
                            </p>
                            <p className="font-medium text-gray-900">
                              Subtotal: Ksh {((item.unit_price || 0) * (item.quantity || 0)).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Order Summary
                    </h3>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">
                        Ksh {totalAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping:</span>
                      <span className="font-medium">Free</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-200 pt-2">
                      <span className="text-lg font-semibold">Total:</span>
                      <span className="text-lg font-semibold">
                        Ksh {totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Print Order
          </button>
        </div>
      </div>
    </div>
  );
}