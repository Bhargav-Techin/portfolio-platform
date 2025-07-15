import React from 'react'
import Link from 'next/link'
import { Portfolio, Skill } from '@/types/portfolio'
import SkillSphere from '@/components/SkillSphere'

interface MongoNumber {
  $numberInt: string
}

interface ExtendedSkill extends Omit<Skill, 'confidence'> {
  confidence: number | MongoNumber
}

interface TopSkillsPageProps {
  portfolio: Portfolio | null | undefined
  username?: string
}

const TopSkillsPage: React.FC<TopSkillsPageProps> = ({ portfolio, username }) => {
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

  const skills = (portfolio.skills as ExtendedSkill[]) || []
  const topSkills = skills.filter(skill => skill.top)

  if (skills.length === 0) {
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
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">Top Skills</h2>
          <p className="mb-4" style={{ color: 'var(--theme-text-secondary)' }}>My most proficient and frequently used technologies</p>

          <div className="py-12" style={{ color: 'var(--theme-text-muted)' }}>
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <p>No skills added yet</p>
            {username && (
              <Link
                href={`/public-portfolio/${username}/skills`}
                className="inline-block mt-2"
                style={{ color: 'var(--theme-accent)' }}
              >
                Add skills
              </Link>
            )}
          </div>
        </div>
      </section>
    )
  }

  const sortedTopSkills = topSkills.sort((a, b) => {
    const confidenceA = typeof a.confidence === 'object' ? parseInt(a.confidence.$numberInt) : a.confidence
    const confidenceB = typeof b.confidence === 'object' ? parseInt(b.confidence.$numberInt) : b.confidence
    return confidenceB - confidenceA
  })

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
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">Top Skills</h2>
          <p className="mb-4" style={{ color: 'var(--theme-text-secondary)' }}>My most proficient and frequently used technologies</p>

          {username && (
            <Link
              href={`/public-portfolio/${username}/skills`}
              className="inline-flex items-center gap-2 font-medium transition-colors duration-200"
              style={{ color: 'var(--theme-accent)' }}
            >
              See All Skills
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedTopSkills.map(skill => {
            const confidenceValue = typeof skill.confidence === 'object' ? parseInt(skill.confidence.$numberInt) : skill.confidence

            return (
              <SkillSphere
                key={skill.name}
                name={skill.name}
                logo={skill.logo}
                confidence={confidenceValue}
              />
            )
          })}
        </div>

        {sortedTopSkills.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <p className="text-gray-500">No top skills marked yet</p>
            {username && (
              <Link
                href={`/public-portfolio/${username}/skills`}
                className="inline-block mt-2"
                style={{ color: 'var(--theme-accent)' }}
              >
                View all skills
              </Link>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default TopSkillsPage
