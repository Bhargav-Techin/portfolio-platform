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
import PortfolioNavBar from './_components/PortfolioNavBar'
import { ChatbotFAB } from '@/components/PortfolioChatbot'
import { Portfolio } from '@/types/portfolio'
import { Button } from '@/components/ui/button'

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
            <div
                className="min-h-screen"
                style={{
                    '--theme-bg': '#0a0f1a',
                    '--theme-card': '#1a1f2e',
                    '--theme-card-hover': '#242938',
                    '--theme-border': '#2a2f3e',
                    '--theme-text-primary': '#e2e8f0',
                    '--theme-text-secondary': '#94a3b8',
                    '--theme-text-muted': '#64748b',
                    '--theme-accent': '#3b82f6',
                    '--theme-accent-hover': '#2563eb',
                    backgroundColor: 'var(--theme-bg)'
                } as React.CSSProperties}
            >
                <div className="max-w-5xl mx-auto px-4 py-16">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 mb-4" style={{ borderColor: 'var(--theme-accent)' }}></div>
                        <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--theme-text-primary)' }}>Loading Portfolio</h2>
                        <p style={{ color: 'var(--theme-text-secondary)' }}>Please wait while we fetch the latest information...</p>
                    </div>

                    {/* Loading Skeleton */}
                    <div className="mt-16 space-y-8">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="rounded-xl shadow-sm border p-6" style={{
                                backgroundColor: 'var(--theme-card)',
                                borderColor: 'var(--theme-border)'
                            }}>
                                <div className="animate-pulse">
                                    <div className="h-6 rounded w-1/4 mb-4" style={{ backgroundColor: 'var(--theme-border)' }}></div>
                                    <div className="space-y-3">
                                        <div className="h-4 rounded w-3/4" style={{ backgroundColor: 'var(--theme-border)' }}></div>
                                        <div className="h-4 rounded w-1/2" style={{ backgroundColor: 'var(--theme-border)' }}></div>
                                        <div className="h-4 rounded w-2/3" style={{ backgroundColor: 'var(--theme-border)' }}></div>
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
            <div
                className="min-h-screen flex items-center justify-center"
                style={{
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
                } as React.CSSProperties}
            >
                <div className="max-w-md mx-auto px-4 text-center">
                    <div className="rounded-xl shadow-lg border p-8" style={{
                        backgroundColor: 'var(--theme-card)',
                        borderColor: 'var(--theme-border)'
                    }}>
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{
                            backgroundColor: 'rgba(239, 68, 68, 0.1)'
                        }}>
                            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--theme-text-primary)' }}>Portfolio Not Found</h2>
                        <p className="mb-4" style={{ color: 'var(--theme-text-secondary)' }}>{error}</p>
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
            <div
                className="min-h-screen flex items-center justify-center"
                style={{
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
                } as React.CSSProperties}
            >
                <div className="max-w-md mx-auto px-4 text-center">
                    <div className="rounded-xl shadow-lg border p-8" style={{
                        backgroundColor: 'var(--theme-card)',
                        borderColor: 'var(--theme-border)'
                    }}>
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{
                            backgroundColor: 'var(--theme-border)'
                        }}>
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--theme-text-secondary)' }}>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--theme-text-primary)' }}>Portfolio Not Available</h2>
                        <p className="mb-4" style={{ color: 'var(--theme-text-secondary)' }}>The portfolio for "{username}" could not be found.</p>
                        <a
                            href="/"
                            className="px-4 py-2 rounded-lg transition-colors duration-200 inline-block text-white"
                            style={{ backgroundColor: 'var(--theme-accent)' }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--theme-accent-hover)')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--theme-accent')}
                        >
                            Go Home
                        </a>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div
            className="min-h-screen relative"
            style={{
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
            } as React.CSSProperties}
        >
            {/* Navigation Bar */}
            <PortfolioNavBar portfolio={portfolio} username={username} />

            {/* Personal Info Section */}
            <section id="about" className="-mt-20">
                <div className="backdrop-blur-sm rounded-2xl shadow-xl border overflow-hidden" style={{
                    backgroundColor: 'var(--theme-card)',
                    borderColor: 'var(--theme-border)'
                }}>
                    <PersonalInfoPage portfolio={portfolio} username={username} />
                </div>
            </section>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto py-8">
                <div className="space-y-12">

                    {/* Top Skills Section */}
                    <section id="skills" className="scroll-mt-20">
                        <div className="backdrop-blur-sm rounded-2xl shadow-xl border overflow-hidden" style={{
                            backgroundColor: 'var(--theme-card)',
                            borderColor: 'var(--theme-border)'
                        }}>
                            <TopSkillsPage portfolio={portfolio} username={username} />
                        </div>
                    </section>

                    {/* Projects Section */}
                    <section id="projects" className="scroll-mt-20">
                        <div className="backdrop-blur-sm rounded-2xl shadow-xl border overflow-hidden" style={{
                            backgroundColor: 'var(--theme-card)',
                            borderColor: 'var(--theme-border)'
                        }}>
                            <TopProjectsPage portfolio={portfolio} username={username} />
                        </div>
                    </section>

                    {/* Experience Section */}
                    <section id="experience" className="scroll-mt-20">
                        <div className="backdrop-blur-sm rounded-2xl shadow-xl border overflow-hidden" style={{
                            backgroundColor: 'var(--theme-card)',
                            borderColor: 'var(--theme-border)'
                        }}>
                            <ExperiancePage portfolio={portfolio} />
                        </div>
                    </section>

                    {/* Education Section */}
                    <section id="education" className="scroll-mt-20">
                        <div className="backdrop-blur-sm rounded-2xl shadow-xl border overflow-hidden" style={{
                            backgroundColor: 'var(--theme-card)',
                            borderColor: 'var(--theme-border)'
                        }}>
                            <EducationPage portfolio={portfolio} />
                        </div>
                    </section>

                    {/* Certification Section */}
                    <section id="certifications" className="scroll-mt-20">
                        <div className="backdrop-blur-sm rounded-2xl shadow-xl border overflow-hidden" style={{
                            backgroundColor: 'var(--theme-card)',
                            borderColor: 'var(--theme-border)'
                        }}>
                            <CertificationPage portfolio={portfolio} />
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <footer className="mt-16 py-8 text-center">
                    <div className="backdrop-blur-sm rounded-xl border p-6" style={{
                        backgroundColor: 'rgba(26, 31, 46, 0.3)',
                        borderColor: 'var(--theme-border)'
                    }}>
                        <p className="mb-2" style={{ color: 'var(--theme-text-secondary)' }}>
                            This portfolio was created by{' '}
                            <span className="font-semibold" style={{ color: 'var(--theme-text-primary)' }}>
                                {portfolio.fullName || username}
                            </span>
                        </p>
                        <p className="text-sm" style={{ color: 'var(--theme-text-muted)' }}>
                            Built with ❤️ using our Portfolio Platform
                        </p>
                    </div>
                </footer>
            </main>

            {/* Floating Back to Top Button */}
            <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="fixed bottom-6 left-6 w-12 h-12 text-white rounded-full border border-gray-600 bg-gray-950 shadow-lg hover:bg-black hover:border-white hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
                aria-label="Back to top"
            >
                <svg
                    className="w-5 h-5 transform group-hover:-translate-y-0.5 transition-transform duration-300"
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