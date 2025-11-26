'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import ExplanationModal from './ExplanationModal'

interface QuestionCardProps {
  question: string
  answer: string
  onSwipe: (direction: 'left' | 'right') => void
  isActive: boolean
}

export default function QuestionCard({ question, answer, onSwipe, isActive }: QuestionCardProps) {
  const [showAnswer, setShowAnswer] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-300, 300], [-15, 15])
  const opacity = useTransform(x, [-300, -150, 0, 150, 300], [0, 1, 1, 1, 0])

  useEffect(() => {
    if (isActive) {
      setShowAnswer(false)
      setShowExplanation(false)
      x.set(0)
    }
  }, [isActive, x])

  const handleDragEnd = useCallback((_event: any, info: PanInfo) => {
    const threshold = 100
    if (info.offset.x > threshold) {
      onSwipe('right')
    } else if (info.offset.x < -threshold) {
      onSwipe('left')
    } else {
      x.set(0)
    }
  }, [onSwipe, x])

  if (!isActive) return null

  return (
    <motion.div
      className="absolute w-full max-w-2xl mx-auto"
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 md:p-8 min-h-[400px] md:min-h-[500px] flex flex-col">
        <div className="flex-1 mb-6">
          <div className="mb-4">
            <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
              Question
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6 leading-relaxed">
            {question}
          </h2>

          {showAnswer && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
            >
              <div className="mb-4">
                <span className="text-sm font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide">
                  Answer
                </span>
              </div>
              <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {answer}
              </p>
            </motion.div>
          )}
        </div>

        <div className="flex gap-3 mt-auto">
          <button
            onClick={() => setShowAnswer(!showAnswer)}
            className={`${showAnswer ? 'flex-1' : 'w-full'} bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 active:scale-95`}
          >
            {showAnswer ? 'Hide Answer' : 'Show Answer'}
          </button>
          {showAnswer && (
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              onClick={() => setShowExplanation(true)}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 shadow-lg"
            >
              <svg
                className="w-5 h-5 flex-shrink-0"
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
              <span className="whitespace-nowrap">Explain More</span>
            </motion.button>
          )}
        </div>

        <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Swipe left or right to go to the next question</p>
        </div>
      </div>

      <ExplanationModal
        isOpen={showExplanation}
        onClose={() => setShowExplanation(false)}
        question={question}
        answer={answer}
      />
    </motion.div>
  )
}

