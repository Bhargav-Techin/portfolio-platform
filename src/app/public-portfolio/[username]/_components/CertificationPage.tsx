import React from 'react'
import { Portfolio, Certificate } from '@/types/portfolio'

interface CertificationPageProps {
  portfolio: Portfolio
}

const CertificationPage: React.FC<CertificationPageProps> = ({ portfolio }) => {
  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold mb-4">Certifications</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(portfolio.certificates || []).map((cert, idx) => (
          <div key={idx} className="border rounded-lg p-5 bg-white shadow-sm flex flex-col items-center">
            <img src={cert.pic} alt={cert.name} className="w-32 h-24 object-contain rounded mb-3 border" />
            <h3 className="text-lg font-semibold mb-1 text-center">{cert.name}</h3>
            <p className="text-sm text-gray-600 text-center">{cert.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default CertificationPage
