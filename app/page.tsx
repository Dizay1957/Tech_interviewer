'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { loadQuestionsFromCSV, slugToCategory, categoryGroups } from '@/lib/csvParser'

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

  useEffect(() => {
    async function loadCategories() {
      try {
        const questions = await loadQuestionsFromCSV('/data/questions.csv')
        const categoryMap = new Map<string, number>()
        
        questions.forEach(q => {
          const categoryName = slugToCategory[q.domain] || q.domain
          categoryMap.set(categoryName, (categoryMap.get(categoryName) || 0) + 1)
        })
        
        const categoryList = Array.from(categoryMap.entries())
          .map(([name, count]) => {
            // Find the slug for this category
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
        
        setCategories(categoryList)
      } catch (error) {
        console.error('Error loading categories:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadCategories()
  }, [])

  const handleDomainSelect = (domainId: string) => {
    router.push(`/practice/${domainId}`)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading categories...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-6xl mx-auto pt-12 pb-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Tech Interviewer
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

