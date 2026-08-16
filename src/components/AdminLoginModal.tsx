import React, { useState } from 'react';
import { Lock, KeyRound, X, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default secret code: 1234 or admin
    if (pin === '1234' || pin.toLowerCase() === 'admin' || pin === '0000') {
      setError('');
      setPin('');
      onLoginSuccess();
      onClose();
    } else {
      setError('الرمز السري غير صحيح. الرمز الافتراضي للتجربة هو: 1234');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl border border-[#d8cfbe] shadow-2xl max-w-sm w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute left-4 top-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-3">
          <div className="w-14 h-14 bg-[#1b2a22] text-[#d8af56] rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-7 h-7" />
          </div>

          <div>
            <h3 className="text-lg font-black text-[#1b2a22] font-['Cairo']">
              لوحة تحكم صاحب المتجر
            </h3>
            <p className="text-xs text-stone-500 font-medium mt-1">
              هذه اللوحة خاصة بك فقط لإضافة صور الأقمشة، تعديل الأسعار، ومتابعة المخزون
            </p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-700">
              أدخل الرمز السري للإدارة (PIN):
            </label>
            <div className="relative">
              <input
                type="password"
                required
                autoFocus
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError('');
                }}
                placeholder="الرمز السري (الافتراضي: 1234)"
                className="w-full bg-[#fbf9f5] border border-stone-300 focus:border-[#c6923b] rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-center tracking-widest outline-none"
              />
              <KeyRound className="w-4 h-4 text-stone-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
            {error && (
              <div className="flex items-center gap-1 text-[11px] text-red-600 font-bold mt-1 bg-red-50 p-2 rounded-lg border border-red-100">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#c6923b] hover:bg-[#b58331] text-stone-950 font-black rounded-xl text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>تسجيل الدخول كمدير المتجر</span>
          </button>

          <div className="text-center pt-2">
            <span className="text-[11px] text-stone-400">
              الرمز السري الافتراضي للمعاينة: <strong className="text-stone-700 font-mono">1234</strong>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};
