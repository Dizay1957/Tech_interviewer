'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { loadQuestionsFromCSV, getQuestionsByDomain, Question, slugToCategory } from '@/lib/csvParser'
import QuestionCard from '@/components/QuestionCard'

export default function PracticePage() {
  const params = useParams()
  const router = useRouter()
  const domain = params.domain as string
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadQuestions() {
      try {
        setLoading(true)
        const allQuestions = await loadQuestionsFromCSV('/data/questions.csv')
        const domainQuestions = getQuestionsByDomain(allQuestions, domain)
        
        if (domainQuestions.length === 0) {
          setError('No questions found for this domain')
        } else {
          // Shuffle questions for variety
          const shuffled = [...domainQuestions].sort(() => Math.random() - 0.5)
          setQuestions(shuffled)
        }
      } catch (err) {
        setError('Error loading questions')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadQuestions()
  }, [domain])

  const handleSwipe = (direction: 'left' | 'right') => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      // Loop back to start
      setCurrentIndex(0)
    }
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setCurrentIndex(0)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    } else {
      setCurrentIndex(questions.length - 1)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading questions...</p>
        </div>
      </main>
    )
  }

  if (error || questions.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="text-center bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md">
          <p className="text-red-600 dark:text-red-400 mb-4">{error || 'No questions available'}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Back
          </button>
        </div>
      </main>
    )
  }

  const currentQuestion = questions[currentIndex]
  const domainName = slugToCategory[domain] || domain

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-4xl mx-auto pt-6 pb-8">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {domainName}
          </h1>
          <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            {currentIndex + 1} / {questions.length}
          </div>
        </div>

        <div className="relative h-[500px] md:h-[600px] flex items-center justify-center">
          <QuestionCard
            key={currentIndex}
            question={currentQuestion.question}
            answer={currentQuestion.answer}
            onSwipe={handleSwipe}
            isActive={true}
          />
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={handlePrevious}
            className="bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all active:scale-95"
          >
            ← Previous
          </button>
          <button
            onClick={handleNext}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all active:scale-95"
          >
            Next →
          </button>
        </div>
      </div>
    </main>
  )
}

