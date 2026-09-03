/**
 * Every user-facing string. Abed reviews all copy, so it lives in one file
 * rather than scattered through JSX.
 *
 * House style: English base, Lebanese Arabic and Franco-Arabic where it lands
 * naturally. Short lines. No em dashes.
 */

export const copy = {
  hero: {
    eyebrow: "By order of the King & Queen",
    title: "Double Crown",
    tagline: "Two birthdays. One burger. Yalla.",
    squishHint: "Squeeze it. Ma tkhaf.",
    scrollHint: "Keep scrolling",
  },

  reveal: {
    caption: "El malek w el malaké",
    polaroids: {
      campfire: "before the crowns",
      bkCrown: "she found the crown first",
    },
  },

  decree: {
    heading: "The Royal Decree",
    opener: "By order of the King & Queen, you are summoned.",
    labels: {
      when: "When",
      where: "Where",
      dress: "Dress code",
      tribute: "Royal tribute",
      rsvpBy: "RSVP by",
    },
    dress: "Light colors. Wear something the flash will love.",
    tributeIncludes:
      "Covers your kids meal, a toy, animation, face paint, and a character.",
    tributePayment: 'Cash at the door. No cards, no "ba3dein".',
    closer: "Yalla, menshoufkon.",
    addToCalendar: "Add to calendar",
    openInMaps: "Open in maps",
  },

  countdown: {
    heading: "Till the crowns drop",
    units: { days: "Days", hours: "Hrs", minutes: "Min", seconds: "Sec" },
    live: "It's happening. Yalla.",
  },

  rsvp: {
    heading: "Take your oath",
    sub: "One crown per royal. Choose wisely.",
    namePlaceholder: "Your royal name",
    nameLabel: "Your royal name",
    comingLabel: "Coming?",
    comingYes: "Akid",
    comingNo: "La2",
    messageLabel: "A word for the crown",
    messagePlaceholder: "Optional",
    submit: "Claim my crown",
    submitEdit: "Update my crown",
    submitting: "Claiming...",
    success: "Crown claimed. 3a2belak.",
    successNotComing: "Noted. We'll miss you, habibi.",
    changeAnswer: "Changed your mind?",
    editingHint: "This device already claimed a crown. You can change your answer.",
    comingRequired: "Pick one: Akid or La2.",
    notConfigured:
      "RSVP is not wired up yet. Add the Supabase keys to .env.local and restart the dev server.",
    duplicate: "This royal is already on the wall",
    errorGeneric: "Something broke. Try again in a second.",
    nameRequired: "The court needs a name.",
    closedHeading: "The royal gates are closed",
    closedBody: "RSVP shut on Friday 4 September. Text the King directly.",
  },

  wall: {
    heading: "The Court",
    coming: "coming",
    notComing: "can't make it",
    empty: "No crowns yet. Be the first, ya batal.",
    loading: "Counting the court...",
    failed: "The wall is down for a second. Refresh and it should come back.",
  },

  footer: {
    madeBy: "made by the King & Queen",
    share: "Send to the group chat",
    shareCopied: "Link copied. Yalla, paste it.",
  },

  admin: {
    heading: "Royal Chamber",
    passphrasePlaceholder: "Say the word",
    enter: "Enter",
    wrong: "La2. Try again.",
    exportCsv: "Export CSV",
    deleteConfirm: "Remove this crown for good?",
    empty: "No crowns to rule over yet.",
    remove: "Delete",
    close: "Close",
  },

  sound: {
    muteOn: "Mute sounds",
    muteOff: "Unmute sounds",
  },

  meta: {
    title: "Double Crown: Abed & Lynn",
    description:
      "Sunday 6 Sept, 6 PM. Burger King Raouché. Light colors. Yalla.",
  },
} as const;
