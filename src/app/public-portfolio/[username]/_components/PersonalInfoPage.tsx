import React from 'react'
import { Portfolio } from '@/types/portfolio'

interface PersonalInfoPageProps {
    portfolio: Portfolio
    username: string
}

const PersonalInfoPage: React.FC<PersonalInfoPageProps> = ({ portfolio, username }) => {
    return (
        <section className="flex flex-col md:flex-row gap-8 items-center md:items-start py-8">
            {/* Only render the image if profilePicUrl is truthy */}
            {portfolio.profilePicUrl && (
                <img
                    src={portfolio.profilePicUrl}
                    alt={portfolio.fullName || portfolio.username}
                    className="w-32 h-32 rounded-full object-cover border-4 border-primary shadow-md"
                />
            )}
            <div>
                <h1 className="text-3xl font-bold mb-2">{portfolio.fullName}</h1>
                <p className="text-gray-600 mb-2">{portfolio.bio}</p>
                <div className="flex flex-wrap gap-2 mb-2">
                    <span className="bg-gray-100 px-3 py-1 rounded text-sm font-medium">{portfolio.city}, {portfolio.state}, {portfolio.country}</span>
                </div>
                <div className="flex gap-3 mt-2">
                    {(portfolio.socialLinks || []).map(link => (
                        <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
                            <img src={link.logo} alt={link.name} className="w-5 h-5" />
                            <span>{link.name}</span>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default PersonalInfoPage
