import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';

const StoreStripeVerify = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { backendUrl, setCartItems } = useContext(ShopContext);
    const [verifying, setVerifying] = useState(true);

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                const searchParams = new URLSearchParams(location.search);
                const success = searchParams.get('success');
                const session_id = searchParams.get('session_id');

                if (!session_id) {
                    toast.error('Invalid payment session');
                    navigate('/cart');
                    return;
                }

                if (success === 'true') {
                    const response = await axios.post(
                        `${backendUrl}/api/order/verify`,
                        { session_id },
                        {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }
                    );

                    if (response.data.success) {
                        toast.success('Payment successful!');
                        setCartItems({}); // Clear cart after successful payment
                        navigate('/orders');
                    } else {
                        toast.error('Payment verification failed');
                        navigate('/cart');
                    }
                } else {
                    toast.error('Payment was cancelled');
                    navigate('/cart');
                }
            } catch (error) {
                console.error('Verification error:', error);
                toast.error('Payment verification failed');
                navigate('/cart');
            } finally {
                setVerifying(false);
            }
        };

        verifyPayment();
    }, [location, navigate, backendUrl, setCartItems]);

    if (verifying) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-4">Verifying Payment...</h2>
                    <p className="text-gray-600">Please wait while we verify your payment.</p>
                </div>
            </div>
        );
    }

    return null;
};

export default StoreStripeVerify;