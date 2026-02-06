"use client";
import { useActionState, useEffect, useRef, useState } from "react";
import { submitContact } from "./contactAction";
import ArrowSvg from "@/app/_components/ArrowSvg";

const initialState = { success: false, error: null as string | null };

const inputCls =
  "w-full bg-transparent border-0 border-b border-white/15 focus:border-white/40 text-white placeholder:text-white/30 py-3 px-0 text-sm md:text-base outline-none transition-colors duration-300";

const labelCls =
  "block text-xs tracking-[0.08em] uppercase font-medium text-white/50 mb-2";

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContact, initialState);
  const [referrer, setReferrer] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    setReferrer(document.referrer);
  }, []);

  if (state.success) {
    return (
      <div>
        <h2 className="text-3xl md:text-4xl font-medium mb-4">Message Sent!</h2>
        <p className="text-sm md:text-base text-white/70 leading-relaxed mb-4">
          Thanks for reaching out. Our team will get in touch with you as soon
          as possible to discuss your project.
        </p>
        <p className="text-sm text-white/50">
          In the meantime, you can take a look at our{" "}
          <a href="/work" className="text-white underline hover:text-[#FF3322]">work</a> and our{" "}
          <a href="/news" className="text-white underline hover:text-[#FF3322]">news and insights</a> to get
          to know us a little better.
        </p>
      </div>
    );
  }

  return (
    <div data-reveal="fade">
      <form ref={formRef} action={formAction} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="full_name" className={labelCls}>Full Name</label>
            <input
              className={inputCls}
              maxLength={256}
              name="full_name"
              placeholder="Ben Mark"
              type="text"
              id="full_name"
              required
            />
          </div>
          <div>
            <label htmlFor="company" className={labelCls}>Company</label>
            <input
              className={inputCls}
              maxLength={256}
              name="company"
              placeholder="Rocketship"
              type="text"
              id="company"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className={labelCls}>Email address</label>
          <input
            className={inputCls}
            maxLength={256}
            name="email"
            placeholder="ben@rocketship.com"
            type="email"
            id="email"
            required
          />
        </div>

        <div>
          <label htmlFor="budget" className={labelCls}>Your budget</label>
          <select
            id="budget"
            name="budget"
            className={`${inputCls} appearance-none`}
          >
            <option value="">Select one...</option>
            <option value="5000">$5k–$15k (Single automation or bot)</option>
            <option value="15000">$15k–$40k (Multi-system integration)</option>
            <option value="40000">$40k–$80k (Full AI infrastructure)</option>
            <option value="80000">$80k–$150k (Enterprise transformation)</option>
            <option value="150000">$150k+ (Ongoing AI partnership)</option>
          </select>
        </div>

        {/* Honeypot — hidden from real users */}
        <div className="absolute -left-[9999px] opacity-0 h-0 overflow-hidden" aria-hidden="true">
          <label htmlFor="Phone" className={labelCls}>Phone</label>
          <input
            className={inputCls}
            autoComplete="one-time-code"
            maxLength={256}
            name="Phone"
            placeholder="111 1111 1111"
            type="tel"
            id="Phone"
            tabIndex={-1}
          />
        </div>

        <div>
          <label htmlFor="notes" className={labelCls}>Message</label>
          <textarea
            className={`${inputCls} min-h-[120px] resize-y`}
            maxLength={5000}
            name="notes"
            placeholder="Tell us about your project"
            id="notes"
            required
          />
        </div>

        <input name="referrer" type="hidden" value={referrer} />

        <button
          type="submit"
          disabled={isPending}
          className="group relative inline-flex items-center gap-3 pb-2 text-sm md:text-base text-white/90 hover:text-[#FF0000] transition-colors bg-transparent border-0 cursor-pointer w-fit"
        >
          <span className="relative overflow-hidden inline-flex h-[1.2em]" data-reveal="button">
            <span className="inline-block transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] delay-100 group-hover:-translate-y-full [text-shadow:0_1.5rem_0_currentColor]">
              {isPending ? "Please wait..." : "Send Message"}
            </span>
          </span>
          <span className="relative w-[18px] h-[13px] overflow-hidden inline-flex items-center shrink-0">
            <span className="absolute inset-0 flex items-center -translate-x-full transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-0 delay-100">
              <ArrowSvg />
            </span>
            <span className="absolute inset-0 flex items-center translate-x-0 transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] delay-100 group-hover:translate-x-full">
              <ArrowSvg />
            </span>
          </span>
          <span className="absolute bottom-0 left-0 right-0 h-px overflow-hidden pointer-events-none">
            <span className="absolute inset-0 -translate-x-full transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-x-0 delay-100 bg-current h-px" />
            <span className="absolute inset-0 translate-x-0 transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] delay-100 group-hover:translate-x-full bg-current h-px" />
          </span>
        </button>
      </form>

      {state.error && (
        <div className="mt-4 p-4 bg-red-900/30 border border-red-500/30 rounded text-sm text-red-300">
          {state.error}
        </div>
      )}
    </div>
  );
}
