import React, { useRef, useState } from 'react';
import { useResetPassword, useSendResetOtp, useVerifyResetOtp } from '../hooks/useAuth';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const sendOtpMutation = useSendResetOtp();
  const resetMutation = useResetPassword();
  const verifyResetOtpMutation = useVerifyResetOtp()

  // Input handlers
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.value.length === 1 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !e.currentTarget.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').slice(0, 6);
    paste.split('').forEach((char, idx) => {
      if (inputRefs.current[idx]) {
        inputRefs.current[idx]!.value = char;
      }
    });
  };

  // Send OTP
  const sendOtpHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await sendOtpMutation.mutateAsync(email);
      toast.success('OTP sent to your email');
      setStep(2);
    } catch (err: any) {
      const msg = err?.message || 'Failed to send OTP';
      setError(msg);
      toast.error(msg);
    }
  };

  const handleResend = async () => {
    setError('');
    try {
      await sendOtpMutation.mutateAsync(email);
      toast.success('OTP resent to your email');
      if (step === 2) {
        inputRefs.current.forEach((input) => { if (input) input.value = ''; });
      }
    } catch (err: any) {
      const msg = err?.message || 'Failed to resend OTP';
      setError(msg);
      toast.error(msg);
    }
  };

  const verifyOtp = async () => {
    const enteredOtp = inputRefs.current.map((input) => input?.value || '').join('');
    if (enteredOtp.length !== 6) {
      console.log("Email being sent:", email);
      console.log("OTP being sent:", enteredOtp);
      const msg = 'Please enter all 6 digits';
      setError(msg);
      toast.error(msg);
      return;
    }
    try {
      await verifyResetOtpMutation.mutateAsync({ email, otp: enteredOtp })

      toast.success("OTP Verified")
      setOtp(enteredOtp)
      setStep(3)
    } catch (err: any) {
      toast.error("Invalid OTP")
    }
  };

  // Reset password
  const resetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await resetMutation.mutateAsync({ email, otp, newPassword });
      toast.success('Password reset successfully');
      navigate('/login');
    } catch (err: any) {
      const msg = err?.message || 'Password reset failed. Invalid OTP or email.';
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-27 flex flex-col justify-center items-center">
      <div>
        <h1 className="text-2xl font-bold mb-6 text-center"
          style={{ fontFamily: 'LEMONMILK' }}
        >Reset Password</h1>
        {error && <div className="alert alert-error mb-4">{error}</div>}

        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Email"
              className="input input-bordered w-full mb-4"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={sendOtpHandler}
              className="btn btn-primary w-full"
              disabled={sendOtpMutation.isPending}
            >
              {sendOtpMutation.isPending ? 'Sending...' : 'Send OTP'}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="flex gap-2 justify-center mb-6" onPaste={handlePaste}>
              {Array(6).fill(0).map((_, index) => (
                <input
                  key={index}
                  maxLength={1}
                  className="input input-bordered w-12 text-center"
                  ref={(el) => { inputRefs.current[index] = el; }}
                  onChange={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
            </div>
            <button className="btn btn-primary w-full mb-2" onClick={verifyOtp}>
              Verify OTP
            </button>
            <button
              className="text-sm text-primary hover:underline cursor-pointer text-center"
              onClick={handleResend}
              disabled={sendOtpMutation.isPending}
            >
              {sendOtpMutation.isPending ? 'Sending...' : 'Resend Code'}
            </button>
          </>
        )}

        {step === 3 && (
          <form onSubmit={resetPasswordSubmit}>
            <input
              type="password"
              placeholder="New Password"
              className="input input-bordered w-full mb-4"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              type="submit"
              className="btn btn-primary w-full mb-2"
              disabled={resetMutation.isPending}
            >
              {resetMutation.isPending ? 'Resetting...' : 'Reset Password'}
            </button>
            <div className="text-center mt-2">
              <button
                type="button"
                onClick={handleResend}
                className="text-sm text-primary hover:underline cursor-pointer"
                disabled={sendOtpMutation.isPending}
              >
                {sendOtpMutation.isPending ? 'Sending...' : 'Resend Code'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;