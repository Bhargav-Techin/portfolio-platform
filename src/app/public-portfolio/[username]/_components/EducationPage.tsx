'use client'
import React from 'react'
import { Portfolio } from '@/types/portfolio'
import Timeline from '@mui/lab/Timeline'
import TimelineItem from '@mui/lab/TimelineItem'
import TimelineSeparator from '@mui/lab/TimelineSeparator'
import TimelineConnector from '@mui/lab/TimelineConnector'
import TimelineContent from '@mui/lab/TimelineContent'
import TimelineDot from '@mui/lab/TimelineDot'
import TimelineOppositeContent, {
  timelineOppositeContentClasses,
} from '@mui/lab/TimelineOppositeContent'
import { GraduationCap, ExternalLink, MapPin, Calendar, BookOpen, Award } from 'lucide-react'
import Image from 'next/image'

interface EducationPageProps {
  portfolio: Portfolio
  username?: string
}

function formatDate(date: string | Date | null): string {
  if (!date) return 'PRESENT'
  if (typeof date === 'string') return date
  return new Date(date).toISOString().slice(0, 7)
}

function formatDisplayDate(date: string | Date | null): string {
  if (!date) return 'Present'
  if (typeof date === 'string') {
    // If it's already a formatted string, return as is
    if (date === 'PRESENT') return 'Present'
    // Try to parse if it's a date string
    const parsed = new Date(date)
    if (!isNaN(parsed.getTime())) {
      return parsed.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
      })
    }
    return date
  }
  return new Date(date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short' 
  })
}

const EducationPage: React.FC<EducationPageProps> = ({ portfolio }) => {
  const sortedEducation = [...(portfolio.education || [])].sort((a, b) => {
    const dateA = new Date(a.startDate ?? '').getTime()
    const dateB = new Date(b.startDate ?? '').getTime()
    return dateB - dateA
  })

  return (
    <section className="py-8 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-600 bg-clip-text text-transparent">
            Education
          </h2>
          <p className="text-gray-400 text-lg">
            A timeline of my academic achievements and educational background
          </p>
        </div>
        
        <Timeline
          sx={{
            [`& .${timelineOppositeContentClasses.root}`]: {
              flex: 0.3,
              paddingLeft: 0,
              paddingRight: '24px',
            },
            '& .MuiTimelineItem-root': {
              '&:before': {
                flex: 0,
                padding: 0,
              },
            },
          }}
        >
          {sortedEducation.map((edu, idx) => (
            <TimelineItem key={idx}>
              <TimelineOppositeContent>
                <div className="text-right">
                  <div className="bg-gradient-to-r from-green-500/20 to-blue-600/20 backdrop-blur-sm border border-green-500/30 rounded-xl p-4 shadow-lg">
                    <div className="flex items-center justify-end mb-2">
                      <Calendar className="w-4 h-4 mr-2 text-green-400" />
                      <span className="text-sm font-medium text-green-300">Duration</span>
                    </div>
                    <div className="text-white font-semibold">
                      {formatDisplayDate(edu.startDate)}
                    </div>
                    <div className="text-gray-300 text-sm">to</div>
                    <div className="text-white font-semibold">
                      {edu.endDate === 'PRESENT' || !edu.endDate ? 'Present' : formatDisplayDate(edu.endDate)}
                    </div>
                  </div>
                </div>
              </TimelineOppositeContent>
              
              <TimelineSeparator>
                <TimelineDot 
                  sx={{ 
                    bgcolor: idx === 0 ? '#10b981' : '#3b82f6',
                    width: 16,
                    height: 16,
                    border: '3px solid rgba(16, 185, 129, 0.3)',
                    boxShadow: '0 0 20px rgba(16, 185, 129, 0.5)',
                  }}
                />
                {idx !== sortedEducation.length - 1 && (
                  <TimelineConnector 
                    sx={{ 
                      bgcolor: 'rgba(16, 185, 129, 0.3)',
                      width: 2,
                      minHeight: 60,
                    }} 
                  />
                )}
              </TimelineSeparator>
              
              <TimelineContent>
                <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:border-green-500/50 group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start">
                      <div className="bg-green-500/20 p-2 rounded-lg mr-3 flex-shrink-0">
                        <GraduationCap className="w-5 h-5 text-green-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white group-hover:text-green-300 transition-colors">
                          {edu.degree}
                        </h3>
                        <div className="flex items-center text-gray-300 mt-1">
                          <BookOpen className="w-4 h-4 mr-1" />
                          <span className="font-medium">{edu.school}</span>
                        </div>
                      </div>
                    </div>
                    {edu.schoolLogoUrl && (
                      <div className="flex-shrink-0 ml-4">
                        <Image
                          src={edu.schoolLogoUrl}
                          alt={edu.school}
                          className="w-12 h-12 object-contain rounded-lg border border-gray-600 bg-white p-1"
                        />
                      </div>
                    )}
                  </div>

                    {edu.grade && (
                      <div className="flex items-center text-sm text-gray-400">
                        <Award className="w-4 h-4 mr-2 text-yellow-400" />
                        <span className="bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full text-xs">
                          Grade: {edu.grade}
                        </span>
                      </div>
                    )}
                </div>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
        
        {sortedEducation.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700/50">
              <GraduationCap className="w-12 h-12 mx-auto mb-4 text-gray-500" />
              <p className="text-gray-400 text-lg">No education records added yet.</p>
              <p className="text-gray-500 text-sm mt-2">
                Your educational journey will appear here once you add your academic background.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default EducationPage