/**
 * Centralised Pawlings public-site copy.
 * User-facing language: adoption & companion care (not whitelist / crypto mint).
 */

export const pawlingsContent = {
  brand: {
    name: "Pawlings",
    tagline: "Colourful companions. Big personalities. A lifetime of care.",
    logoAlt: "Pawlings colourful crowned logo",
    logoPath: "/branding/PLLogo.png",
    xHandle: "@Pawlings_",
    xUrl: "https://x.com/Pawlings_",
  },

  assets: {
    dog1: "/branding/Dog1Transparent.png",
    dog2: "/branding/Dog2Transparent.png",
    dogAlt: "Colourful Pawling character",
    pawBg: "/branding/pawBG.png",
    officialStamp: "/branding/pawlings-official-stamp.png",
  },

  nav: {
    home: "Home",
    meetThePack: "Meet the Pack",
    roadmap: "Roadmap",
    collabs: "Collabs",
    faq: "FAQ",
    x: "X",
    adoptCta: "Begin Adoption",
    collaborate: "Collaborate",
  },

  adoption: {
    cta: "🐾 Begin Adoption",
    signCta: "Sign Adoption Papers",
    overlayTitle: "Official Adoption Documents",
    overlaySubtitle:
      "Complete each section and sign below to submit your papers to the Adoption Bureau.",
    fileLabel: "Document File",
    agency: "Official Pawlings Adoption Agency",
    steps: {
      guardian: "Guardian Details",
      wallet: "Future Guardian Wallet",
      statement: "Adoption Statement",
      sign: "Sign the Papers",
      success: "Papers Approved",
    },
    guardianIntro:
      "Add your socials so the team can get to know you. X is required. The team reviews applicants through X.",
    walletLabel: "Future Guardian Wallet",
    walletPlaceholder: "0x...",
    walletHint: "Your public Ethereum address, where your Pawling would live.",
    xLabel: "X Username",
    xPlaceholder: "@yourhandle",
    xHint: "Required for reviewing your adoption application.",
    discordLabel: "Discord Handle",
    discordPlaceholder: "yourname",
    statementLabel: "Why would you make a good Pawling guardian?",
    statementPlaceholder:
      "Share a little about yourself and why you want to adopt a Pawling…",
    statementHint: "Optional. Up to 500 characters.",
    signatureLabel: "Guardian signature",
    signatureHint: "Draw your signature as you would on official paperwork.",
    agreement:
      "I promise to take good care of my future Pawling and agree to the privacy policy and terms.",
    submit: "Sign Adoption Papers",
    submitting: "Submitting papers…",
    next: "Continue",
    back: "Back",
    skip: "Skip this step",
    stampText: "APPLICATION RECEIVED",
    successBadge: "CONGRATULATIONS",
    successTitle: "Adoption papers approved.",
    successBody:
      "Your official adoption application has been received. Download your certificate and share the news. Now we wait for your mint window.",
    successStatus: "Waiting Room",
    certificateHeading: "Approved Adoption Papers",
    certificateStatus: "Application Received",
    downloadCertificate: "Download Adoption Certificate",
    shareOnX: "Share on X",
    returnHome: "Return Home",
    close: "Close application",
    closedTitle: "Adoptions are currently closed",
    securityNote:
      "We will never ask for your seed phrase or private key.",
    noGuaranteeNote:
      "Submitting an application does not guarantee an adoption opportunity.",
    duplicateWalletMessage:
      "Thank you! We already have an application for you. Please check back later to see if you made the Adoption List. Keep an eye out for news on our socials!",
    xVerification: {
      heading: "X Verification",
      followingLabel: "Following Pawlings",
      verifiedLabel: "Verified",
      pending: "Pending review",
      following: "Following",
      verified: "Verified",
      notePrefix: "Follow",
      noteSuffix:
        "on X. Verification status will update automatically once integration is live.",
    },
  },

  hero: {
    eyebrow: "Adoption applications are now open!",
    headline: "Begin your official adoption papers.",
    headlineHighlight: "adoption",
    subheadline:
      "A pack of colourful personalities is waiting for their forever home.",
    microcopy: "Add your socials so the team can get to know you.",
    ctaPrimary: "🐾 Begin Adoption",
    ctaSecondary: "Meet the Pack",
  },

  trustStrip: {
    items: [
      "Adoption applications open",
      "No payment required",
      "Official links only",
      "Applications reviewed manually",
    ],
  },

  about: {
    eyebrow: "Meet the Pack",
    heading: "Small characters. Very big personalities.",
    headingHighlight: "personalities",
    body:
      "Pawlings are a growing pack of colourful canine characters, each with their own style, personality and place in the world.",
    body2:
      "Some are noble. Some are chaotic. Some are mostly motivated by snacks.",
    highlight:
      "No two Pawlings are quite the same, and that is exactly the point.",
    stamps: [
      "Snack Inspector",
      "Professional Napper",
      "Treat Negotiator",
      "Chaos Coordinator",
      "Certified Good Dog",
    ],
  },

  steps: {
    heading: "How it works",
    headingHighlight: "works",
    intro:
      "From adoption papers to full evolution: a journey built for guardians, not collectors.",
    items: [
      {
        title: "Adopt",
        description:
          "Sign your adoption papers and enter the waiting room. You're reserving a place in the nursery.",
        emoji: "📋",
        color: "lime" as const,
      },
      {
        title: "Mint Puppy",
        description:
          "When your window opens, mint your Pawling Puppy, a living companion, not just a token.",
        emoji: "🐶",
        color: "purple" as const,
      },
      {
        title: "Raise Your Pawling",
        description:
          "Feed, play, and nurture your puppy. Happiness, energy, and growth all matter.",
        emoji: "🦴",
        color: "orange" as const,
      },
      {
        title: "Watch It Evolve",
        description:
          "With enough care, your puppy grows into its adult form, a legendary companion.",
        emoji: "✨",
        color: "yellow" as const,
      },
    ],
  },

  roadmap: {
    eyebrow: "The Journey Ahead",
    heading: "Roadmap",
    headingHighlight: "Roadmap",
    trailLabel: "Follow the paw prints",
    mysterySymbol: "?????",
    mysteryText: "Something's sniffing around in the den…",
    phases: [
      {
        id: "phase-1",
        label: "Phase 1",
        title: "Adoption List",
        tagline: "The pack is gathering. Come say hi.",
        tags: ["Adoption List", "Community", "Growing the Pack"],
      },
      {
        id: "phase-2",
        label: "Phase 2",
        title: "Raise Your Pawlings",
        tagline: "From wobbly puppy to legend status.",
        items: [
          {
            title: "Adopt your Pup(s)",
            description: "Mint your Pawling Puppy and bring them home.",
            emoji: "🐶",
            accent: "lime" as const,
          },
          {
            title: "Raise your Pup(s)",
            description: "Feed, play, and care for your companion every day.",
            emoji: "🦴",
            accent: "orange" as const,
            visual: "evolution" as const,
          },
          {
            title: "Watch them grow",
            description: "Nurture your puppy until they become an adult Pawling.",
            emoji: "✨",
            accent: "purple" as const,
          },
        ],
      },
      {
        id: "phase-3",
        label: "Phase 3",
        title: "Top Secret",
        tagline: "Even we don't know what's in the doghouse yet.",
        mysterious: true,
      },
    ],
  },

  characters: {
    placeholderName: "Coming Soon",
    placeholderTrait: "Unknown Pawling",
    placeholderHint: "New Pawling incoming…",
    featured: [
      {
        image: "/branding/Dog1Transparent.png",
        name: "Blaze",
        trait: "Bold & bright",
        stamp: "Chaos Coordinator",
        mirrored: false,
      },
      {
        image: "/branding/pack-jack-transparent.png",
        name: "Jack",
        trait: "Poolside legend",
        stamp: "Duck Float Captain",
        mirrored: false,
      },
      {
        image: "/branding/pack-lola-transparent.png",
        name: "Lola",
        trait: "Flower crown energy",
        stamp: "Certified Good Dog",
        mirrored: false,
      },
      {
        image: "/branding/pack-riot-transparent.png",
        name: "Riot",
        trait: "Chaos with style",
        stamp: "Professional Troublemaker",
        mirrored: false,
      },
    ],
  },

  adoptionCta: {
    heading: "Ready to bring one home?",
    headingHighlight: "home",
    body:
      "Complete the official adoption application and tell us a little about the future guardian behind the wallet.",
    microcopy: "It only takes a few minutes.",
  },

  social: {
    eyebrow: "Community",
    heading: "Stay close to the pack.",
    headingHighlight: "pack",
    body:
      "Adoption announcements, character reveals and important updates will be shared through our official channels.",
    x: "Follow on X",
    discord: "Join Discord",
  },

  finalCta: {
    heading: "There may be a Pawling waiting for you.",
    headingHighlight: "Pawling",
  },

  faq: {
    heading: "Questions about adoption",
    headingHighlight: "adoption",
    intro: "Everything you need to know before signing your papers.",
    footerNote: "More FAQ may be added later once mint details are available.",
    items: [
      {
        question: "What is the Pawlings Whitelist / Adoption List?",
        answer:
          "The Whitelist (also called the Adoption List) is a list of approved members who are allowed to adopt a Pawling Pup.",
      },
      {
        question: "Does submitting an adoption form guarantee a whitelist spot?",
        answer:
          "No. The team carefully reviews every application to make sure only people who can properly take care of a pup are given a spot.",
      },
      {
        question: "Do I need to connect my wallet?",
        answer:
          "No. Enter your public wallet address only. Never share your seed phrase or private key.",
      },
      {
        question: "Is there a cost to fill out the adoption form?",
        answer: "No. Joining the waitlist is completely free.",
      },
      {
        question: "Are X and Discord required?",
        answer:
          "Only an X account is required, so the team can properly review your adoption application.",
      },
      {
        question: "Can I edit my application?",
        answer:
          "Applications cannot be edited after submission. Contact the Pawlings team if you need help.",
      },
      {
        question: "When will applicants be notified?",
        answer:
          "Updates will be shared through official Pawlings social channels when ready.",
      },
      {
        question: "How can I get an Adoption List spot for my community?",
        answer: "Please fill out the collab form here:",
        link: "/collaborate",
        linkLabel: "Community Collaboration form",
      },
      {
        question: "Who is the team behind Pawlings?",
        answer:
          "The team currently consists of: Hub and his two daughters, Squeebo (everything blockchain-related), a 3D artist, and HermaNFT (website).",
      },
    ],
  },

  collaborate: {
    eyebrow: "Community Collaboration",
    heading: "Community Collaboration",
    headingHighlight: "Collaboration",
    subheading:
      "Projects can apply to receive whitelist allocations for their holders.",
    intro:
      "Tell us about your collection and how we might collaborate. Submissions are reviewed separately from adoption applications.",
    fields: {
      collectionName: "Collection Name",
      website: "Website",
      x: "X",
      discord: "Discord",
      collectionSize: "Collection Size",
      blockchain: "Blockchain",
      pitch: "Why should we collaborate?",
      spots: "How many whitelist spots requested?",
      dream: "Which collections would you love to see Pawlings collaborate with?",
    },
    submit: "Submit Collaboration Application",
    submitting: "Submitting…",
    successTitle: "Application received.",
    successBody:
      "Thank you for reaching out. The Pawlings team will review your collaboration proposal.",
    referenceLabel: "Reference",
  },

  dashboard: {
    eyebrow: "Guardian Dashboard",
    heading: "Your Pawling nursery",
    body:
      "Connect your wallet to preview the companion dashboard. Care mechanics and evolution unlock after mint.",
    empty: {
      title: "You haven't adopted a Pawling yet.",
      body: "Sign your adoption papers first, then return here once minting opens to meet your puppy.",
      cta: "Adopt One",
    },
    statusHeading: "Puppy Status",
    feedLabel: "Feed Pawling",
    notificationsHeading: "Notifications",
    timelineHeading: "Your Journey",
  },

  footer: {
    tagline: "Made for the pack.",
    disclaimer:
      "Pawlings is a character-led adoption experience. Applications do not guarantee allocation.",
    poweredBy: "Powered By Little Ollie Labs",
    privacy: "Privacy",
    terms: "Terms",
    collaborate: "Collabs",
    admin: "Admin",
  },

  statusLabels: {
    pending: "Under Review",
    reviewing: "Under Review",
    approved: "Adoption Approved",
    waitlisted: "Shortlisted",
    rejected: "Application Unsuccessful",
    archived: "Archived",
  },
} as const;

export type PawlingsContent = typeof pawlingsContent;
