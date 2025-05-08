import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';
import UserHeader from '../Component/UserHeader';
import UserFooter from '../Component/UserFooter';

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
                const token = localStorage.getItem('petOwnerToken');

                // Check authentication
                if (!token) {
                    toast.error('Please login to verify payment');
                    navigate('/login');
                    return;
                }

                // Validate session
                if (!session_id) {
                    toast.error('Invalid payment session');
                    navigate('/cart');
                    return;
                }

                // Handle payment verification
                if (success === 'true') {
                    try {
                        const response = await axios.post(
                            `${backendUrl}/api/order/verify`,
                            { session_id },
                            {
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`
                                }
                            }
                        );

                        if (response.data.success) {
                            // Clear cart first
                            setCartItems({});
                            // Show success message
                            toast.success('Payment successful!');
                            // Navigate to orders page
                            navigate('/orders', { replace: true });
                        } else {
                            throw new Error(response.data.message || 'Payment verification failed');
                        }
                    } catch (error) {
                        console.error('Verification error:', error);
                        toast.error(error.response?.data?.message || 'Payment verification failed');
                        navigate('/cart');
                    }
                } else {
                    toast.error('Payment was cancelled');
                    navigate('/cart');
                }
            } catch (error) {
                console.error('Verification error:', error);
                toast.error('An unexpected error occurred');
                navigate('/cart');
            } finally {
                setVerifying(false);
            }
        };

        verifyPayment();
    }, [location, navigate, backendUrl, setCartItems]);

    if (verifying) {
        return (
            <>
                <UserHeader />
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-center">
                        <h2 className="text-2xl font-semibold mb-4">Verifying Payment...</h2>
                        <p className="text-gray-600">Please wait while we verify your payment.</p>
                    </div>
                </div>
                <UserFooter />
            </>
        );
    }

    return null;
};

export default StoreStripeVerify;