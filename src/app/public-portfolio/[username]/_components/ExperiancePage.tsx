import React from 'react'
import { Portfolio, Experience } from '@/types/portfolio'

interface ExperiancePageProps {
    portfolio: Portfolio
    username?: string
}

function formatDate(date: string | Date): string {
    if (!date) return ''
    if (typeof date === 'string') return date
    if (date instanceof Date) return date.toISOString().slice(0, 7)
    return String(date)
}

const ExperiancePage: React.FC<ExperiancePageProps> = ({ portfolio, username }) => {
    return (
        <section className="py-8">
            <h2 className="text-2xl font-bold mb-4">Experience</h2>
            <div className="space-y-6">
                {(portfolio.experiences || []).map((exp, idx) => (
                    <div key={idx} className="border rounded-lg p-5 bg-white shadow-sm flex flex-col md:flex-row gap-6">
                        {exp.companyLogoUrl && (
                            <img src={exp.companyLogoUrl} alt={exp.companyName} className="w-20 h-20 object-contain rounded-lg border" />
                        )}
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-1">{exp.title}</h3>
                            <div className="flex flex-wrap gap-2 mb-1">
                                <span className="text-sm text-gray-700 font-medium">{exp.companyName}</span>
                                {exp.companyWebsite && <a href={exp.companyWebsite} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs">Website</a>}
                            </div>
                            <div className="flex flex-wrap gap-2 mb-1">
                                <span className="text-xs text-gray-500">{exp.employeeType}</span>
                                <span className="text-xs text-gray-500">{exp.locationType}</span>
                                <span className="text-xs text-gray-500">{exp.location}</span>
                            </div>
                            <div className="text-xs text-gray-500 mb-1">
                                {formatDate(exp.startDate)} - {exp.endDate === 'PRESENT' ? 'Present' : formatDate(exp.endDate)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default ExperiancePage
