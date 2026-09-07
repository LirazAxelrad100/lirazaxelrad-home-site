import { useState } from "react";
import { BookingPicker } from "./BookingPicker";
import { ContactForm } from "./ContactForm";
import type { BookingContent, ContactPageContent } from "../data/types";

interface ContactTabsProps {
  booking: BookingContent;
  contact: ContactPageContent;
  locale: "he" | "en";
}

/**
 * Booking and the message form share the contact page as two tabs rather than
 * sitting stacked: the slot picker is tall enough that stacking would push the
 * form well below the fold. Booking is the default because it is the action
 * Liraz would rather visitors take.
 */
export function ContactTabs({ booking, contact, locale }: ContactTabsProps) {
  const [tab, setTab] = useState<"book" | "write">("book");

  const tabClass = (active: boolean) =>
    [
      "flex-1 border-0 px-5 py-3 font-heebo text-[15px] cursor-pointer",
      active ? "bg-accent text-white font-semibold" : "bg-transparent text-text-muted hover:text-accent",
    ].join(" ");

  return (
    <div>
      <div role="tablist" className="mb-8 flex overflow-hidden rounded border border-border">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "book"}
          onClick={() => setTab("book")}
          className={tabClass(tab === "book")}
        >
          {booking.tabBook}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "write"}
          onClick={() => setTab("write")}
          className={tabClass(tab === "write")}
        >
          {booking.tabWrite}
        </button>
      </div>

      {/* The picker is unmounted rather than hidden when the form is showing,
          so its slots request only happens for visitors who actually book. */}
      {tab === "book" ? (
        <BookingPicker
          labels={booking}
          topicOptions={contact.formLabels.topicOptions}
          topicPlaceholder={contact.formLabels.topicPlaceholder}
          locale={locale}
        />
      ) : (
        <ContactForm labels={contact.formLabels} />
      )}
    </div>
  );
}
