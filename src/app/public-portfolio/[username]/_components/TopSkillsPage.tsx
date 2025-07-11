import React from 'react'
import Link from 'next/link'
import { Portfolio, Skill } from '@/types/portfolio'

// Type for MongoDB number format
interface MongoNumber {
  $numberInt: string
}

// Extended Skill type to handle confidence properly
interface ExtendedSkill extends Omit<Skill, 'confidence'> {
  confidence: number | MongoNumber
}

interface TopSkillsPageProps {
  portfolio: Portfolio | null | undefined
  username?: string // Add username prop for routing
}

const TopSkillsPage: React.FC<TopSkillsPageProps> = ({ portfolio, username }) => {
  // Add null checks for portfolio and skills
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

  const skills = (portfolio.skills as ExtendedSkill[]) || []
  const topSkills = skills.filter(skill => skill.top)

  // If no skills available at all
  if (skills.length === 0) {
    return (
      <section className="py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Top Skills</h2>
          <p className="text-gray-600 mb-4">My most proficient and frequently used technologies</p>
          
          <div className="text-gray-500 py-12">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <p>No skills added yet</p>
            {username && (
              <Link 
                href={`/public-portfolio/${username}/skills`}
                className="inline-block mt-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                Add skills
              </Link>
            )}
          </div>
        </div>
      </section>
    )
  }

  // Sort top skills by confidence (descending)
  const sortedTopSkills = topSkills.sort((a, b) => {
    const confidenceA = typeof a.confidence === 'object' && 'a.confidence.$numberInt' in a.confidence 
      ? parseInt(a.confidence.$numberInt) 
      : Number(a.confidence)
    const confidenceB = typeof b.confidence === 'object' && 'b.confidence.$numberInt' in b.confidence 
      ? parseInt(b.confidence.$numberInt) 
      : Number(b.confidence)
    return confidenceB - confidenceA
  })

  const getConfidenceLevel = (confidence: number | MongoNumber): string => {
    const value = typeof confidence === 'object' ? parseInt(confidence.$numberInt) : confidence
    if (value >= 80) return 'Expert'
    if (value >= 60) return 'Proficient'
    if (value >= 40) return 'Intermediate'
    return 'Beginner'
  }

  const getConfidenceValue = (confidence: number | MongoNumber): number => {
    return typeof confidence === 'object' ? parseInt(confidence.$numberInt) : confidence
  }

  return (
    <section className="py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Top Skills</h2>
          <p className="text-gray-600 mb-4">My most proficient and frequently used technologies</p>
          
          {/* See All Skills Link */}
          {username && (
            <Link 
              href={`/public-portfolio/${username}/skills`}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
            >
              See All Skills
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
        
        {/* Top Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedTopSkills.map(skill => {
            const confidenceValue = getConfidenceValue(skill.confidence)
            
            return (
              <div 
                key={skill.name} 
                className="relative bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-4 transition-all duration-200 hover:shadow-lg hover:scale-105"
              >
                <div className="absolute top-2 right-2">
                  <span className="text-yellow-500 text-sm">⭐</span>
                </div>
                
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                    <img 
                      src={skill.logo} 
                      alt={skill.name} 
                      className="w-6 h-6"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{skill.name}</h4>
                    <p className="text-sm text-blue-600 font-medium">{getConfidenceLevel(skill.confidence)}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        confidenceValue >= 80 ? 'bg-green-500' :
                        confidenceValue >= 60 ? 'bg-blue-500' :
                        confidenceValue >= 40 ? 'bg-yellow-500' : 'bg-gray-400'
                      }`}
                      style={{ width: `${confidenceValue}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{confidenceValue}%</span>
                </div>
              </div>
            )
          })}
        </div>
        
        {/* Empty state if no top skills */}
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
                className="inline-block mt-2 text-blue-600 hover:text-blue-800 font-medium"
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