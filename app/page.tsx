'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { loadQuestionsFromCSV, slugToCategory } from '@/lib/csvParser'

const categoryIcons: { [key: string]: string } = {
  'Web Development': '🌐',
  'Database': '🗄️',
  'Data Science & AI': '🤖',
  'Systems & Infrastructure': '🏗️',
  'DevOps & Tools': '🔧',
  'Programming Fundamentals': '📝',
  'Security': '🔒',
}

export default function Home() {
  const router = useRouter()
  const [categories, setCategories] = useState<Array<{ id: string; name: string; icon: string; count: number }>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    const CACHE_KEY = 'interviewer_categories_cache'
    const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
    
    async function loadCategories() {
      try {
        // Check cache first
        const cached = localStorage.getItem(CACHE_KEY)
        if (cached) {
          const { data, timestamp } = JSON.parse(cached)
          if (Date.now() - timestamp < CACHE_DURATION) {
            if (isMounted) {
              setCategories(data)
              setLoading(false)
              return
            }
          }
        }
        
        const questions = await loadQuestionsFromCSV('/data/questions.csv')
        
        if (!isMounted) return
        
        if (questions.length === 0) {
          setLoading(false)
          return
        }
        
        const categoryMap = new Map<string, number>()
        
        questions.forEach(q => {
          const categoryName = slugToCategory[q.domain] || q.domain
          categoryMap.set(categoryName, (categoryMap.get(categoryName) || 0) + 1)
        })
        
        const categoryList = Array.from(categoryMap.entries())
          .map(([name, count]) => {
            const slug = Object.entries(slugToCategory).find(([_, catName]) => catName === name)?.[0] || 
                        name.toLowerCase().replace(/\s+/g, '-')
            return {
              id: slug,
              name,
              icon: categoryIcons[name] || '📚',
              count,
            }
          })
          .sort((a, b) => a.name.localeCompare(b.name))
        
        // Cache the results
        localStorage.setItem(CACHE_KEY, JSON.stringify({
          data: categoryList,
          timestamp: Date.now()
        }))
        
        if (isMounted) {
          setCategories(categoryList)
          setError(null)
        }
      } catch (error: any) {
        if (isMounted) {
          setError(error.message || 'Failed to load categories')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }
    
    const timeoutId = setTimeout(() => {
      if (isMounted) {
        setError('Loading timeout. Please refresh the page.')
        setLoading(false)
      }
    }, 15000) // Increased to 15 seconds
    
    loadCategories().finally(() => {
      clearTimeout(timeoutId)
    })
    
    return () => {
      isMounted = false
      clearTimeout(timeoutId)
    }
  }, [])

  const handleDomainSelect = (domainId: string) => {
    router.push(`/practice/${domainId}`)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-indigo-200 dark:border-indigo-900 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 font-medium mb-2">Loading categories...</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">This may take a few seconds</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="text-center bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Reload Page
          </button>
        </div>
      </main>
    )
  }

  if (categories.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="text-center bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md">
          <p className="text-gray-600 dark:text-gray-300 mb-4">No categories found. Please check the CSV file.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Reload Page
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto pt-12 pb-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Interviewer
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300">
            Practice your technical interviews
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleDomainSelect(category.id)}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center"
            >
              <div className="text-4xl mb-3">{category.icon}</div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {category.name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {category.count} {category.count > 1 ? 'questions' : 'question'}
              </p>
            </button>
          ))}
        </div>
      </div>
    </main>
  )
}

