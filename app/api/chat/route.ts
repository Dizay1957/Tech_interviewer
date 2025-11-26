import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
})

export async function POST(request: NextRequest) {
  try {
    const { messages, categories } = await request.json()

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY is not configured' },
        { status: 500 }
      )
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages are required' },
        { status: 400 }
      )
    }

    // Build category information for the system prompt
    const categoryInfo = categories && categories.length > 0
      ? `\n\nAvailable practice categories:\n${categories.map((cat: { name: string; id: string }) => `- ${cat.name} (slug: ${cat.id})`).join('\n')}\n\nWhen a user asks to practice a specific category, navigate to it, or wants to see questions from a category, respond with a special format: [NAVIGATE:category-slug] where category-slug is the slug from the list above. For example, if they want Web Development, use [NAVIGATE:webdev]. Always include helpful text before the navigation command.`
      : ''

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a helpful technical interview assistant. Help users understand technical interview questions, provide explanations, and give coding tips. Be concise and clear.${categoryInfo}\n\nYou can also help users navigate to practice categories. When they ask about a category or want to practice it, use the [NAVIGATE:slug] format in your response.`,
        },
        ...messages,
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.7,
      max_tokens: 1024,
    })

    const response = completion.choices[0]?.message?.content || 'No response generated'

    return NextResponse.json({ message: response })
  } catch (error: any) {
    console.error('Groq API error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get response from chatbot' },
      { status: 500 }
    )
  }
}

