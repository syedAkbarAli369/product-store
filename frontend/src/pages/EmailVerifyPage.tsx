import { useNavigate } from 'react-router';
import { useSendVerifyOtp, useVerifyEmail } from '../hooks/useAuth';
import { useAuthContext } from '../context/AuthContext';
import React, { useRef, useState } from 'react';
import { toast } from 'react-toastify'

const EmailVerifyPage = () => {
  const navigate = useNavigate();
  const { checkAuth } = useAuthContext();
  const sendOtpMutation = useSendVerifyOtp();
  const verifyMutation = useVerifyEmail();

  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const inputRef = useRef<(HTMLInputElement | null)[]>([]);

  // Handlers for OTP input fields
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.value.length === 1 && index < inputRef.current.length - 1) {
      inputRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !e.currentTarget.value && index > 0) {
      inputRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').slice(0, 6);
    const pasteArray = paste.split('');
    pasteArray.forEach((char, idx) => {
      if (inputRef.current[idx]) {
        inputRef.current[idx]!.value = char;
      }
    });
    const nextEmpty = pasteArray.length < 6 ? pasteArray.length : 5;
    inputRef.current[nextEmpty]?.focus();
  };

  // Manually request OTP
  const handleRequestOtp = async () => {
    setIsSending(true);
    setError(null);
    try {
      await sendOtpMutation.mutateAsync();
      toast.success("Verification code sent to your email")
      setOtpSent(true);
    } catch (err: any) {
      setError(err?.message || 'Failed to send OTP. Try again.');
      toast.error(err)
    } finally {
      setIsSending(false);
    }
  };

  // Verify OTP
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otp = inputRef.current.map((input) => input?.value || '').join('');
    if (otp.length !== 6) {
      const msg = "Please enter the 6 digit code"
      setError(msg)
      toast.error(msg)
      return;
    }
    setIsVerifying(true);
    try {
      await verifyMutation.mutateAsync(otp);
      toast.success("Email Verified Successfully")
      await checkAuth();
      navigate('/');
    } catch (err: any) {
      const msg = err?.message || 'Verification failed. Invalid code?'
      setError(msg)
      toast.error(msg);
    } finally {
      setIsVerifying(false);
    }
  };

  // Resend OTP (same as request)
  const handleResend = async () => {
    setIsSending(true);
    setError(null);
    try {
      await sendOtpMutation.mutateAsync();
      toast.success("Verification code resent")
      // keep otpSent true, just show a small success message
    } catch (err: any) {
      const msg = err?.message || 'Failed to resend OTP'
      setError(msg);
      toast.error(msg)
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-27 flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: 'LEMONMILK' }}>Verify Email</h1>

      {!otpSent ? (
        // Step 1: Request OTP button
        <div className="text-center">
          <button
            onClick={handleRequestOtp}
            className="btn btn-primary"
            disabled={isSending}
          >
            {isSending ? 'Sending...' : 'Send Verification Code'}
          </button>
          {error && <p className="text-error mt-2">{error}</p>}
        </div>
      ) : (
        // Step 2: OTP input form
        <form onSubmit={handleSubmit} onPaste={handlePaste}>
          <p className="text-center text-sm text-base-content/70 mb-4">
            We've sent a 6 digit code to your email.
          </p>
          <div className="flex gap-2 justify-center mb-6">
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  className="input input-bordered w-12 text-center"
                  ref={(el) => {
                    if (el) inputRef.current[index] = el;
                  }}
                  onChange={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
          </div>
          {error && <p className="text-error text-center mb-2">{error}</p>}
          <button
            className="btn btn-primary w-full"
            type="submit"
            disabled={isVerifying}
          >
            {isVerifying ? 'Verifying...' : 'Verify Email'}
          </button>
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={handleResend}
              className="text-sm text-primary hover:underline cursor-pointer"
              disabled={isSending}
            >
              {isSending ? 'Sending...' : 'Resend Code'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EmailVerifyPage;