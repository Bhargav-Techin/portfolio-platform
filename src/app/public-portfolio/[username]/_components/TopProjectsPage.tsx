import React, { useState } from 'react'
import Link from 'next/link'
import { Portfolio, Project } from '@/types/portfolio'

interface TopProjectsPageProps {
  portfolio: Portfolio | null | undefined
  username?: string
}

const TopProjectsPage: React.FC<TopProjectsPageProps> = ({ portfolio, username }) => {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null)

  // Function to extract YouTube video ID from URL
  const getYouTubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  // Add null checks for portfolio and projects
  if (!portfolio) {
    return (
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="text-gray-500">
            <p>Portfolio data not available</p>
          </div>
        </div>
      </section>
    )
  }

  const projects = portfolio.projects || []
  const topProjects = projects.filter(project => project.top)

  // If no projects available at all
  if (projects.length === 0) {
    return (
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Featured Projects</h2>
          <p className="text-gray-600 mb-4">Showcasing my best work and achievements</p>
          
          <div className="text-gray-500 py-12">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p>No projects added yet</p>
            {username && (
              <Link 
                href={`/public-portfolio/${username}/projects`}
                className="inline-block mt-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                Add projects
              </Link>
            )}
          </div>
        </div>
      </section>
    )
  }

  // Utility to format date for display
  const formatDate = (date: string | Date): string => {
    if (!date) return ''
    if (typeof date === 'string') return date
    if (date instanceof Date) return date.toISOString().slice(0, 7)
    return String(date)
  }

  return (
    <section className="py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Featured Projects</h2>
          <p className="text-gray-600 mb-4">Showcasing my best work and achievements</p>
          
          {/* See All Projects Link */}
          {username && (
            <Link 
              href={`/public-portfolio/${username}/projects`}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
            >
              See All Projects
              <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 5l7 7-7 7" 
                />
              </svg>
            </Link>
          )}
        </div>
        
        {/* Top Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topProjects.map((project, idx) => {
            const videoId = project.videoLink ? getYouTubeId(project.videoLink) : null
            const isPlaying = playingVideo === `${idx}-${project.name}`
            
            return (
              <div 
                key={idx} 
                className="group relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
              >
                {/* Project Image/Video Container */}
                <div className="relative h-48 overflow-hidden">
                  {/* Show YouTube embed if playing, otherwise show thumbnail */}
                  {isPlaying && videoId ? (
                    <div className="relative w-full h-full">
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                        title={`${project.name} - Video Demo`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                        className="absolute inset-0"
                      />
                      {/* Close Video Button */}
                      <button
                        onClick={() => setPlayingVideo(null)}
                        className="absolute top-2 right-2 z-10 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full transition-colors duration-200"
                        title="Close video"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Thumbnail Image */}
                      <img 
                        src={project.thumbnail} 
                        alt={project.name} 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      
                      {/* Play Button Overlay for Video */}
                      {videoId && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <button
                            onClick={() => setPlayingVideo(`${idx}-${project.name}`)}
                            className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-lg transform hover:scale-110 transition-all duration-200 group-hover:shadow-xl"
                            title="Play video demo"
                          >
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </button>
                        </div>
                      )}
                      
                      {/* Video Duration Badge */}
                      {videoId && (
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs font-medium">
                          <svg className="w-3 h-3 inline mr-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                          Demo
                        </div>
                      )}
                    </>
                  )}
                  
                  {/* Featured Badge - Always Visible */}
                  <div className="absolute top-3 left-3 z-30">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-300 shadow-sm">
                      ⭐ Featured
                    </span>
                  </div>
                  
                  {/* Hover Overlay with Project Details */}
                  {!isPlaying && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 z-20">
                      <div className="absolute inset-0 flex flex-col justify-end p-4">
                        {/* Project Title in Overlay */}
                        <h3 className="text-white font-bold text-lg mb-2 leading-tight">
                          {project.name}
                        </h3>
                        
                        {/* Brief Description */}
                        <p className="text-gray-200 text-sm mb-3 line-clamp-2 leading-relaxed">
                          {project.description}
                        </p>
                        
                        {/* Project Duration */}
                        <div className="flex items-center gap-2 mb-3 text-xs text-gray-300">
                          <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{formatDate(project.startDate)} - {project.endDate === 'PRESENT' ? 'Present' : formatDate(project.endDate)}</span>
                        </div>
                        
                        {/* Technologies */}
                        {project.skills && project.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-4">
                            {project.skills.slice(0, 4).map((skill: any, skillIdx: number) => (
                              <span 
                                key={skillIdx} 
                                className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-md px-2 py-1 text-xs text-white border border-white/10"
                              >
                                {skill.logo && (
                                  <img 
                                    src={skill.logo} 
                                    alt={skill.name} 
                                    className="w-3 h-3 flex-shrink-0"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none'
                                    }}
                                  />
                                )}
                                <span className="truncate">{skill.name}</span>
                              </span>
                            ))}
                            {project.skills.length > 4 && (
                              <span className="inline-flex items-center px-2 py-1 text-xs text-gray-300 bg-white/10 rounded-md border border-white/10">
                                +{project.skills.length - 4}
                              </span>
                            )}
                          </div>
                        )}
                        
                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          {project.liveLink && (
                            <a 
                              href={project.liveLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white text-center py-2 px-3 rounded-lg transition-colors duration-200 text-sm font-medium min-w-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Live Demo
                            </a>
                          )}
                          {project.githubLink && (
                            <a 
                              href={project.githubLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex-1 bg-gray-800 hover:bg-gray-900 text-white text-center py-2 px-3 rounded-lg transition-colors duration-200 text-sm font-medium min-w-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              GitHub
                            </a>
                          )}
                          {videoId && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setPlayingVideo(`${idx}-${project.name}`)
                              }}
                              className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors duration-200 flex items-center justify-center flex-shrink-0"
                              title="Play video demo"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Simple Bottom Info - Always Visible */}
                <div className="p-3">
                  <h3 className="font-semibold text-gray-800 text-sm leading-tight line-clamp-1">
                    {project.name}
                  </h3>
                  {videoId && (
                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                      <span>Video Demo Available</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        
        {/* Empty state if no top projects */}
        {topProjects.length === 0 && projects.length > 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-gray-500 mb-2">No featured projects marked yet</p>
            <p className="text-sm text-gray-400 mb-4">Mark your best projects as featured to showcase them here</p>
            {username && (
              <Link 
                href={`/public-portfolio/${username}/projects`}
                className="inline-block text-blue-600 hover:text-blue-800 font-medium"
              >
                View all projects
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default TopProjectsPage