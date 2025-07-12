'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import PersonalInfoPage from './_components/PersonalInfoPage'
import TopSkillsPage from './_components/TopSkillsPage'
import ProjectsPage from './_components/TopProjectsPage'
import ExperiancePage from './_components/ExperiancePage'
import EducationPage from './_components/EducationPage'
import CertificationPage from './_components/CertificationPage'
import TopProjectsPage from './_components/TopProjectsPage'
import { ChatbotFAB } from '@/components/PortfolioChatbot'
import { Portfolio } from '@/types/portfolio'

const PublicPortfolioPage = () => {
    const params = useParams()
    const username = params.username as string
    
    const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Fetch portfolio data by username
    useEffect(() => {
        const fetchPortfolio = async () => {
            if (!username) {
                setError('Username is required')
                setLoading(false)
                return
            }

            setLoading(true)
            setError(null)

            try {
                const response = await fetch(`/api/fetch-portfolio/${username}`)
                
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error(`Portfolio for "${username}" not found`)
                    }
                    throw new Error('Failed to fetch portfolio data')
                }

                const data = await response.json()
                setPortfolio(data.portfolio)
            } catch (error) {
                console.error('Error fetching portfolio:', error)
                setError(error instanceof Error ? error.message : 'Unknown error occurred')
            } finally {
                setLoading(false)
            }
        }

        fetchPortfolio()
    }, [username])

    // Loading State
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
                <div className="max-w-5xl mx-auto px-4 py-16">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading Portfolio</h2>
                        <p className="text-gray-500">Please wait while we fetch the latest information...</p>
                    </div>

                    {/* Loading Skeleton */}
                    <div className="mt-16 space-y-8">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <div className="animate-pulse">
                                    <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                                    <div className="space-y-3">
                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    // Error State
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center">
                <div className="max-w-md mx-auto px-4 text-center">
                    <div className="bg-white rounded-xl shadow-lg border border-red-100 p-8">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Portfolio Not Found</h2>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <div className="space-y-2">
                            <button
                                onClick={() => window.location.reload()}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 mr-2"
                            >
                                Try Again
                            </button>
                            <a
                                href="/"
                                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 inline-block"
                            >
                                Go Home
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // No Portfolio State
    if (!portfolio) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
                <div className="max-w-md mx-auto px-4 text-center">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Portfolio Not Available</h2>
                        <p className="text-gray-600 mb-4">The portfolio for "{username}" could not be found.</p>
                        <a
                            href="/"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 inline-block"
                        >
                            Go Home
                        </a>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            {/* Header Section */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">
                                    {portfolio.fullName?.[0]?.toUpperCase() || username[0].toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <h1 className="font-semibold text-gray-800">
                                    {portfolio.fullName || username}
                                </h1>
                                <p className="text-sm text-gray-500">Portfolio</p>
                            </div>
                        </div>

                        {/* Navigation Pills - Updated with all sections */}
                        <nav className="hidden md:flex items-center gap-2">
                            {[
                                { name: 'About', href: '#about' },
                                { name: 'Skills', href: '#skills' },
                                { name: 'Projects', href: '#projects' },
                                { name: 'Experience', href: '#experience' },
                                { name: 'Education', href: '#education' },
                                { name: 'Certifications', href: '#certifications' }
                            ].map(item => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                >
                                    {item.name}
                                </a>
                            ))}
                        </nav>

                        {/* Mobile Menu Button */}
                        <button className="md:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>

                    {/* Mobile Navigation Menu */}
                    <div className="md:hidden mt-4 pb-4 border-t border-gray-200/50 pt-4">
                        <nav className="flex flex-wrap gap-2">
                            {[
                                { name: 'About', href: '#about' },
                                { name: 'Skills', href: '#skills' },
                                { name: 'Projects', href: '#projects' },
                                { name: 'Experience', href: '#experience' },
                                { name: 'Education', href: '#education' },
                                { name: 'Certifications', href: '#certifications' }
                            ].map(item => (
                                <a
                                    key={item.name}
                                    href={item.href}
                                    className="px-3 py-1.5 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                                >
                                    {item.name}
                                </a>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-4 py-8">
                <div className="space-y-12">
                    {/* Personal Info Section */}
                    <section id="about" className="scroll-mt-20">
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                            <PersonalInfoPage portfolio={portfolio} username={username} />
                        </div>
                    </section>

                    {/* Top Skills Section */}
                    <section id="skills" className="scroll-mt-20">
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                            <TopSkillsPage portfolio={portfolio} username={username} />
                        </div>
                    </section>

                    {/* Projects Section */}
                    <section id="projects" className="scroll-mt-20">
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                            <TopProjectsPage portfolio={portfolio} username={username} />
                        </div>
                    </section>

                    {/* Experience Section */}
                    <section id="experience" className="scroll-mt-20">
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                            <ExperiancePage portfolio={portfolio} />
                        </div>
                    </section>

                    {/* Education Section */}
                    <section id="education" className="scroll-mt-20">
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                            <EducationPage portfolio={portfolio} />
                        </div>
                    </section>

                    {/* Certification Section */}
                    <section id="certifications" className="scroll-mt-20">
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
                            <CertificationPage portfolio={portfolio} />
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <footer className="mt-16 py-8 text-center">
                    <div className="bg-white/50 backdrop-blur-sm rounded-xl border border-white/20 p-6">
                        <p className="text-gray-600 mb-2">
                            This portfolio was created by{' '}
                            <span className="font-semibold text-gray-800">
                                {portfolio.fullName || username}
                            </span>
                        </p>
                        <p className="text-sm text-gray-500">
                            Built with ❤️ using our Portfolio Platform
                        </p>
                    </div>
                </footer>
            </main>

            {/* Floating Back to Top Button */}
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="fixed bottom-6 left-6 w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-200 flex items-center justify-center group"
                aria-label="Back to top"
            >
                <svg
                    className="w-5 h-5 transform group-hover:-translate-y-0.5 transition-transform duration-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
            </button>

            {/* Portfolio Chatbot */}
            <ChatbotFAB username={username} />
        </div>
    )
}

export default PublicPortfolioPage