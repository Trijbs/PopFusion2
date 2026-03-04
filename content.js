window.PopFusionContent = {
  siteMeta: {
    name: "PopFusion",
    seasonLabel: "Summer 2026",
    tagline: "Festival energy, discovery-driven listening.",
    description:
      "PopFusion connects new music, artist culture, and practical festival planning in one clear, stage-ready guide.",
    nav: [
      { page: "home", href: "index.html", label: "Home" },
      { page: "discover", href: "discover.html", label: "Discover" },
      { page: "charts", href: "billboard.html", label: "Charts" },
      { page: "artist", href: "artist.html", label: "Artists" },
      { page: "news", href: "news.html", label: "News" },
      { page: "visit", href: "contact.html", label: "Plan Visit" }
    ],
    footerColumns: [
      {
        title: "Explore",
        links: [
          { href: "discover.html", label: "New this week" },
          { href: "billboard.html", label: "Chart highlights" },
          { href: "artist.html", label: "Artist stories" },
          { href: "news.html", label: "Editorial desk" }
        ]
      },
      {
        title: "Festival",
        links: [
          { href: "contact.html#travel", label: "Travel guide" },
          { href: "contact.html#essentials", label: "Weekend essentials" },
          { href: "contact.html#accessibility", label: "Accessibility" },
          { href: "contact.html#faq", label: "FAQ" }
        ]
      },
      {
        title: "More",
        links: [
          { href: "spotify.html", label: "Spotify playlists" },
          { href: "help.html", label: "Help" },
          { href: "privacy.html", label: "Privacy" },
          { href: "terms.html", label: "Terms" }
        ]
      }
    ],
    socialLinks: [
      { href: "https://instagram.com", label: "Instagram" },
      { href: "https://tiktok.com", label: "TikTok" },
      { href: "https://open.spotify.com", label: "Spotify" }
    ]
  },
  festival: {
    label: "Upcoming edition",
    season: "Summer 2026",
    location: "Amsterdam waterfront district",
    summary:
      "A weekend built around fresh releases, pop-literate curation, and practical festival tools that help visitors move from discovery to arrival without friction.",
    facts: [
      { value: "4", label: "genre-led stages" },
      { value: "30+", label: "artists and DJ sets" },
      { value: "1", label: "weekend planning guide" }
    ],
    lineup: [
      {
        slug: "luna-arcs",
        name: "Luna Arcs",
        genre: "Synth-pop",
        day: "Friday",
        stage: "Skyline Stage",
        blurb: "Glossy hooks, late-night drums, and a festival-closing chorus.",
        image:
          "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=80"
      },
      {
        slug: "north-circuit",
        name: "North Circuit",
        genre: "Electronic",
        day: "Saturday",
        stage: "Pulse Hall",
        blurb: "Club-forward production with sharp transitions and immersive lighting.",
        image:
          "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80"
      },
      {
        slug: "satin-lane",
        name: "Satin Lane",
        genre: "Pop / R&B",
        day: "Saturday",
        stage: "Sunset Forum",
        blurb: "Warm vocal runs and intimate crowd moments for golden hour.",
        image:
          "https://images.unsplash.com/photo-1501612780327-45045538702b?auto=format&fit=crop&w=900&q=80"
      },
      {
        slug: "copper-youth",
        name: "Copper Youth",
        genre: "Alt-rock",
        day: "Sunday",
        stage: "Harbor Deck",
        blurb: "Guitar-heavy release show with a singalong-first set list.",
        image:
          "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=900&q=80"
      }
    ],
    genres: [
      {
        key: "pop",
        name: "Pop",
        description: "Melodic headlines, glossy choruses, and artist-first storytelling."
      },
      {
        key: "hip-hop",
        name: "Hip-hop",
        description: "Sharp lyricism, fashion-aware culture coverage, and rising voices."
      },
      {
        key: "rock",
        name: "Rock",
        description: "Live energy, heavier textures, and bands built for big stages."
      },
      {
        key: "electronic",
        name: "Electronic",
        description: "Night sets, modular sound, and discovery through mood and motion."
      }
    ],
    weekendPlans: [
      {
        title: "Arrive with a plan",
        meta: "Travel and lockers",
        description:
          "Use the visit guide to decide your route, arrival time, and where to store essentials before the first set starts."
      },
      {
        title: "Build your own rhythm",
        meta: "Stages and breaks",
        description:
          "Move between high-energy stage moments and slower reset zones without losing the artists you care about."
      },
      {
        title: "Stay connected on site",
        meta: "Updates and support",
        description:
          "Keep practical info, accessibility notes, and support links in one place throughout the weekend."
      }
    ]
  },
  featuredArtists: [
    {
      slug: "luna-arcs",
      name: "Luna Arcs",
      genre: "Synth-pop",
      city: "Amsterdam",
      note: "Bright vocal hooks, widescreen production, and a strong Friday-night pull.",
      festivalSet: "Friday / Skyline Stage / 22:10",
      latestRelease: "Afterglow Radio",
      image:
        "https://images.unsplash.com/photo-1487180144351-b8472da7d491?auto=format&fit=crop&w=900&q=80",
      tracks: [
        { title: "Afterglow Radio", length: "3:28", note: "Lead single with an arena-ready final minute." },
        { title: "Glass City", length: "4:02", note: "Synth layers and a slower, cinematic build." },
        { title: "Blue Static", length: "3:51", note: "A sharper hook-driven track built for festival speakers." }
      ],
      about:
        "Luna Arcs writes polished pop that still leaves room for atmosphere. Her latest cycle pushes toward bigger stage moments without losing the intimacy of bedroom-pop writing.",
      liveBlurb:
        "Expect a late set built around the new record, custom visuals, and a slower encore before the handover to the closing DJ."
    },
    {
      slug: "north-circuit",
      name: "North Circuit",
      genre: "Electronic",
      city: "Rotterdam",
      note: "Club-focused production with warm pads, low-end pressure, and precise pacing.",
      festivalSet: "Saturday / Pulse Hall / 23:40",
      latestRelease: "Heat Signature",
      image:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80",
      tracks: [
        { title: "Heat Signature", length: "5:02", note: "A peak-time cut with a long intro and clean drop." },
        { title: "Signal Bloom", length: "4:18", note: "More melodic, with a restrained mid-set release." },
        { title: "Night Harbor", length: "6:11", note: "Slow-build closer designed for immersive lighting." }
      ],
      about:
        "North Circuit balances club utility with a cinematic edge. The project is less about novelty and more about control, patience, and room-scale atmosphere.",
      liveBlurb:
        "The PopFusion slot is planned as a night sequence, moving from warm-up textures into a more physical closing run."
    },
    {
      slug: "satin-lane",
      name: "Satin Lane",
      genre: "Pop / R&B",
      city: "Utrecht",
      note: "Soft-focus vocals and groove-led songwriting that lands well in sunset programming.",
      festivalSet: "Saturday / Sunset Forum / 19:30",
      latestRelease: "Soft Exit",
      image:
        "https://images.unsplash.com/photo-1509869175650-a1d97972541a?auto=format&fit=crop&w=900&q=80",
      tracks: [
        { title: "Soft Exit", length: "3:17", note: "A gentle opener with a strong vocal center." },
        { title: "Mirror Season", length: "3:54", note: "More rhythmic and built for live harmonies." },
        { title: "Stay for the Lights", length: "4:07", note: "The most festival-ready moment in the current set." }
      ],
      about:
        "Satin Lane leans into emotional clarity, smooth percussion, and detail-heavy production that rewards repeat listening without sounding overworked.",
      liveBlurb:
        "This set is positioned for the golden-hour crowd: warm light, slower pacing, and a lot of audience singback."
    },
    {
      slug: "copper-youth",
      name: "Copper Youth",
      genre: "Alt-rock",
      city: "The Hague",
      note: "Direct guitar writing and louder choruses for the biggest crowd-energy swings of the weekend.",
      festivalSet: "Sunday / Harbor Deck / 20:50",
      latestRelease: "Breaker Line",
      image:
        "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=900&q=80",
      tracks: [
        { title: "Breaker Line", length: "3:36", note: "Fast, open, and made for the live room." },
        { title: "Northern Exit", length: "4:24", note: "A slower midpoint track with heavier drums." },
        { title: "Crowd Control", length: "3:48", note: "The biggest chant-back moment in the current set." }
      ],
      about:
        "Copper Youth is the most direct act in the first-wave lineup. The writing is stripped back, but the delivery is calibrated for large outdoor stages.",
      liveBlurb:
        "Their Sunday slot should feel like a pressure release after a day of smaller sets and discovery sessions."
    }
  ],
  discoverCollections: {
    filters: ["all", "pop", "hip-hop", "rock", "electronic"],
    newThisWeek: [
      {
        title: "Afterglow Radio",
        artist: "Luna Arcs",
        genre: "pop",
        blurb: "Bright synth-pop with a stadium-sized final hook.",
        image:
          "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?auto=format&fit=crop&w=900&q=80"
      },
      {
        title: "Summer Rehearsal",
        artist: "Niko Vale",
        genre: "hip-hop",
        blurb: "A lean, late-night rap release with sharp drum edits.",
        image:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80"
      },
      {
        title: "Breaker Line",
        artist: "Copper Youth",
        genre: "rock",
        blurb: "Fast guitars and a chorus that is built to travel.",
        image:
          "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80"
      },
      {
        title: "Heat Signature",
        artist: "North Circuit",
        genre: "electronic",
        blurb: "An understated opener that expands into club-scale pressure.",
        image:
          "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=900&q=80"
      }
    ],
    weekly: [
      {
        title: "Discover Weekly: Pop after dark",
        description: "Glossy hooks, warmer low-end, and songs that still hold up outside playlist context.",
        tags: ["Pop", "Night drive", "Vocals first"]
      },
      {
        title: "Risers from the local circuit",
        description: "Acts moving from club rooms into festival-ready sets across Amsterdam, Rotterdam, and Utrecht.",
        tags: ["Local", "Rising artists", "2026 watchlist"]
      },
      {
        title: "Festival recovery playlist",
        description: "A slower post-show sequence for the trip back, the queue, or the next morning.",
        tags: ["Ambient", "Soft R&B", "Reset"]
      }
    ],
    rising: [
      {
        slug: "luma-south",
        name: "Luma South",
        genre: "Pop",
        summary: "Hook-led writing with lighter percussion and a strong visual identity.",
        image:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80"
      },
      {
        slug: "district-one",
        name: "District One",
        genre: "Hip-hop",
        summary: "Minimal beats, spoken detail, and strong room presence.",
        image:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80"
      },
      {
        slug: "glass-lobby",
        name: "Glass Lobby",
        genre: "Electronic",
        summary: "A duo building patient club sets around texture and percussion.",
        image:
          "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80"
      }
    ],
    cta: {
      title: "Carry the discoveries into the weekend",
      description:
        "Move from playlist mode to festival mode with the lineup, travel notes, and support details in one place.",
      href: "contact.html",
      label: "Plan your visit"
    }
  },
  chartHighlights: {
    categories: [
      { key: "artists", label: "Top artists" },
      { key: "festival", label: "Festival favorites" },
      { key: "rising", label: "Rising now" },
      { key: "editors", label: "Editors' picks" }
    ],
    rankings: [
      {
        category: "artists",
        rank: 1,
        movement: "Up 2",
        name: "Luna Arcs",
        detail: "Afterglow Radio is holding the strongest audience response across pop lanes."
      },
      {
        category: "artists",
        rank: 2,
        movement: "New",
        name: "Satin Lane",
        detail: "A steady rise driven by repeat listens and strong live-session clips."
      },
      {
        category: "artists",
        rank: 3,
        movement: "Down 1",
        name: "Copper Youth",
        detail: "Still pulling ahead on crowd energy despite lighter release volume."
      },
      {
        category: "festival",
        rank: 1,
        movement: "Booked",
        name: "North Circuit",
        detail: "Night-program favorite with the clearest pulse-stage identity."
      },
      {
        category: "festival",
        rank: 2,
        movement: "Booked",
        name: "Luna Arcs",
        detail: "A Friday set designed to bridge discovery listeners into prime time."
      },
      {
        category: "festival",
        rank: 3,
        movement: "Booked",
        name: "Copper Youth",
        detail: "A Sunday stage anchor for the louder end of the bill."
      },
      {
        category: "rising",
        rank: 1,
        movement: "Watch",
        name: "Glass Lobby",
        detail: "Crossing from late-club support slots into headline-adjacent territory."
      },
      {
        category: "rising",
        rank: 2,
        movement: "Watch",
        name: "Luma South",
        detail: "Strong melodic profile and early-format flexibility across playlists and live rooms."
      },
      {
        category: "rising",
        rank: 3,
        movement: "Watch",
        name: "District One",
        detail: "Sharp writing and a focused visual identity are widening the audience quickly."
      },
      {
        category: "editors",
        rank: 1,
        movement: "Desk",
        name: "Soft Exit",
        detail: "The cleanest sunset set-up in this cycle of releases."
      },
      {
        category: "editors",
        rank: 2,
        movement: "Desk",
        name: "Night Harbor",
        detail: "A patient electronic closer that feels larger with every replay."
      },
      {
        category: "editors",
        rank: 3,
        movement: "Desk",
        name: "Crowd Control",
        detail: "A direct guitar record that translates instantly to the live field."
      }
    ],
    spotlight: {
      title: "Spotlight set",
      name: "North Circuit",
      descriptor: "Saturday night / Pulse Hall",
      summary:
        "North Circuit sits at the intersection of discovery and destination programming: precise enough for dedicated electronic listeners, accessible enough for visitors building a first full weekend route.",
      href: "artist.html?artist=north-circuit",
      label: "Open artist profile"
    }
  },
  newsStories: {
    featured: {
      slug: "afterglow-lineup",
      category: "Festival",
      title: "PopFusion opens Summer 2026 with a lineup built around discovery, not overload",
      dek:
        "The first release favors rhythm and flow: fewer clashes, stronger stage identities, and clearer routes for visitors who want to explore without losing the big moments.",
      date: "March 3, 2026",
      author: "PopFusion Editorial",
      image:
        "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1200&q=80",
      body: [
        "The first PopFusion lineup drop reads less like a race for the loudest poster and more like a careful map. Each stage is programmed around a mood and a genre lane, which makes the festival easier to read before visitors even arrive.",
        "That matters because the target audience in the research is not looking for a random pile of names. They want a platform that helps them discover artists, understand the atmosphere around each scene, and move through the weekend with less friction.",
        "PopFusion leans into that by pairing headline moments with rising acts, slower reset windows, and clearer editorial guidance. Instead of promising everything at once, the festival promises a better rhythm.",
        "The result is a stronger bridge between the website and the festival app concept: discovery, planning, and practical support are treated as one experience rather than separate products."
      ]
    },
    topics: [
      "Lineup reveal",
      "Travel planning",
      "Rising artists",
      "Late-night electronic",
      "Pop and R&B watchlist"
    ],
    stories: [
      {
        slug: "night-travel-guide",
        category: "Plan Visit",
        title: "How to structure a low-stress arrival for a multi-stage weekend",
        dek:
          "Travel windows, locker timing, and why the first hour on site should stay light.",
        date: "March 2, 2026",
        author: "Lena Vos",
        image:
          "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
        body: [
          "The easiest way to lose energy on a festival day is to arrive without making two or three practical decisions first. PopFusion is structuring its visit guide around those decisions: travel window, bag size, storage, and first-stage choice.",
          "That approach reflects the research. Young music-focused visitors want flexibility, but they also want the weekend to feel manageable. Clear planning cues do more for that than any amount of decorative interface motion.",
          "The recommended pattern is simple: arrive early enough to settle in, set one must-see artist for the day, and leave enough room for discovery between fixed moments."
        ]
      },
      {
        slug: "satin-lane-sunset",
        category: "Artists",
        title: "Why Satin Lane is the set to watch at sunset",
        dek:
          "A softer vocal palette, strong pacing, and exactly the kind of set that benefits from open-air timing.",
        date: "March 1, 2026",
        author: "Maya Chen",
        image:
          "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80",
        body: [
          "Satin Lane is not the loudest name in the first wave, but she may be the smartest programming choice. Her songs are melodic without becoming flat, and the pacing of the current release cycle works well in a sunset slot.",
          "Festival programming often gets judged by headliners alone. In practice, the transitions between daytime energy and nighttime intensity matter just as much. Satin Lane is exactly the kind of act that can hold that bridge."
        ]
      },
      {
        slug: "north-circuit-pulse-hall",
        category: "Electronic",
        title: "North Circuit earns the Pulse Hall spotlight",
        dek:
          "The Saturday night slot goes to the most controlled electronic live set in the early announcement.",
        date: "February 28, 2026",
        author: "Ruben de Vries",
        image:
          "https://images.unsplash.com/photo-1571266028243-d220c9c3d2a4?auto=format&fit=crop&w=1200&q=80",
        body: [
          "North Circuit is not being positioned as a generic dance-floor act. The booking works because the project understands scale, patience, and how to use a room without overfilling it.",
          "For PopFusion, that makes Pulse Hall feel intentional. The venue identity becomes clearer, and visitors gain a better sense of what kind of night the stage is trying to deliver."
        ]
      },
      {
        slug: "discovery-lanes-2026",
        category: "Discover",
        title: "The 2026 discovery lanes are sharper, calmer, and easier to trust",
        dek:
          "From pop to rock to electronic, the site now groups recommendations by feel and purpose instead of generic hype.",
        date: "February 26, 2026",
        author: "PopFusion Editorial",
        image:
          "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80",
        body: [
          "Discovery works better when the user understands why something is being shown. The updated lane structure reduces noise by describing what each genre area is for, not just which names are included.",
          "That makes the product feel more editorial and less algorithmic, which is useful when the site is still operating as a static prototype."
        ]
      }
    ],
    article: {
      defaultSlug: "afterglow-lineup"
    }
  },
  visitInfo: {
    venue: {
      name: "PopFusion Grounds",
      area: "Amsterdam waterfront district",
      summary:
        "Open-air stages, covered reset zones, clear walking routes, and practical services placed close to the main visitor flow."
    },
    travel: [
      {
        title: "Train + tram",
        description:
          "Best option for most visitors. Aim to arrive before early evening queue build-up and keep your final stop saved offline."
      },
      {
        title: "Bike + local parking",
        description:
          "Good for local visitors. Extra lighting and signed parking routes should make late exits easier and safer."
      },
      {
        title: "Drop-off / taxi",
        description:
          "Use the marked outer ring, then walk in through the signed visitor entrance rather than stopping at the gate."
      }
    ],
    essentials: [
      {
        title: "Lockers and storage",
        description: "Travel light, keep power banks accessible, and plan one locker check instead of multiple returns."
      },
      {
        title: "Food and reset zones",
        description: "The calm spaces matter as much as the stages. Build short breaks into the route, especially before late sets."
      },
      {
        title: "Weather layer",
        description: "Summer evenings can cool quickly on the waterfront. Pack one extra layer that fits in a small bag."
      }
    ],
    accessibility: [
      {
        title: "Step-aware routes",
        description: "Core visitor routes are planned with smoother transitions between stages, toilets, support points, and rest zones."
      },
      {
        title: "Dedicated support contact",
        description: "Visitors can use the support form to flag access requirements in advance or ask for practical help before arrival."
      },
      {
        title: "Quiet reset spaces",
        description: "Separate calm zones offer a lower-stimulus option away from the densest audience movement."
      }
    ],
    support: {
      email: "hello@popfusion.test",
      description:
        "Use the support form for visit questions, access notes, or app feedback. This is a prototype inbox for planning and usability testing."
    },
    app: {
      title: "Keep the weekend in your pocket",
      description:
        "The app concept focuses on practical guidance: personalized planning, stage routes, backstage content, and support details in one lightweight flow.",
      ctas: [
        { href: "#visit-form", label: "Request the app concept" },
        { href: "news.html", label: "Read festival updates" }
      ]
    }
  },
  faq: [
    {
      question: "Is PopFusion a real festival or a prototype concept?",
      answer:
        "This site is a high-fidelity prototype. The structure, navigation, and content model are designed to show how a hybrid music-discovery and festival product should work."
    },
    {
      question: "Why is the site focused on only a few genres?",
      answer:
        "The research is centered on pop, hip-hop, rock, and electronic listeners. Keeping the taxonomy focused makes discovery and planning easier to understand."
    },
    {
      question: "Will there be a full timetable and map?",
      answer:
        "The current pass concentrates on the core visitor flow first: lineup context, artist discovery, visit planning, and editorial guidance. A timetable and map fit in the next product layer."
    },
    {
      question: "Can I send feedback on accessibility or the app concept?",
      answer:
        "Yes. Use the support form on the Plan Visit page. Accessibility notes and app feedback are both part of the prototype testing scope."
    }
  ]
};
