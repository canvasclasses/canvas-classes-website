'use client';

import { Send, ArrowRight } from 'lucide-react';

// Canvas Classes Telegram channel — community updates, doubt support, PYQs.
const TELEGRAM_URL = 'https://t.me/mycanvasclasses';

// Slim join-our-Telegram banner. Telegram-blue (not the per-mode accent) so it
// reads as a distinct community action. Rendered on the Dashboard + Study Plan.
export function TelegramCTA() {
    return (
        <a href={TELEGRAM_URL} target="_blank" rel="noreferrer" className="dyp-tg">
            <span className="dyp-tg-ic"><Send size={18} strokeWidth={2} /></span>
            <span className="dyp-tg-main">
                <span className="dyp-tg-title">Join us on Telegram</span>
                <span className="dyp-tg-sub">Daily updates, doubt support &amp; free PYQs — straight to your phone.</span>
            </span>
            <span className="dyp-tg-cta">Join <ArrowRight size={15} /></span>
        </a>
    );
}
