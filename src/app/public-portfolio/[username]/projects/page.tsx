'use client'
import React, { useState } from 'react'
import { Portfolio, Project } from '@/types/portfolio'
import { usePortfolio } from '@/context/PortfolioContext'

interface ProjectsPageProps {
  portfolio: Portfolio | null | undefined
}

const ProjectsPage: React.FC<ProjectsPageProps> = () => {
  const { portfolio } = usePortfolio()
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
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-gray-500">
            <p>Portfolio data not available</p>
          </div>
        </div>
      </section>
    )
  }

  const projects = portfolio.projects || []

  // If no projects available
  if (projects.length === 0) {
    return (
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">All Projects</h2>
          <div className="text-gray-500 py-12">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p>No projects added yet</p>
          </div>
        </div>
      </section>
    )
  }

  // Separate featured and regular projects
  const featuredProjects = projects.filter(project => project.top)
  const regularProjects = projects.filter(project => !project.top)

  // Utility to format date for display
  const formatDate = (date: string | Date): string => {
    if (!date) return ''
    if (typeof date === 'string') return date
    if (date instanceof Date) return date.toISOString().slice(0, 7)
    return String(date)
  }

  // Ensure featuredProjects and regularProjects are arrays
  // Defensive: fallback to [] if undefined
  const safeFeaturedProjects = Array.isArray(featuredProjects) ? featuredProjects : []
  const safeRegularProjects = Array.isArray(regularProjects) ? regularProjects : []

  const ProjectCard: React.FC<{ project: Project; isFeatured?: boolean; index: number }> = ({ project, isFeatured = false, index }) => {
    const videoId = project.videoLink ? getYouTubeId(project.videoLink) : null
    const isPlaying = playingVideo === `${index}-${project.name}`

    return (
      <div className={`group rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 ${
        isFeatured 
          ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200' 
          : 'bg-white border border-gray-200'
      }`}>
        {/* Project Image/Video Container */}
        <div className="relative overflow-hidden">
          {/* Show YouTube embed if playing, otherwise show thumbnail */}
          {isPlaying && videoId ? (
            <div className="relative w-full h-64">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                title={`${project.name} - Video Demo`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="absolute inset-0 rounded-t-xl"
              />
              {/* Video Controls Overlay */}
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent p-4 z-10">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm font-medium bg-black/30 px-2 py-1 rounded">
                    🎥 Video Demo
                  </span>
                  <button
                    onClick={() => setPlayingVideo(null)}
                    className="bg-black/70 hover:bg-black/90 text-white p-2 rounded-full transition-colors duration-200"
                    title="Close video"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative h-48">
              <img 
                src={project.thumbnail} 
                alt={project.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              
              {/* Play Button for Video */}
              {videoId && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={() => setPlayingVideo(`${index}-${project.name}`)}
                    className="bg-red-600 hover:bg-red-700 text-white p-6 rounded-full shadow-lg transform hover:scale-110 transition-all duration-200"
                    title="Play video demo"
                  >
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </button>
                </div>
              )}
              
              {/* Featured Badge */}
              {isFeatured && (
                <div className="absolute top-3 right-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                    ⭐ Featured Project
                  </span>
                </div>
              )}
              
              {/* Video Available Badge */}
              {videoId && (
                <div className="absolute bottom-3 left-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    Video Demo
                  </span>
                </div>
              )}
              
              {/* Action Links Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                {project.liveLink && (
                  <a 
                    href={project.liveLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Live Demo
                  </a>
                )}
                {project.githubLink && (
                  <a 
                    href={project.githubLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors duration-200 text-sm font-medium"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    GitHub
                  </a>
                )}
                {videoId && (
                  <button
                    onClick={() => setPlayingVideo(`${index}-${project.name}`)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
                    title="Play video demo"
                  >
                    <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                    Video
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Project Content */}
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-200 flex-1">
              {project.name}
            </h3>
            {videoId && !isPlaying && (
              <button
                onClick={() => setPlayingVideo(`${index}-${project.name}`)}
                className="ml-3 text-red-600 hover:text-red-700 transition-colors duration-200"
                title="Play video demo"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </button>
            )}
          </div>
          
          <p className="text-gray-600 mb-4 leading-relaxed">
            {project.description}
          </p>
          
          {/* Project Duration */}
          <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {formatDate(project.startDate)} - {project.endDate === 'PRESENT' ? 'Present' : formatDate(project.endDate)}
          </div>
          
          {/* Skills Used */}
          {project.skills && project.skills.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold text-sm text-gray-800 mb-2">Technologies Used</h4>
              <div className="flex flex-wrap gap-2">
                {project.skills.map((skill: any, skillIdx: number) => (
                  <span 
                    key={skillIdx} 
                    className={`inline-flex items-center gap-1 rounded-lg px-3 py-1 text-xs font-medium border ${
                      isFeatured 
                        ? 'bg-white/70 border-yellow-200 text-gray-700' 
                        : 'bg-gray-100 border-gray-200 text-gray-700'
                    }`}
                  >
                    {skill.logo && (
                      <img 
                        src={skill.logo} 
                        alt={skill.name} 
                        className="w-4 h-4"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    )}
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Key Contributions */}
          {project.contributions && (
            <div className={`border-t pt-4 ${isFeatured ? 'border-yellow-200' : 'border-gray-200'}`}>
              <h4 className="font-semibold text-sm text-gray-800 mb-2">Key Contributions</h4>
              <ul className="space-y-1">
                {project.contributions.split('\n').filter(Boolean).map((contribution, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                      isFeatured ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}></span>
                    <span>{contribution.replace(/^•\s*/, '')}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">All Projects</h2>
        
        {/* Featured Projects Section */}
        {safeFeaturedProjects.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Featured Projects</h3>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                ⭐ {safeFeaturedProjects.length} Featured
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {safeFeaturedProjects.map((project, idx) => (
                <ProjectCard key={`featured-${idx}`} project={project} isFeatured={true} index={idx} />
              ))}
            </div>
          </div>
        )}
        
        {/* Regular Projects Section */}
        {safeRegularProjects.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <h3 className="text-2xl font-bold text-gray-800">
                {safeFeaturedProjects.length > 0 ? 'Other Projects' : 'All Projects'}
              </h3>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200">
                {safeRegularProjects.length} Project{safeRegularProjects.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {safeRegularProjects.map((project, idx) => (
                <ProjectCard key={`regular-${idx}`} project={project} isFeatured={false} index={idx} />
              ))}
            </div>
          </div>
        )}
        
        {/* Projects Summary */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Projects Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{projects.length}</div>
              <div className="text-sm text-gray-600">Total Projects</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-yellow-600">{safeFeaturedProjects.length}</div>
              <div className="text-sm text-gray-600">Featured</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-green-600">
                {projects.filter(p => p.liveLink).length}
              </div>
              <div className="text-sm text-gray-600">Live Demos</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-purple-600">
                {projects.filter(p => p.githubLink).length}
              </div>
              <div className="text-sm text-gray-600">Open Source</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-red-600">
                {projects.filter(p => p.videoLink && getYouTubeId(p.videoLink)).length}
              </div>
              <div className="text-sm text-gray-600">Video Demos</div>
            </div>
          </div>
        </div>
        
        {/* Video Demo Notice */}
        {projects.some(p => p.videoLink && getYouTubeId(p.videoLink)) && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <span className="text-red-800 font-medium">Video Demos Available</span>
            </div>
            <p className="text-red-700 text-sm mt-1">
              Click the play button on any project card to watch embedded video demonstrations directly on this page.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default ProjectsPage