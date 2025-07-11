import React from 'react'
import { Portfolio, Education } from '@/types/portfolio'

interface EducationPageProps {
  portfolio: Portfolio
    username?: string
}

const EducationPage: React.FC<EducationPageProps> = ({ portfolio, username }) => {
  function formatDate(date: string | Date): string {
    if (!date) return ''
    if (typeof date === 'string') return date
    if (date instanceof Date) return date.toISOString().slice(0, 7)
    return String(date)
  }

  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-4">Education</h2>
      <div className="space-y-6">
        {(portfolio.education || []).map((edu, idx) => (
          <div key={idx} className="border rounded-lg p-5 bg-white shadow-sm flex flex-col md:flex-row gap-6">
            {edu.schoolLogoUrl && (
              <img src={edu.schoolLogoUrl} alt={edu.school} className="w-20 h-20 object-contain rounded-lg border" />
            )}
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-1">{edu.school}</h3>
              <div className="flex flex-wrap gap-2 mb-1">
                <span className="text-sm text-gray-700 font-medium">{edu.degree}</span>
                {edu.grade && <span className="text-xs text-gray-500">Grade: {edu.grade}</span>}
              </div>
              <div className="text-xs text-gray-500 mb-1">
                {formatDate(edu.startDate)} - {edu.endDate === 'PRESENT' ? 'Present' : formatDate(edu.endDate)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default EducationPage
