import { Lightbulb } from 'lucide-react';

export function TipCallout({ text }: { text: string }) {
    return (
        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-blue-500/[0.06] border border-blue-500/15 mb-10">
            <Lightbulb size={14} className="text-blue-300 shrink-0 mt-0.5" />
            <p className="text-[13.5px] leading-relaxed text-blue-100/90 m-0">
                <span className="text-blue-50 font-medium">Lock this in. </span>
                {text}
            </p>
        </div>
    );
}
