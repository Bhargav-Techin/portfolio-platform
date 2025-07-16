'use client'
import * as React from 'react'
import Timeline from '@mui/lab/Timeline'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent'
import { Portfolio } from '@/types/portfolio'
import Link from 'next/link'
import Image from 'next/image'

interface TopProjectsTimelineProps {
  portfolio: Portfolio | null | undefined
  username?: string
}

const getYouTubeId = (url: string): string | null => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : null
}

const TopProjectsPage: React.FC<TopProjectsTimelineProps> = ({ portfolio, username }) => {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (!portfolio) {
    return (
      <section className="py-8" style={{
        '--theme-bg': '#0a0f1a',
        '--theme-card': '#1a1f2e',
        '--theme-card-hover': '#242938',
        '--theme-border': '#0a0f1a',
        '--theme-text-primary': '#e2e8f0',
        '--theme-text-secondary': '#94a3b8',
        '--theme-text-muted': '#64748b',
        '--theme-accent': '#3b82f6',
        '--theme-accent-hover': '#2563eb',
        backgroundColor: 'var(--theme-bg)'
      } as React.CSSProperties}>
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="text-gray-500">
            <p>Portfolio data not available</p>
          </div>
        </div>
      </section>
    )
  }

  const topProjects = (portfolio.projects || []).filter((p) => p.top)

  if (topProjects.length === 0) {
    return (
      <section className="py-8" style={{
        '--theme-bg': '#0a0f1a',
        '--theme-card': '#1a1f2e',
        '--theme-card-hover': '#242938',
        '--theme-border': '#0a0f1a',
        '--theme-text-primary': '#e2e8f0',
        '--theme-text-secondary': '#94a3b8',
        '--theme-text-muted': '#64748b',
        '--theme-accent': '#3b82f6',
        '--theme-accent-hover': '#2563eb',
        backgroundColor: 'var(--theme-bg)'
      } as React.CSSProperties}>
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-600 bg-clip-text text-transparent">Top Projects</h2>
          <p className="mb-4 text-sm md:text-base" style={{ color: 'var(--theme-text-secondary)' }}>My most significant and impactful work</p>

          <div className="py-12" style={{ color: 'var(--theme-text-muted)' }}>
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <p className="text-sm md:text-base">No top projects added yet</p>
            {username && (
              <Link
                href={`/public-portfolio/${username}/projects`}
                className="inline-block mt-2 text-sm md:text-base"
                style={{ color: 'var(--theme-accent)' }}
              >
                Add projects
              </Link>
            )}
          </div>
        </div>
      </section>
    )
  }

  // Mobile layout - stack everything vertically
  if (isMobile) {
    return (
      <section className="py-8" style={{
        '--theme-bg': '#0a0f1a',
        '--theme-card': '#1a1f2e',
        '--theme-card-hover': '#242938',
        '--theme-border': '#0a0f1a',
        '--theme-text-primary': '#e2e8f0',
        '--theme-text-secondary': '#94a3b8',
        '--theme-text-muted': '#64748b',
        '--theme-accent': '#3b82f6',
        '--theme-accent-hover': '#2563eb',
        backgroundColor: 'var(--theme-bg)'
      } as React.CSSProperties}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-600 bg-clip-text text-transparent">Top Projects</h2>
            <p className="text-base mb-4" style={{ color: 'var(--theme-text-secondary)' }}>My most significant and impactful work</p>

            {username && (
              <Link
                href={`/public-portfolio/${username}/projects`}
                className="inline-flex items-center gap-2 font-medium transition-colors duration-200 text-sm"
                style={{ color: 'var(--theme-accent)' }}
              >
                See All Projects
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>

          <div className="space-y-6">
            {topProjects.map((project, idx) => {
              const videoId = project.videoLink ? getYouTubeId(project.videoLink) : null

              return (
                <div
                  key={idx}
                  className="rounded-lg p-4 shadow-lg transition-all duration-300 hover:shadow-xl border"
                  style={{
                    backgroundColor: 'var(--theme-card)',
                    borderColor: 'var(--theme-border)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--theme-card-hover)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--theme-card)'
                  }}
                >
                  {/* Mobile: Video/Image first */}
                  <div className="mb-4">
                    {videoId ? (
                      <div
                        className="aspect-video w-full rounded-lg overflow-hidden shadow-lg"
                        style={{
                          backgroundColor: 'var(--theme-card)',
                          border: '1px solid var(--theme-border)'
                        }}
                      >
                        <iframe
                          src={`https://www.youtube.com/embed/${videoId}`}
                          title={project.name}
                          frameBorder="0"
                          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                        ></iframe>
                      </div>
                    ) : project.thumbnail ? (
                      <div
                        className="aspect-video w-full rounded-lg overflow-hidden shadow-lg"
                        style={{
                          backgroundColor: 'var(--theme-card)',
                          border: '1px solid var(--theme-border)'
                        }}
                      >
                        <Image
                          src={project.thumbnail}
                          alt={project.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div
                        className="aspect-video w-full rounded-lg flex items-center justify-center"
                        style={{
                          backgroundColor: 'var(--theme-card)',
                          border: '1px solid var(--theme-border)'
                        }}
                      >
                        <div className="text-center">
                          <svg
                            className="w-12 h-12 mx-auto mb-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            style={{ color: 'var(--theme-text-muted)' }}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-sm" style={{ color: 'var(--theme-text-muted)' }}>No preview</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Mobile: Project Info */}
                  <div>
                    <h3
                      className="font-bold text-lg mb-2"
                      style={{ color: 'var(--theme-text-primary)' }}
                    >
                      {project.name}
                    </h3>

                    {/* Date Range */}
                    {(project.startDate || project.endDate) && (
                      <div className="flex items-center gap-2 mb-3">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--theme-text-muted)' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm font-medium" style={{ color: 'var(--theme-text-muted)' }}>
                          {project.startDate && new Date(project.startDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short'
                          })}
                          {project.startDate && ' - '}
                          {project.endDate ? new Date(project.endDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short'
                          }) : (project.startDate ? 'Present' : '')}
                        </span>
                      </div>
                    )}

                    <p
                      className="text-sm leading-relaxed mb-4 line-clamp-3"
                      style={{ color: 'var(--theme-text-secondary)' }}
                    >
                      {project.description}
                    </p>

                    {/* Skills Used */}
                    {project.skills && project.skills.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-sm mb-2" style={{ color: 'var(--theme-text-secondary)' }}>Technologies Used</h4>
                        <div className="flex flex-wrap gap-2">
                          {project.skills.map((skill: any, skillIdx: number) => (
                            <span
                              key={skillIdx}
                              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium bg-white/90 border border-gray-600/50 text-black"
                            >
                              {skill.logo && (
                                <Image
                                  width={12}
                                  height={12}
                                  src={skill.logo}
                                  alt={skill.name}
                                  className="rounded"
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

                    <div className="flex flex-wrap gap-3">
                      {project.liveLink && (
                        <Link
                          href={project.liveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm font-medium transition-colors duration-200 hover:opacity-80 hover:underline"
                          style={{ color: 'var(--theme-accent)' }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Live Demo
                        </Link>
                      )}
                      {project.githubLink && (
                        <Link
                          href={project.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm font-medium transition-colors duration-200 hover:opacity-80 hover:underline"
                          style={{ color: 'var(--theme-text-secondary)' }}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                          </svg>
                          GitHub
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    )
  }

  // Desktop layout - keep original timeline
  return (
    <section className="py-8" style={{
      '--theme-bg': '#0a0f1a',
      '--theme-card': '#1a1f2e',
      '--theme-card-hover': '#242938',
      '--theme-border': '#0a0f1a',
      '--theme-text-primary': '#e2e8f0',
      '--theme-text-secondary': '#94a3b8',
      '--theme-text-muted': '#64748b',
      '--theme-accent': '#3b82f6',
      '--theme-accent-hover': '#2563eb',
      backgroundColor: 'var(--theme-bg)'
    } as React.CSSProperties}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-600 bg-clip-text text-transparent">Top Projects</h2>
          <p className="text-lg mb-4" style={{ color: 'var(--theme-text-secondary)' }}>My most significant and impactful work</p>

          {username && (
            <Link
              href={`/public-portfolio/${username}/projects`}
              className="inline-flex items-center gap-2 font-medium transition-colors duration-200"
              style={{ color: 'var(--theme-accent)' }}
            >
              See All Projects
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>

        <Timeline
          position="alternate"
          sx={{
            '& .MuiTimelineItem-root': {
              '&:before': {
                content: 'none',
              },
            },
            '& .MuiTimelineConnector-root': {
              backgroundColor: 'var(--theme-accent)',
              width: '2px',
            },
            '& .MuiTimelineDot-root': {
              backgroundColor: 'var(--theme-accent)',
              border: '3px solid var(--theme-card)',
              boxShadow: '0 0 0 4px var(--theme-accent-hover)',
              width: '20px',
              height: '20px',
            },
            '& .MuiTimelineContent-root': {
              padding: '16px 20px',
            },
            '& .MuiTimelineOppositeContent-root': {
              padding: '16px 20px',
            },
          }}
        >
          {topProjects.map((project, idx) => {
            const videoId = project.videoLink ? getYouTubeId(project.videoLink) : null

            return (
              <TimelineItem key={idx}>
                {/* LEFT: YouTube preview */}
                <TimelineOppositeContent sx={{ flex: 1 }}>
                  {videoId ? (
                    <div
                      className="aspect-video w-full rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105"
                      style={{
                        backgroundColor: 'var(--theme-card)',
                        border: '1px solid var(--theme-border)'
                      }}
                    >
                      <iframe
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title={project.name}
                        frameBorder="0"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      ></iframe>
                    </div>
                  ) : project.thumbnail ? (
                    <div
                      className="aspect-video w-full rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105"
                      style={{
                        backgroundColor: 'var(--theme-card)',
                        border: '1px solid var(--theme-border)'
                      }}
                    >
                      <Image
                        src={project.thumbnail}
                        alt={project.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div
                      className="aspect-video w-full rounded-lg flex items-center justify-center"
                      style={{
                        backgroundColor: 'var(--theme-card)',
                        border: '1px solid var(--theme-border)'
                      }}
                    >
                      <div className="text-center">
                        <svg
                          className="w-12 h-12 mx-auto mb-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          style={{ color: 'var(--theme-text-muted)' }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm" style={{ color: 'var(--theme-text-muted)' }}>No preview</p>
                      </div>
                    </div>
                  )}
                </TimelineOppositeContent>

                {/* TIMELINE SEPARATOR */}
                <TimelineSeparator>
                  <TimelineDot />
                  {idx < topProjects.length - 1 && <TimelineConnector />}
                </TimelineSeparator>

                {/* RIGHT: Project Info */}
                <TimelineContent sx={{ flex: 1 }}>
                  <div
                    className="rounded-lg p-6 shadow-lg transition-all duration-300 hover:shadow-xl border"
                    style={{
                      backgroundColor: 'var(--theme-card)',
                      borderColor: 'var(--theme-border)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--theme-card-hover)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--theme-card)'
                    }}
                  >
                    <h3
                      className="font-bold text-xl mb-3"
                      style={{ color: 'var(--theme-text-primary)' }}
                    >
                      {project.name}
                    </h3>

                    {/* Date Range */}
                    {(project.startDate || project.endDate) && (
                      <div className={`flex gap-2 mb-3 ${idx % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--theme-text-muted)' }}>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm font-medium" style={{ color: 'var(--theme-text-muted)' }}>
                          {project.startDate && new Date(project.startDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short'
                          })}
                          {project.startDate && ' - '}
                          {project.endDate ? new Date(project.endDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short'
                          }) : (project.startDate ? 'Present' : '')}
                        </span>
                      </div>
                    )}

                    <p
                      className="text-sm leading-relaxed mb-4 line-clamp-3"
                      style={{ color: 'var(--theme-text-secondary)' }}
                    >
                      {project.description}
                    </p>

                    {/* Skills Used */}
                    {project.skills && project.skills.length > 0 && (
                      <div className={`gap-2 mb-3 ${idx % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                        <h4 className="font-semibold text-sm text-gray-300 mb-2">Technologies Used</h4>
                        <div className={`flex gap-2 mb-3 ${idx % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                          {project.skills.map((skill: any, skillIdx: number) => (
                            <span
                              key={skillIdx}
                              className="inline-flex items-center gap-2 rounded-lg px-3 py-1 text-xs font-medium bg-white/90 border border-gray-600/50 text-black-300"
                            >
                              {skill.logo && (
                                <Image
                                  width={16}
                                  height={16}
                                  src={skill.logo}
                                  alt={skill.name}
                                  className="rounded"
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

                    <div className={`flex gap-2 mb-3 ${idx % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                      {project.liveLink && (
                        <Link
                          href={project.liveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-medium transition-colors duration-200 hover:opacity-80 hover:underline"
                          style={{ color: 'var(--theme-accent)' }}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Live Demo
                        </Link>
                      )}
                      {project.githubLink && (
                        <Link
                          href={project.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-medium transition-colors duration-200 hover:opacity-80 hover:underline"
                          style={{ color: 'var(--theme-text-secondary)' }}
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                          </svg>
                          GitHub
                        </Link>
                      )}
                    </div>

                  </div>
                </TimelineContent>
              </TimelineItem>
            )
          })}
        </Timeline>
      </div>
    </section>
  )
}


export default TopProjectsPage