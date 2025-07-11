'use client'
import React from 'react'
import { Portfolio, Skill } from '@/types/portfolio'
import { usePortfolio } from '@/context/PortfolioContext'

// Type for MongoDB number format
interface MongoNumber {
  $numberInt: string
}

// Extended Skill type to handle confidence properly
interface ExtendedSkill extends Omit<Skill, 'confidence'> {
  confidence: number | MongoNumber
}

interface SkillsPageProps {
  portfolio: Portfolio | null | undefined
}

const SkillsPage: React.FC<SkillsPageProps> = () => {
  const { portfolio, loading, error } = usePortfolio()

  // Add null checks for portfolio and skills
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

  const skills = (portfolio.skills as ExtendedSkill[]) || []

  // If no skills available
  if (skills.length === 0) {
    return (
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">{portfolio.fullName} Skills</h2>
          <div className="text-gray-500 py-12">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <p>No skills added yet</p>
          </div>
        </div>
      </section>
    )
  }
  
  // Group skills by type
  const skillsByType = skills.reduce((acc, skill) => {
    if (!acc[skill.type]) {
      acc[skill.type] = []
    }
    acc[skill.type].push(skill)
    return acc
  }, {} as Record<string, ExtendedSkill[]>)

  // Sort skills within each type by confidence (descending)
  Object.keys(skillsByType).forEach(type => {
    skillsByType[type].sort((a, b) => {
      const confidenceA = typeof a.confidence === 'object' && 'a.confidence.$numberInt' in a.confidence 
        ? parseInt(a.confidence.$numberInt) 
        : Number(a.confidence)
      const confidenceB = typeof b.confidence === 'object' && 'b.confidence.$numberInt' in b.confidence 
        ? parseInt(b.confidence.$numberInt) 
        : Number(b.confidence)
      return confidenceB - confidenceA
    })
  })

  const getConfidenceLevel = (confidence: number | MongoNumber): string => {
    const value = typeof confidence === 'object' ? parseInt(confidence.$numberInt) : confidence
    if (value >= 80) return 'Expert'
    if (value >= 60) return 'Proficient'
    if (value >= 40) return 'Intermediate'
    return 'Beginner'
  }

  const getProgressWidth = (confidence: number | MongoNumber): string => {
    const value = typeof confidence === 'object' ? parseInt(confidence.$numberInt) : confidence
    return `${value}%`
  }

  const getConfidenceValue = (confidence: number | MongoNumber): number => {
    return typeof confidence === 'object' ? parseInt(confidence.$numberInt) : confidence
  }

  const typeOrder = ['Programming Language', 'Framework', 'Database', 'Cloud Platform', 'DevOps']
  const sortedTypes = Object.keys(skillsByType).sort((a, b) => {
    const indexA = typeOrder.indexOf(a)
    const indexB = typeOrder.indexOf(b)
    if (indexA === -1 && indexB === -1) return a.localeCompare(b)
    if (indexA === -1) return 1
    if (indexB === -1) return -1
    return indexA - indexB
  })

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">{portfolio.fullName}'s Skills</h2>

                
        {/* Skills Summary */}
        <div className="my-10 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Skills Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-blue-600">{skills.length}</div>
              <div className="text-sm text-gray-600">Total Skills</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-green-600">
                {skills.filter(s => getConfidenceValue(s.confidence) >= 80).length}
              </div>
              <div className="text-sm text-gray-600">Expert Level</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-yellow-600">
                {skills.filter(s => s.top).length}
              </div>
              <div className="text-sm text-gray-600">Top Skills</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-2xl font-bold text-purple-600">{Object.keys(skillsByType).length}</div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
          </div>
        </div>
        
        <div className="space-y-8">
          {sortedTypes.map(type => (
            <div key={type} className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
              <h3 className="text-xl font-semibold mb-6 text-gray-800 border-b border-gray-200 pb-3">
                {type}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {skillsByType[type].map(skill => {
                  const confidenceValue = getConfidenceValue(skill.confidence)
                  
                  return (
                    <div 
                      key={skill.name} 
                      className={`relative overflow-hidden rounded-lg border-2 p-5 transition-all duration-200 hover:shadow-md ${
                        skill.top ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      {skill.top && (
                        <div className="absolute top-3 right-3">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            ⭐ Top Skill
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm flex-shrink-0">
                          <img 
                            src={skill.logo} 
                            alt={skill.name} 
                            className="w-8 h-8"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-lg text-gray-900">{skill.name}</h4>
                            <span className="text-sm font-medium text-gray-600">
                              {getConfidenceLevel(skill.confidence)}
                            </span>
                          </div>
                          
                          {skill.description && (
                            <p className="text-gray-600 mb-4 leading-relaxed">{skill.description}</p>
                          )}
                          
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-500">Confidence Level</span>
                              <span className="text-sm font-medium text-gray-700">{confidenceValue}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className={`h-2.5 rounded-full transition-all duration-300 ${
                                  confidenceValue >= 80 ? 'bg-green-500' :
                                  confidenceValue >= 60 ? 'bg-blue-500' :
                                  confidenceValue >= 40 ? 'bg-yellow-500' : 'bg-gray-400'
                                }`}
                                style={{ width: getProgressWidth(skill.confidence) }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default SkillsPage