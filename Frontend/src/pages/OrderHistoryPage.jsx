import { useState, useEffect } from 'react';
import { useOrder } from '../context/OrderContext';
import { Link } from 'react-router-dom';

const OrderHistoryPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { getMyOrders } = useOrder();

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            const result = await getMyOrders();
            if (result.success) {
                setOrders(result.orders);
            }
            setLoading(false);
        };
        fetchOrders();
    }, [getMyOrders]);

    if (loading) {
        return <div className="min-h-screen bg-black text-white flex items-center justify-center">Fetching Your Order History...</div>;
    }

    if (orders.length === 0) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center text-center pt-24 px-4">
                <h1 className="text-5xl font-primary tracking-widest">NO ORDERS FOUND</h1>
                <p className="text-gray-400 mt-4">You haven't placed any orders yet. Let's change that.</p>
                <Link to="/" className="mt-8 bg-brand-accent text-white font-bold py-3 px-8 rounded-md hover:bg-opacity-80 transition-all">
                    START SHOPPING
                </Link>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-black text-white pt-40 pb-20 px-4">
            <div className="container mx-auto">
                <h1 className="text-5xl font-primary tracking-widest text-center uppercase mb-12">Order History</h1>
                <div className="space-y-6 max-w-4xl mx-auto">
                    {orders.map(order => (
                        <div key={order._id} className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
                            <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-700">
                                <div>
                                    <h2 className="font-bold text-lg">Order ID: <span className="text-gray-400 font-mono text-sm">{order._id}</span></h2>
                                    <p className="text-sm text-gray-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className={`px-3 py-1 text-sm rounded-full ${order.orderStatus === 'Delivered' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                    {order.orderStatus}
                                </div>
                            </div>
                            <div className="space-y-3 mb-4">
                                {order.orderItems.map(item => (
                                    <div key={item.product} className="flex items-center space-x-4">
                                        <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded-md"/>
                                        <div>
                                            <p className="font-semibold">{item.name}</p>
                                            <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                             <div className="text-right font-bold text-xl border-t border-gray-700 pt-4">
                                Total: ${order.totalPrice.toFixed(2)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OrderHistoryPage;