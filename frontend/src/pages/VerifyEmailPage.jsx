import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { resendEmailOtp, verifyEmailOtp } from "../lib/api";
import toast from "react-hot-toast";

const VerifyEmailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialEmail = (location.state && location.state.email) || "";

  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!email || !code) return;
    try {
      setIsSubmitting(true);
      await verifyEmailOtp({ email, code });
      toast.success("Email verified. Welcome!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error("Enter your email to resend code");
      return;
    }
    try {
      setIsResending(true);
      await resendEmailOtp({ email });
      toast.success("OTP resent to your email");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-base-100 border border-base-300 rounded-xl p-6 shadow">
        <h1 className="text-2xl font-semibold mb-2">Verify your email</h1>
        <p className="text-sm opacity-70 mb-4">Enter the 6-digit code sent to your email.</p>

        <form onSubmit={handleVerify} className="space-y-4">
          <div className="form-control">
            <label className="label"><span className="label-text">Email</span></label>
            <input
              type="email"
              className="input input-bordered w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-control">
            <label className="label"><span className="label-text">OTP Code</span></label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              className="input input-bordered w-full tracking-widest text-center"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              placeholder="______"
              required
            />
          </div>

          <button className="btn btn-primary w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? <span className="loading loading-spinner loading-xs" /> : "Verify"}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm opacity-70">Didn't receive the code?</span>
          <button className="btn btn-ghost btn-sm" onClick={handleResend} disabled={isResending}>
            {isResending ? <span className="loading loading-spinner loading-xs" /> : "Resend"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;


