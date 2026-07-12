import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  center = false,
}: {
  eyebrow?: string;
  title?: ReactNode;
  intro?: string;
  center?: boolean;
}) {
  return (
    <div className={`max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow && (
        <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-sage-deep">
          {eyebrow}
        </p>
      )}
      {title && (
        <h2 className="font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">
          {title}
        </h2>
      )}
      {intro && <p className="mt-4 text-lg leading-relaxed text-ink-soft">{intro}</p>}
    </div>
  );
}

export function Field({
  label,
  name,
  type = "text",
  required = false,
  placeholder,
  defaultValue,
  hint,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold text-ink">
        {label}
        {required ? <span className="text-terracotta"> *</span> : null}
      </span>
      {type === "textarea" ? (
        <textarea
          name={name}
          required={required}
          placeholder={placeholder}
          defaultValue={defaultValue}
          rows={4}
          className="w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-ink shadow-soft outline-none transition-colors placeholder:text-ink-soft/50 focus:border-sage"
        />
      ) : (
        <input
          type={type}
          name={name}
          required={required}
          placeholder={placeholder}
          defaultValue={defaultValue}
          className="w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-ink shadow-soft outline-none transition-colors placeholder:text-ink-soft/50 focus:border-sage"
        />
      )}
      {hint && <span className="mt-1 block text-xs text-ink-soft">{hint}</span>}
    </label>
  );
}

export function SubmitButton({ children }: { children: ReactNode }) {
  return (
    <button
      type="submit"
      className="w-full rounded-full bg-terracotta px-6 py-3.5 font-bold text-white shadow-soft transition-all hover:-translate-y-0.5 hover:bg-terracotta-deep hover:shadow-lift disabled:opacity-60"
    >
      {children}
    </button>
  );
}

const badgeStyles: Record<string, string> = {
  PAID: "bg-sage/15 text-sage-deep",
  SENT: "bg-sun/20 text-[#96700f]",
  OVERDUE: "bg-terracotta/15 text-terracotta-deep",
  DRAFT: "bg-ink/10 text-ink-soft",
  CANCELLED: "bg-ink/10 text-ink-soft line-through",
  PRESENT: "bg-sage/15 text-sage-deep",
  ABSENT: "bg-terracotta/15 text-terracotta-deep",
  EXCUSED: "bg-sky/15 text-sky",
  NEW: "bg-sun/20 text-[#96700f]",
  CONTACTED: "bg-sky/15 text-sky",
  ACCEPTED: "bg-sage/15 text-sage-deep",
  DECLINED: "bg-ink/10 text-ink-soft",
};

const badgeLabels: Record<string, string> = {
  PAID: "E paguar",
  SENT: "E papaguar",
  OVERDUE: "E vonuar",
  DRAFT: "Draft",
  CANCELLED: "E anuluar",
  PRESENT: "I pranishëm",
  ABSENT: "Mungoi",
  EXCUSED: "I arsyetuar",
  NEW: "E re",
  CONTACTED: "Kontaktuar",
  ACCEPTED: "Pranuar",
  DECLINED: "Refuzuar",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${
        badgeStyles[status] ?? "bg-ink/10 text-ink-soft"
      }`}
    >
      {badgeLabels[status] ?? status}
    </span>
  );
}
