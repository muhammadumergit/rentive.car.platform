import React from 'react'
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
    const { setShowForgotPassword, axios } = useAppContext()
    
    const [step, setStep] = React.useState(1); // 1: email, 2: otp, 3: new password
    const [email, setEmail] = React.useState("");
    const [otp, setOtp] = React.useState("");
    const [newPassword, setNewPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    // Step 1: Request OTP
    const handleRequestOTP = async (event) => {
        try {
            event.preventDefault();
            setLoading(true);
            const { data } = await axios.post('/api/user/forgot-password', { email });

            if (data.success) {
                toast.success(data.message || 'OTP sent to your email');
                setStep(2);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    }

    // Step 2: Verify OTP
    const handleVerifyOTP = async (event) => {
        try {
            event.preventDefault();
            setLoading(true);
            const { data } = await axios.post('/api/user/verify-otp', { email, otp });

            if (data.success) {
                toast.success('OTP verified successfully');
                setStep(3);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    }

    // Step 3: Reset Password
    const handleResetPassword = async (event) => {
        try {
            event.preventDefault();
            
            if (newPassword.length < 8) {
                return toast.error('Password must be at least 8 characters');
            }
            
            if (newPassword !== confirmPassword) {
                return toast.error('Passwords do not match');
            }

            setLoading(true);
            const { data } = await axios.post('/api/user/reset-password', { 
                email, 
                otp, 
                newPassword 
            });

            if (data.success) {
                toast.success('Password reset successfully');
                setShowForgotPassword(false);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div 
            onClick={() => setShowForgotPassword(false)} 
            className='fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center text-sm text-gray-600 bg-black/50'
        >
            <form 
                onSubmit={
                    step === 1 ? handleRequestOTP : 
                    step === 2 ? handleVerifyOTP : 
                    handleResetPassword
                } 
                onClick={(e) => e.stopPropagation()} 
                className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white"
            >
                <p className="text-2xl font-medium m-auto">
                    <span className="text-primary">Forgot</span> Password
                </p>

                {/* Step 1: Enter Email */}
                {step === 1 && (
                    <>
                        <p className="text-sm text-gray-500 text-center">
                            Enter your email address and we'll send you an OTP to reset your password
                        </p>
                        <div className="w-full">
                            <p>Email</p>
                            <input 
                                onChange={(e) => setEmail(e.target.value)} 
                                value={email} 
                                placeholder="your@email.com" 
                                className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" 
                                type="email" 
                                required 
                            />
                        </div>
                        <button 
                            disabled={loading}
                            className="bg-primary hover:bg-blue-800 transition-all text-white w-full py-2 rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Sending...' : 'Send OTP'}
                        </button>
                    </>
                )}

                {/* Step 2: Enter OTP */}
                {step === 2 && (
                    <>
                        <p className="text-sm text-gray-500 text-center">
                            Enter the 6-digit OTP sent to {email}
                        </p>
                        <div className="w-full">
                            <p>OTP Code</p>
                            <input 
                                onChange={(e) => setOtp(e.target.value)} 
                                value={otp} 
                                placeholder="123456" 
                                className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary tracking-widest text-center text-lg" 
                                type="text" 
                                maxLength="6"
                                required 
                            />
                        </div>
                        <button 
                            disabled={loading}
                            className="bg-primary hover:bg-blue-800 transition-all text-white w-full py-2 rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                        <p className="text-xs text-center w-full">
                            Didn't receive code? 
                            <span 
                                onClick={() => setStep(1)} 
                                className="text-primary cursor-pointer ml-1"
                            >
                                Resend
                            </span>
                        </p>
                    </>
                )}

                {/* Step 3: Reset Password */}
                {step === 3 && (
                    <>
                        <p className="text-sm text-gray-500 text-center">
                            Enter your new password
                        </p>
                        <div className="w-full">
                            <p>New Password</p>
                            <input 
                                onChange={(e) => setNewPassword(e.target.value)} 
                                value={newPassword} 
                                placeholder="minimum 8 characters" 
                                className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" 
                                type="password" 
                                required 
                            />
                        </div>
                        <div className="w-full">
                            <p>Confirm Password</p>
                            <input 
                                onChange={(e) => setConfirmPassword(e.target.value)} 
                                value={confirmPassword} 
                                placeholder="re-enter password" 
                                className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" 
                                type="password" 
                                required 
                            />
                        </div>
                        <button 
                            disabled={loading}
                            className="bg-primary hover:bg-blue-800 transition-all text-white w-full py-2 rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </>
                )}

                <p className="text-xs text-center w-full">
                    Remember your password? 
                    <span 
                        onClick={() => setShowForgotPassword(false)} 
                        className="text-primary cursor-pointer ml-1"
                    >
                        Back to login
                    </span>
                </p>
            </form>
        </div>
    )
}

export default ForgotPassword