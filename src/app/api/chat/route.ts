// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatRequest {
  message: string
  portfolio: any
  conversationHistory: Message[]
}

export async function POST(request: NextRequest) {
  try {
    const { message, portfolio, conversationHistory }: ChatRequest = await request.json()

    // Validate required fields
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    if (!portfolio?.openRouterApiKey) {
      return NextResponse.json(
        { error: 'OpenRouter API key is not configured. Please add your API key in the portfolio settings.' },
        { status: 400 }
      )
    }

    // Create system prompt with portfolio information
    const systemPrompt = createSystemPrompt(portfolio)

    // Prepare messages for OpenRouter
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-5), // Include last 5 messages for context
      { role: 'user', content: message }
    ]

    // Make request to OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${portfolio.openRouterApiKey}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'Portfolio Assistant',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat-v3-0324:free',
        messages: messages,
        temperature: 0.7,
        max_tokens: 300, // Reduced from 1000 to keep responses concise
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('OpenRouter API error:', errorData)
      return NextResponse.json(
        { error: 'Failed to get response from AI service' },
        { status: response.status }
      )
    }

    const data = await response.json()

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      return NextResponse.json(
        { error: 'Invalid response from AI service' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      response: data.choices[0].message.content
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function createSystemPrompt(portfolio: any): string {
  const {
    fullName,
    bio,
    country,
    state,
    city,
    skills = [],
    projects = [],
    experiences = [],
    education = [],
    certificates = [],
    socialLinks = []
  } = portfolio

  // Build location string
  const location = [city, state, country].filter(Boolean).join(', ')

  // Format skills (only top skills)
  const topSkills = skills
    .sort((a: any, b: any) => (b.confidence || 0) - (a.confidence || 0))
    .slice(0, 5) // Only top 5 skills
    .map((skill: any) => `${skill.name} (${skill.confidence}%)`)
    .join(', ')

  // Format projects (brief)
  const keyProjects = projects.slice(0, 3).map((project: any) => 
    `• ${project.title}: ${project.description?.substring(0, 100)}${project.description?.length > 100 ? '...' : ''}`
  ).join('\n')

  // Format recent experience (brief)
  const recentExperience = experiences.slice(0, 2).map((exp: any) => 
    `• ${exp.position} at ${exp.company} (${exp.startDate} - ${exp.endDate || 'Present'})`
  ).join('\n')

  // Get primary contact link
  const primaryContact = socialLinks.find((link: any) => 
    link.name.toLowerCase().includes('linkedin') || 
    link.name.toLowerCase().includes('email') ||
    link.name.toLowerCase().includes('portfolio')
  )

  return `You are a professional AI assistant for ${fullName || 'the portfolio owner'}. 

PORTFOLIO SUMMARY:
Name: ${fullName || 'Not specified'}
Location: ${location || 'Not specified'}
Bio: ${bio ? bio.substring(0, 150) + (bio.length > 150 ? '...' : '') : 'No bio provided'}

TOP SKILLS: ${topSkills || 'No skills listed'}

KEY PROJECTS:
${keyProjects || 'No projects listed'}

RECENT EXPERIENCE:
${recentExperience || 'No experience listed'}

CONTACT: ${primaryContact ? `${primaryContact.name}: ${primaryContact.url}` : 'Check portfolio for contact info'}

FORMATTING INSTRUCTIONS:
- Use *text* to make important words/phrases bold (skills, names, technologies, degrees, company names, metrics)
- Use #link_text|actual_url# for clickable links
- Keep responses concise (2-3 sentences max)
- Use bullet points (•) for lists when appropriate

EXAMPLES:
- "*Node.js* is his top skill with *100/10* confidence"
- "Connect via #LinkedIn|https://linkedin.com/in/username#"
- "He works at *Google Inc* as a *Senior Developer*"
- "Graduated with *Computer Science* degree from *MIT*"

RESPONSE GUIDELINES:
- Be conversational and professional
- Focus on the most relevant information
- If asked about details not in summary, mention "I can share more about [topic] if you're interested"
- For contact, direct to the provided links using the # format
- Don't repeat information unnecessarily
- Be enthusiastic but not overly verbose

Remember: You represent ${fullName || 'this person'} professionally. Use the formatting markers to highlight important information and make links clickable.`
}