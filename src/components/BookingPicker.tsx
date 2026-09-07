import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { BookingContent, ContactPageContent } from "../data/types";

interface BookingPickerProps {
  labels: BookingContent;
  topicOptions: ContactPageContent["formLabels"]["topicOptions"];
  topicPlaceholder: string;
  locale: "he" | "en";
}

interface SlotsResponse {
  slots: number[];
  durationMinutes: number;
}

/** The visitor's own IANA zone, e.g. "Asia/Jerusalem". */
function visitorTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

export function BookingPicker({ labels, topicOptions, topicPlaceholder, locale }: BookingPickerProps) {
  const [slots, setSlots] = useState<number[] | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const zone = useMemo(visitorTimeZone, []);
  const intlLocale = locale === "he" ? "he-IL" : "en-GB";

  useEffect(() => {
    let cancelled = false;
    fetch("/api/slots")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("failed"))))
      .then((data: SlotsResponse) => {
        if (!cancelled) setSlots(data.slots);
      })
      .catch(() => {
        if (!cancelled) setSlots([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Slots arrive as UTC instants and are grouped by the visitor's own calendar
  // day, so someone in Jerusalem sees them under the date it is for them.
  const days = useMemo(() => {
    const grouped = new Map<string, number[]>();
    for (const slot of slots ?? []) {
      const key = new Intl.DateTimeFormat("en-CA", {
        timeZone: zone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date(slot));
      grouped.set(key, [...(grouped.get(key) ?? []), slot]);
    }
    return [...grouped.entries()];
  }, [slots, zone]);

  const dayLabel = (iso: string) =>
    new Intl.DateTimeFormat(intlLocale, { timeZone: zone, weekday: "long", day: "numeric", month: "long" }).format(
      new Date(`${iso}T12:00:00Z`),
    );

  const timeLabel = (ms: number) =>
    new Intl.DateTimeFormat(intlLocale, { timeZone: zone, hour: "2-digit", minute: "2-digit", hour12: false }).format(
      new Date(ms),
    );

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (selected === null) return;
    setStatus("sending");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, start: selected, visitorTimeZone: zone, locale }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  const inputClass = "rounded border border-border bg-white px-3.5 py-3 text-[15px] text-inherit font-heebo";
  const labelClass = "text-[14px] text-text-body-soft";

  if (status === "sent") {
    return (
      <div>
        <h2 className="m-0 mb-2 font-rubik text-[20px] font-medium">
          {labels.successTitle}
        </h2>
        <p className="m-0 text-[15px] leading-[1.7] text-text-muted">{labels.successBody}</p>
      </div>
    );
  }

  if (slots === null) {
    return <p className="m-0 text-[15px] text-text-muted">{labels.loading}</p>;
  }

  if (slots.length === 0) {
    return <p className="m-0 text-[15px] text-text-muted">{labels.noSlots}</p>;
  }

  if (selected === null) {
    return (
      <div>
        <p className="m-0 mb-1 text-[15px] leading-[1.7] text-text-muted">{labels.intro}</p>
        <p className="m-0 mb-6 text-[13px] text-text-muted-soft">{labels.timeZoneNote.replace("{zone}", zone)}</p>
        <div className="flex flex-col gap-6">
          {days.map(([iso, daySlots]) => (
            <div key={iso}>
              <h3 className="m-0 mb-2 font-rubik text-[15px] font-medium text-text-body">{dayLabel(iso)}</h3>
              <div className="flex flex-wrap gap-2">
                {daySlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelected(slot)}
                    className="rounded border border-border bg-white px-4 py-2 text-[15px] text-text-body hover:border-accent hover:text-accent"
                  >
                    {timeLabel(slot)}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <strong className="font-rubik text-[17px] font-medium">
          {dayLabel(
            new Intl.DateTimeFormat("en-CA", { timeZone: zone, year: "numeric", month: "2-digit", day: "2-digit" }).format(
              new Date(selected),
            ),
          )}
          , {timeLabel(selected)}
        </strong>
        <button
          type="button"
          onClick={() => setSelected(null)}
          className="border-0 bg-transparent p-0 text-[13px] text-accent underline underline-offset-2"
        >
          {labels.changeSlot}
        </button>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={labelClass} htmlFor="booking-name">
          {labels.name}
        </label>
        <input id="booking-name" name="name" type="text" placeholder={labels.namePlaceholder} required className={inputClass} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className={labelClass} htmlFor="booking-email">
          {labels.email}
        </label>
        <input id="booking-email" name="email" type="email" placeholder={labels.emailPlaceholder} required className={inputClass} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className={labelClass} htmlFor="booking-phone">
          {labels.phone}
        </label>
        <input id="booking-phone" name="phone" type="tel" placeholder={labels.phonePlaceholder} className={inputClass} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className={labelClass} htmlFor="booking-topic">
          {labels.topic}
        </label>
        <select id="booking-topic" name="topic" defaultValue="" className={inputClass}>
          <option value="">{topicPlaceholder}</option>
          {topicOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="self-start rounded bg-accent px-8 py-3.5 font-heebo text-[15px] font-semibold text-white disabled:opacity-60"
      >
        {status === "sending" ? labels.sending : labels.submit}
      </button>
      {status === "error" && <p className="m-0 text-[14px] text-red-600">{labels.errorMessage}</p>}
    </form>
  );
}
