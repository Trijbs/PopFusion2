// PopFusion 2025 - Community Data
// Enhanced data structure for community-focused platform

const communityData = {
    // Community Statistics
    stats: {
        totalMembers: "2.4M+",
        activeToday: "156K",
        songsShared: "890K",
        communitiesActive: "1.2K"
    },

    // Featured Communities
    communities: [
        {
            id: 1,
            name: "Indie Vibes Collective",
            members: 45200,
            genre: "Indie",
            description: "Discover underground indie gems and connect with fellow music lovers",
            image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
            isLive: true,
            activeNow: 234,
            tags: ["indie", "alternative", "underground"]
        },
        {
            id: 2,
            name: "Electronic Fusion Hub",
            members: 67800,
            genre: "Electronic",
            description: "Where electronic music meets innovation and creativity",
            image: "https://images.unsplash.com/photo-1571974599782-87624638275c?w=400&h=400&fit=crop",
            isLive: true,
            activeNow: 412,
            tags: ["electronic", "edm", "techno", "house"]
        },
        {
            id: 3,
            name: "Hip-Hop Culture Corner",
            members: 89300,
            genre: "Hip-Hop",
            description: "Celebrating hip-hop culture, from classics to the latest drops",
            image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
            isLive: false,
            activeNow: 156,
            tags: ["hip-hop", "rap", "culture", "beats"]
        }
    ],

    // Trending Content
    trending: {
        tracks: [
            {
                id: 1,
                title: "Midnight Echoes",
                artist: "Luna Waves",
                genre: "Indie Pop",
                plays: 234500,
                likes: 12400,
                shares: 890,
                image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
                duration: "3:42",
                isNew: true,
                communityRating: 4.8
            },
            {
                id: 2,
                title: "Digital Dreams",
                artist: "Neon Collective",
                genre: "Electronic",
                plays: 456700,
                likes: 23100,
                shares: 1560,
                image: "https://images.unsplash.com/photo-1571974599782-87624638275c?w=300&h=300&fit=crop",
                duration: "4:15",
                isNew: false,
                communityRating: 4.6
            },
            {
                id: 3,
                title: "Urban Stories",
                artist: "Street Poets",
                genre: "Hip-Hop",
                plays: 678900,
                likes: 34200,
                shares: 2340,
                image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
                duration: "3:28",
                isNew: true,
                communityRating: 4.9
            }
        ],
        playlists: [
            {
                id: 1,
                title: "Community Favorites 2025",
                creator: "PopFusion Team",
                tracks: 45,
                followers: 23400,
                image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
                description: "The most loved tracks by our community this year"
            },
            {
                id: 2,
                title: "Late Night Vibes",
                creator: "MidnightMelodies",
                tracks: 32,
                followers: 18700,
                image: "https://images.unsplash.com/photo-1571974599782-87624638275c?w=300&h=300&fit=crop",
                description: "Perfect soundtrack for your late night sessions"
            }
        ]
    },

    // Community Highlights
    highlights: [
        {
            id: 1,
            type: "discovery",
            user: {
                name: "Alex Chen",
                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
                verified: true,
                role: "Community Curator"
            },
            content: "Just discovered this incredible indie band from Portland! Their sound is absolutely mesmerizing 🎵",
            timestamp: "2 hours ago",
            likes: 156,
            comments: 23,
            track: {
                title: "Ethereal Nights",
                artist: "Portland Dreams",
                image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop"
            }
        },
        {
            id: 2,
            type: "event",
            user: {
                name: "Sarah Martinez",
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
                verified: false,
                role: "Event Organizer"
            },
            content: "Hosting a virtual listening party tonight at 9 PM EST! Join us for the premiere of the new electronic compilation 🎧",
            timestamp: "4 hours ago",
            likes: 89,
            comments: 12,
            event: {
                title: "Electronic Fusion Night",
                date: "Tonight 9 PM EST",
                attendees: 234
            }
        },
        {
            id: 3,
            type: "collaboration",
            user: {
                name: "DJ Phoenix",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
                verified: true,
                role: "Featured Artist"
            },
            content: "Looking for vocalists to collaborate on my upcoming EP. Drop your demos below! 🎤",
            timestamp: "6 hours ago",
            likes: 234,
            comments: 45,
            collaboration: {
                type: "Vocal Collaboration",
                genre: "Electronic Pop",
                deadline: "Next Friday"
            }
        }
    ],

    // Featured Artists
    featuredArtists: [
        {
            id: 1,
            name: "Luna Waves",
            genre: "Indie Pop",
            followers: 45600,
            monthlyListeners: 234000,
            image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
            verified: true,
            bio: "Creating dreamy soundscapes that transport you to another dimension",
            topTrack: "Midnight Echoes",
            isRising: true
        },
        {
            id: 2,
            name: "Neon Collective",
            genre: "Electronic",
            followers: 78900,
            monthlyListeners: 456000,
            image: "https://images.unsplash.com/photo-1571974599782-87624638275c?w=300&h=300&fit=crop",
            verified: true,
            bio: "Pushing the boundaries of electronic music with innovative sounds",
            topTrack: "Digital Dreams",
            isRising: false
        },
        {
            id: 3,
            name: "Street Poets",
            genre: "Hip-Hop",
            followers: 123400,
            monthlyListeners: 678000,
            image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
            verified: true,
            bio: "Telling stories of urban life through powerful lyrics and beats",
            topTrack: "Urban Stories",
            isRising: true
        }
    ],

    // Community Events
    events: [
        {
            id: 1,
            title: "Virtual Music Festival 2025",
            date: "March 15-17, 2025",
            time: "7:00 PM EST",
            type: "Festival",
            attendees: 12400,
            maxAttendees: 50000,
            image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
            description: "Three days of incredible music from artists around the world",
            genres: ["Pop", "Electronic", "Hip-Hop", "Indie"],
            isLive: false,
            isFeatured: true
        },
        {
            id: 2,
            title: "Indie Acoustic Sessions",
            date: "Every Friday",
            time: "8:00 PM EST",
            type: "Weekly Series",
            attendees: 890,
            maxAttendees: 2000,
            image: "https://images.unsplash.com/photo-1571974599782-87624638275c?w=400&h=300&fit=crop",
            description: "Intimate acoustic performances from emerging indie artists",
            genres: ["Indie", "Acoustic", "Folk"],
            isLive: true,
            isFeatured: false
        }
    ],

    // User Showcase
    userShowcase: [
        {
            id: 1,
            user: {
                name: "MusicLover23",
                avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
                level: "Community Champion"
            },
            activity: "Shared a new playlist",
            content: "Chill Vibes for Study Sessions",
            timestamp: "5 min ago",
            icon: "🎵"
        },
        {
            id: 2,
            user: {
                name: "BeatMaker_Pro",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
                level: "Producer"
            },
            activity: "Uploaded a new track",
            content: "Experimental Electronic Piece #3",
            timestamp: "12 min ago",
            icon: "🎧"
        },
        {
            id: 3,
            user: {
                name: "VocalVibes",
                avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face",
                level: "Rising Artist"
            },
            activity: "Started a collaboration",
            content: "Looking for producers for my next single",
            timestamp: "25 min ago",
            icon: "🤝"
        }
    ],

    // Navigation and UI Data
    navigation: {
        main: [
            { name: "Discover", icon: "🎵", active: true },
            { name: "Communities", icon: "👥", active: false },
            { name: "Artists", icon: "🎤", active: false },
            { name: "Events", icon: "📅", active: false },
            { name: "Billboard", icon: "📊", active: false }
        ],
        user: [
            { name: "My Profile", icon: "👤" },
            { name: "My Playlists", icon: "📝" },
            { name: "Following", icon: "❤️" },
            { name: "Settings", icon: "⚙️" }
        ]
    },

    // Search suggestions
    searchSuggestions: [
        "trending indie tracks",
        "electronic music communities",
        "hip-hop collaborations",
        "acoustic sessions",
        "new artist discoveries",
        "virtual concerts",
        "music production tips",
        "playlist recommendations"
    ]
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = communityData;
}