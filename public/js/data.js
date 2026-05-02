const GFM = {
  categories: [
    { id: 'video-editing', name: 'Video Editing', icon: '🎬', count: 1240, color: '#7C3AED' },
    { id: 'cinematography', name: 'Cinematography', icon: '🎥', count: 830, color: '#06B6D4' },
    { id: 'motion-graphics', name: 'Motion Graphics', icon: '✨', count: 960, color: '#EC4899' },
    { id: 'color-grading', name: 'Color Grading', icon: '🎨', count: 540, color: '#F59E0B' },
    { id: 'sound-design', name: 'Sound Design', icon: '🎵', count: 420, color: '#10B981' },
    { id: 'photography', name: 'Photography', icon: '📷', count: 1100, color: '#3B82F6' },
    { id: 'animation', name: '2D/3D Animation', icon: '🌀', count: 680, color: '#8B5CF6' },
    { id: 'vfx', name: 'VFX & Effects', icon: '💥', count: 310, color: '#EF4444' }
  ],
  creators: [
    { id: 1, name: 'Alex Rivera', username: 'alexrivera', initials: 'AR', color: '#7C3AED', role: 'Video Editor & Colorist', location: 'Los Angeles, USA', rating: 4.9, reviews: 312, gigs: 8, bio: 'Award-winning editor with 7+ years creating cinematic content for brands and films. Specialized in color grading and storytelling.', skills: ['Premiere Pro', 'DaVinci Resolve', 'After Effects', 'Color Grading'], hourlyRate: 85, cover: '#1a0a3a' },
    { id: 2, name: 'Sofia Chen', username: 'sofiachen', initials: 'SC', color: '#06B6D4', role: 'Cinematographer', location: 'New York, USA', rating: 4.8, reviews: 198, gigs: 6, bio: 'Documentary and commercial cinematographer. I craft visual stories that move audiences and elevate brands.', skills: ['Sony FX9', 'ARRI Alexa', 'Drone Op', 'Lighting'], hourlyRate: 120, cover: '#0a1a3a' },
    { id: 3, name: 'Marcus Webb', username: 'marcuswebb', initials: 'MW', color: '#EC4899', role: 'Motion Designer', location: 'London, UK', rating: 4.9, reviews: 445, gigs: 12, bio: 'Motion graphics specialist creating stunning visual identities, intros, and animated content for top brands worldwide.', skills: ['After Effects', 'Cinema 4D', 'Blender', 'Illustrator'], hourlyRate: 75, cover: '#2a0a2a' },
    { id: 4, name: 'Priya Sharma', username: 'priyasharma', initials: 'PS', color: '#F59E0B', role: 'VFX Artist', location: 'Mumbai, India', rating: 4.7, reviews: 167, gigs: 5, bio: 'VFX compositor and 3D generalist. Bringing impossible visions to life for Bollywood, ads, and indie films.', skills: ['Nuke', 'Houdini', 'Maya', 'Blender'], hourlyRate: 60, cover: '#2a1a0a' },
    { id: 5, name: 'Jordan Lee', username: 'jordanlee', initials: 'JL', color: '#10B981', role: 'Sound Designer', location: 'Toronto, Canada', rating: 4.8, reviews: 221, gigs: 7, bio: 'Professional sound designer and audio engineer. Crafting immersive soundscapes for film, games, and digital media.', skills: ['Pro Tools', 'Logic Pro', 'Ableton', 'Foley'], hourlyRate: 65, cover: '#0a2a1a' },
    { id: 6, name: 'Elena Vasquez', username: 'elenavasquez', initials: 'EV', color: '#3B82F6', role: 'Photographer', location: 'Barcelona, Spain', rating: 4.9, reviews: 389, gigs: 10, bio: 'Commercial and portrait photographer. Winner of 3 international photography awards with a client list spanning 40+ countries.', skills: ['Lightroom', 'Photoshop', 'Studio Lighting', 'Retouching'], hourlyRate: 90, cover: '#0a1020' },
    { id: 7, name: 'Kai Nakamura', username: 'kainakamura', initials: 'KN', color: '#8B5CF6', role: 'Animator', location: 'Tokyo, Japan', rating: 4.8, reviews: 276, gigs: 9, bio: 'Anime-influenced 2D/3D animator. Creating expressive, fluid animations for apps, games, and video content.', skills: ['Blender', 'Unity', 'Spine 2D', 'Toon Boom'], hourlyRate: 70, cover: '#1a0a2a' },
    { id: 8, name: 'Amara Osei', username: 'amaraosei', initials: 'AO', color: '#EF4444', role: 'Video Editor', location: 'Accra, Ghana', rating: 4.7, reviews: 134, gigs: 4, bio: 'Fast-turnaround YouTube and social media video editor. Helping creators grow their audience with engaging edits.', skills: ['Final Cut Pro', 'Premiere Pro', 'Capcut', 'Thumbnails'], hourlyRate: 40, cover: '#2a0a0a' }
  ],
  gigs: [
    { id: 1, title: 'I will edit your YouTube video with cinematic style', creator: 1, category: 'video-editing', price: { basic: 49, standard: 99, premium: 199 }, delivery: { basic: 3, standard: 5, premium: 7 }, rating: 4.9, reviews: 87, tags: ['YouTube', 'Cinematic', 'Color Grade'], thumb: '#1a0a3a', featured: true },
    { id: 2, title: 'Professional motion graphics intro for your brand', creator: 3, category: 'motion-graphics', price: { basic: 79, standard: 149, premium: 299 }, delivery: { basic: 4, standard: 6, premium: 10 }, rating: 5.0, reviews: 103, tags: ['Logo Intro', 'After Effects', 'Brand'], thumb: '#2a0a2a', featured: true },
    { id: 3, title: 'Cinematic drone + camera shoot for your project', creator: 2, category: 'cinematography', price: { basic: 299, standard: 599, premium: 999 }, delivery: { basic: 7, standard: 10, premium: 14 }, rating: 4.8, reviews: 54, tags: ['Drone', 'Commercial', '4K'], thumb: '#0a1a3a', featured: true },
    { id: 4, title: 'Hollywood-style color grading for your film', creator: 1, category: 'color-grading', price: { basic: 59, standard: 119, premium: 229 }, delivery: { basic: 2, standard: 4, premium: 7 }, rating: 4.9, reviews: 71, tags: ['DaVinci', 'Film Look', 'LUTs'], thumb: '#1a0a3a', featured: false },
    { id: 5, title: 'Explosive VFX and compositing for music videos', creator: 4, category: 'vfx', price: { basic: 149, standard: 299, premium: 599 }, delivery: { basic: 5, standard: 8, premium: 14 }, rating: 4.7, reviews: 43, tags: ['VFX', 'Compositing', 'Music Video'], thumb: '#2a1a0a', featured: true },
    { id: 6, title: 'Professional sound design for short films', creator: 5, category: 'sound-design', price: { basic: 69, standard: 129, premium: 249 }, delivery: { basic: 3, standard: 5, premium: 8 }, rating: 4.8, reviews: 62, tags: ['Sound', 'Film', 'Foley'], thumb: '#0a2a1a', featured: false },
    { id: 7, title: 'Commercial photography for products and brands', creator: 6, category: 'photography', price: { basic: 199, standard: 399, premium: 799 }, delivery: { basic: 5, standard: 7, premium: 10 }, rating: 4.9, reviews: 118, tags: ['Product', 'Commercial', 'Studio'], thumb: '#0a1020', featured: true },
    { id: 8, title: 'Anime-style 2D character animation', creator: 7, category: 'animation', price: { basic: 99, standard: 199, premium: 399 }, delivery: { basic: 7, standard: 10, premium: 14 }, rating: 4.8, reviews: 88, tags: ['Anime', '2D', 'Character'], thumb: '#1a0a2a', featured: false },
    { id: 9, title: 'Fast turnaround YouTube shorts and Reels editing', creator: 8, category: 'video-editing', price: { basic: 29, standard: 59, premium: 99 }, delivery: { basic: 1, standard: 2, premium: 3 }, rating: 4.7, reviews: 55, tags: ['Shorts', 'Reels', 'Social Media'], thumb: '#2a0a0a', featured: false },
    { id: 10, title: 'Corporate explainer video with motion graphics', creator: 3, category: 'motion-graphics', price: { basic: 199, standard: 399, premium: 799 }, delivery: { basic: 7, standard: 10, premium: 14 }, rating: 4.9, reviews: 76, tags: ['Explainer', 'Corporate', 'Animated'], thumb: '#2a0a2a', featured: false },
    { id: 11, title: 'Stunning 3D product visualization and animation', creator: 4, category: 'animation', price: { basic: 249, standard: 499, premium: 999 }, delivery: { basic: 10, standard: 14, premium: 21 }, rating: 4.7, reviews: 31, tags: ['3D', 'Product', 'Blender'], thumb: '#2a1a0a', featured: false },
    { id: 12, title: 'Wedding film editing — cinematic storytelling', creator: 1, category: 'video-editing', price: { basic: 149, standard: 299, premium: 499 }, delivery: { basic: 7, standard: 10, premium: 14 }, rating: 5.0, reviews: 95, tags: ['Wedding', 'Cinematic', 'Story'], thumb: '#1a0a3a', featured: false }
  ],
  reviews: [
    { id: 1, gigId: 1, client: 'TechBrand Co.', initials: 'TC', rating: 5, comment: 'Alex delivered beyond expectations! The cinematic quality blew our entire team away. Will definitely hire again.', date: '2 days ago' },
    { id: 2, gigId: 1, client: 'Mike Johnson', initials: 'MJ', rating: 5, comment: 'Fast, professional, and creative. My YouTube channel engagement went up 40% after the edit. Incredible work!', date: '1 week ago' },
    { id: 3, gigId: 2, client: 'StartupX', initials: 'SX', rating: 5, comment: 'The logo intro Marcus created is absolutely stunning. Our clients keep complimenting it on every call!', date: '3 days ago' },
    { id: 4, gigId: 3, client: 'LuxuryHomes', initials: 'LH', rating: 5, comment: 'Sofia shot our property in a way that made it look like a Hollywood film. Bookings doubled after the video.', date: '5 days ago' },
    { id: 5, gigId: 7, client: 'FashionBrand', initials: 'FB', rating: 5, comment: 'Elena is a true professional. The product photos are magazine-quality and were delivered on time. Highly recommend!', date: '1 week ago' }
  ],
  testimonials: [
    { id: 1, name: 'Ryan Torres', role: 'YouTube Creator (2.1M subs)', initials: 'RT', color: '#7C3AED', text: 'GFM changed my content game completely. I found my editor in less than an hour and the quality is consistently outstanding. This platform was built for creators.' },
    { id: 2, name: 'Sarah Kim', role: 'Marketing Director, NovaBrand', initials: 'SK', color: '#06B6D4', text: 'We\'ve hired from every major platform. GFM is different — the creative talent here is unmatched and the project flow is seamless. Our campaigns have never looked better.' },
    { id: 3, name: 'David Okafor', role: 'Indie Filmmaker', initials: 'DO', color: '#EC4899', text: 'As a filmmaker on a budget, GFM gave me access to professional-grade VFX and sound design. My short film got into 3 festivals thanks to the team I built here.' }
  ],
  stats: [
    { label: 'Creative Professionals', value: 12000, suffix: '+', icon: '👤' },
    { label: 'Projects Completed', value: 58000, suffix: '+', icon: '✅' },
    { label: 'Countries Reached', value: 120, suffix: '+', icon: '🌍' },
    { label: 'Total Earned by Creators', value: 2, suffix: 'M+', prefix: '$', icon: '💰' }
  ]
};
