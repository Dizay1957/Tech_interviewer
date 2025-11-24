'use client'

import { useState, useEffect } from 'react'
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion'

interface QuestionCardProps {
  question: string
  answer: string
  onSwipe: (direction: 'left' | 'right') => void
  isActive: boolean
}

export default function QuestionCard({ question, answer, onSwipe, isActive }: QuestionCardProps) {
  const [showAnswer, setShowAnswer] = useState(false)
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-300, 300], [-15, 15])
  const opacity = useTransform(x, [-300, -150, 0, 150, 300], [0, 1, 1, 1, 0])

  useEffect(() => {
    if (isActive) {
      setShowAnswer(false)
      x.set(0)
    }
  }, [isActive, x])

  const handleDragEnd = (_event: any, info: PanInfo) => {
    const threshold = 100
    if (info.offset.x > threshold) {
      onSwipe('right')
    } else if (info.offset.x < -threshold) {
      onSwipe('left')
    } else {
      x.set(0)
    }
  }

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
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 active:scale-95"
          >
            {showAnswer ? 'Hide Answer' : 'Show Answer'}
          </button>
        </div>

        <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>Swipe left or right to go to the next question</p>
        </div>
      </div>
    </motion.div>
  )
}

