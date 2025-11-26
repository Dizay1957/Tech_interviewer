'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ExplanationModalProps {
  isOpen: boolean
  onClose: () => void
  question: string
  answer: string
}

export default function ExplanationModal({ isOpen, onClose, question, answer }: ExplanationModalProps) {
  const [explanation, setExplanation] = useState<string>('')
  const [frenchExplanation, setFrenchExplanation] = useState<string>('')
  const [language, setLanguage] = useState<'en' | 'fr'>('en')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen && question && answer) {
      fetchExplanation('en')
    } else {
      // Reset when modal closes
      setExplanation('')
      setFrenchExplanation('')
      setLanguage('en')
      setError(null)
      setIsLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const fetchExplanation = useCallback(async (lang: 'en' | 'fr') => {
    // If we already have the explanation for this language, don't fetch again
    if (lang === 'en' && explanation) return
    if (lang === 'fr' && frenchExplanation) return

    setIsLoading(true)
    setError(null)
    
    try {
      const langPrompts = {
        fr: 'Veuillez fournir une explication détaillée et facile à comprendre pour cette question et réponse d\'entretien technique:\n\nQuestion: {question}\n\nRéponse: {answer}\n\nVeuillez expliquer les concepts clairement, fournir du contexte et m\'aider à mieux comprendre. Répondez en français.',
        en: 'Please provide a detailed, easy-to-understand explanation for this technical interview question and answer:\n\nQuestion: {question}\n\nAnswer: {answer}\n\nPlease explain the concepts clearly, provide context, and help me understand this better.'
      }

      const content = langPrompts[lang]
        .replace('{question}', question)
        .replace('{answer}', answer)

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content,
            },
          ],
          categories: [],
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get explanation')
      }

      const data = await response.json()
      if (lang === 'en') {
        setExplanation(data.message)
      } else {
        setFrenchExplanation(data.message)
      }
    } catch (error) {
      setError(lang === 'fr' ? 'Échec du chargement de l\'explication. Veuillez réessayer.' : 'Failed to load explanation. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [question, answer, explanation, frenchExplanation])

  const handleLanguageChange = useCallback((newLang: 'en' | 'fr') => {
    setLanguage(newLang)
    // Fetch French explanation if switching to French and not already loaded
    if (newLang === 'fr' && !frenchExplanation && !isLoading) {
      fetchExplanation('fr')
    }
  }, [frenchExplanation, isLoading, fetchExplanation])

  const currentExplanation = useMemo(() => {
    return language === 'en' ? explanation : frenchExplanation
  }, [language, explanation, frenchExplanation])

  const showLoading = useMemo(() => {
    return isLoading && !currentExplanation
  }, [isLoading, currentExplanation])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">AI Explanation</h2>
                    <p className="text-sm text-white/80">Understanding made simple</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {/* Language Toggle */}
                  <div className="flex items-center gap-2 bg-white/20 rounded-lg p-1">
                    <button
                      onClick={() => handleLanguageChange('en')}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                        language === 'en'
                          ? 'bg-white text-indigo-600'
                          : 'text-white/80 hover:text-white'
                      }`}
                    >
                      EN
                    </button>
                    <button
                      onClick={() => handleLanguageChange('fr')}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                        language === 'fr'
                          ? 'bg-white text-indigo-600'
                          : 'text-white/80 hover:text-white'
                      }`}
                    >
                      FR
                    </button>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-colors flex items-center justify-center"
                    aria-label="Close"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {showLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="relative w-16 h-16 mb-4">
                      <div className="absolute inset-0 border-4 border-indigo-200 dark:border-indigo-900 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 font-medium">
                      {language === 'fr' ? 'L\'IA prépare votre explication...' : 'AI is crafting your explanation...'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      {language === 'fr' ? 'Cela peut prendre quelques secondes' : 'This may take a few seconds'}
                    </p>
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                      <svg
                        className="w-8 h-8 text-red-600 dark:text-red-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <p className="text-red-600 dark:text-red-400 font-medium mb-2">{error}</p>
                    <button
                      onClick={() => fetchExplanation(language)}
                      className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                    >
                      {language === 'fr' ? 'Réessayer' : 'Try Again'}
                    </button>
                  </div>
                ) : explanation ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="prose prose-indigo dark:prose-invert max-w-none"
                  >
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 mb-6 border border-indigo-200 dark:border-indigo-800">
                      <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100 mb-2">
                        {language === 'fr' ? 'Question' : 'Question'}
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300">{question}</p>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        {language === 'fr' ? 'Explication Détaillée' : 'Detailed Explanation'}
                      </h3>
                      <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {currentExplanation || (language === 'fr' ? 'Chargement de la traduction...' : 'Loading translation...')}
                      </div>
                    </div>
                  </motion.div>
                ) : null}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900/50">
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Powered by Groq AI</span>
                  </div>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium"
                  >
                    {language === 'fr' ? 'Fermer' : 'Close'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

