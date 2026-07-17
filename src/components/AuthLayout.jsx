import React from "react";

export default function AuthLayout({ icon: Icon, title, subtitle, footer, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      <div className="cathedral-bg" />
      <div className="w-full max-w-md relative">
        <div className="cathedral-panel p-6 sm:p-8">
          {/* Title — crimson arch with wax seal */}
          <div className="flex items-stretch gap-0 mb-6">
            <div className="flex items-center pl-1 pr-3">
              <div className="w-11 h-11 rounded-full wax-seal flex items-center justify-center shrink-0 ring-2 ring-[#3a0808] candle-glow">
                <Icon className="w-5 h-5 text-amber-50" strokeWidth={1.4} aria-hidden="true" />
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center crimson-arch py-2.5 px-4">
              <h1 className="font-heading font-700 text-lg sm:text-xl tracking-[0.1em] text-[#d4af37] text-center leading-tight">{title}</h1>
              {subtitle && <p className="text-[11px] text-[#e5d3b3]/50 font-tome italic mt-0.5 text-center">{subtitle}</p>}
            </div>
          </div>
          {children}
        </div>
        {footer && (
          <div className="gothic-inset mt-4 py-2.5 px-4 text-center">
            <p className="text-sm text-[#e5d3b3]/50 font-body">{footer}</p>
          </div>
        )}
      </div>
    </div>
  );
}