'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { 
  Palette, 
  Target, 
  TrendingUp, 
  MessageSquare,
  Filter,
  ExternalLink,
  Download,
  Heart
} from 'lucide-react'

const showcaseItems = [
  {
    id: 1,
    type: 'logo',
    title: 'Tech Startup Logo',
    description: 'Modern minimalist logo for a fintech company',
    image: '/placeholder.svg',
    category: 'Logo',
    icon: Palette,
    color: 'emerald'
  },
  {
    id: 2,
    type: 'banner',
    title: 'Campaign Banner',
    description: 'Eye-catching social media banner for product launch',
    image: '/placeholder.svg',
    category: 'Banner',
    icon: Target,
    color: 'teal'
  },
  {
    id: 3,
    type: 'poster',
    title: 'Event Poster',
    description: 'Professional conference poster with modern typography',
    image: '/placeholder.svg',
    category: 'Poster',
    icon: TrendingUp,
    color: 'green'
  },
  {
    id: 4,
    type: 'logo',
    title: 'Restaurant Brand',
    description: 'Elegant logo design for fine dining establishment',
    image: '/placeholder.svg',
    category: 'Logo',
    icon: Palette,
    color: 'emerald'
  },
  {
    id: 5,
    type: 'banner',
    title: 'E-commerce Banner',
    description: 'Conversion-optimized banner for online store',
    image: '/placeholder.svg',
    category: 'Banner',
    icon: Target,
    color: 'teal'
  },
  {
    id: 6,
    type: 'poster',
    title: 'Music Festival',
    description: 'Vibrant poster design for summer music festival',
    image: '/placeholder.svg',
    category: 'Poster',
    icon: TrendingUp,
    color: 'green'
  }
]

const categories = [
  { id: 'all', name: 'All', icon: Filter },
  { id: 'logo', name: 'Logos', icon: Palette },
  { id: 'banner', name: 'Banners', icon: Target },
  { id: 'poster', name: 'Posters', icon: TrendingUp }
]

export default function ImageShowcase() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)

  const filteredItems = activeFilter === 'all' 
    ? showcaseItems 
    : showcaseItems.filter(item => item.type === activeFilter)

  return (
    <section id="showcase" className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge className="bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 text-purple-300 px-4 py-2 mb-6">
            <MessageSquare className="w-4 h-4 mr-2" />
            GALLERY
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-pink-300 to-indigo-400 bg-clip-text text-transparent">
              AI-Generated Examples
            </span>
            <br />
            <span className="text-gray-200 text-3xl md:text-5xl">See What's Possible</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Explore our gallery of AI-generated brand assets. Each piece demonstrates the power and versatility 
            of our creative AI tools.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => {
            const Icon = category.icon
            const isActive = activeFilter === category.id
            
            return (
              <Button
                key={category.id}
                variant={isActive ? "default" : "ghost"}
                onClick={() => setActiveFilter(category.id)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/25' 
                    : 'text-gray-300 hover:text-white hover:bg-white/10 border border-gray-700 hover:border-purple-500/50'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {category.name}
              </Button>
            )
          })}
        </div>

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => {
            const Icon = item.icon
            const isHovered = hoveredItem === item.id
            
            return (
              <Card 
                key={item.id}
                className="group relative bg-black/80 backdrop-blur-xl border border-gray-700 hover:border-purple-500/50 shadow-2xl transition-all duration-500 rounded-2xl overflow-hidden hover:scale-105"
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  
                  {/* Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition-opacity duration-300 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  }`}>
                    {/* Action Buttons */}
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <Button size="sm" variant="secondary" className="bg-white/20 backdrop-blur-sm hover:bg-white/30">
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="secondary" className="bg-white/20 backdrop-blur-sm hover:bg-white/30">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="secondary" className="bg-white/20 backdrop-blur-sm hover:bg-white/30">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {/* Content */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Icon className={`w-4 h-4 text-${item.color}-400`} />
                        <Badge className={`bg-${item.color}-500/20 text-${item.color}-300 border-${item.color}-500/30`}>
                          {item.category}
                        </Badge>
                      </div>
                      <h3 className="text-white font-semibold text-lg mb-1">{item.title}</h3>
                      <p className="text-gray-300 text-sm">{item.description}</p>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/25 px-8 py-3">
            Load More Examples
          </Button>
        </div>
      </div>
    </section>
  )
}
