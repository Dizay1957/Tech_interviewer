import Papa from 'papaparse'

export interface Question {
  domain: string
  question: string
  answer: string
  difficulty?: string
}

// Category groupings - parent categories that contain multiple subcategories
export const categoryGroups: { [key: string]: string[] } = {
  'Web Development': ['Front-end', 'Back-end', 'Full-stack', 'Web Development'],
  'Database': ['Database and SQL', 'Database Systems'],
  'Data Science & AI': ['Data Structures', 'Algorithms', 'Machine Learning', 'Artificial Intelligence', 'Data Engineering'],
  'Systems & Infrastructure': ['System Design', 'Distributed Systems', 'Networking', 'Low-level Systems'],
  'DevOps & Tools': ['DevOps', 'Version Control', 'Software Testing'],
  'Programming Fundamentals': ['General Programming', 'General Program', 'Languages and Frameworks'],
}

// Map category names to URL-friendly slugs
export const categoryToSlug: { [key: string]: string } = {
  'Front-end': 'webdev',
  'Back-end': 'webdev',
  'Full-stack': 'webdev',
  'Web Development': 'webdev',
  'Database and SQL': 'database',
  'Database Systems': 'database',
  'Data Structures': 'datascience',
  'Algorithms': 'datascience',
  'Machine Learning': 'datascience',
  'Artificial Intelligence': 'datascience',
  'Data Engineering': 'datascience',
  'System Design': 'systems',
  'Distributed Systems': 'systems',
  'Networking': 'systems',
  'Low-level Systems': 'systems',
  'DevOps': 'devops',
  'Version Control': 'devops',
  'Software Testing': 'devops',
  'General Programming': 'programming',
  'General Program': 'programming', // Handle typo in CSV
  'Languages and Frameworks': 'programming',
  'Security': 'security',
  // Handle CSV parsing issues
  'and CROSS JOIN.': 'database',
  'and cookies.': 'webdev',
}

// Reverse mapping: slug to display name (using group names)
export const slugToCategory: { [key: string]: string } = {
  webdev: 'Web Development',
  database: 'Database',
  datascience: 'Data Science & AI',
  systems: 'Systems & Infrastructure',
  devops: 'DevOps & Tools',
  programming: 'Programming Fundamentals',
  security: 'Security',
}

export async function loadQuestionsFromCSV(filePath: string): Promise<Question[]> {
  try {
    const response = await fetch(filePath)
    const csvText = await response.text()
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const questions: Question[] = results.data
            .map((row: any): Question | null => {
              let category = (row.Category || row.category || '').trim()
              
              // Clean up malformed categories (handle CSV parsing issues)
              if (category.startsWith('and ') || category.startsWith('-and ')) {
                // Try to infer the correct category from the question/answer
                const questionText = (row.Question || row.question || '').toLowerCase()
                const answerText = (row.Answer || row.answer || '').toLowerCase()
                
                if (questionText.includes('cross join') || questionText.includes('inner join') || 
                    questionText.includes('outer join') || answerText.includes('join')) {
                  category = 'Database and SQL'
                } else if (questionText.includes('cookie') || questionText.includes('storage') || 
                          answerText.includes('cookie') || answerText.includes('local storage')) {
                  category = 'Web Development'
                } else {
                  // Skip this question if we can't determine the category
                  return null
                }
              }
              
              const slug = categoryToSlug[category] || category.toLowerCase().replace(/\s+/g, '-')
              
              const question = row.Question || row.question || ''
              const answer = row.Answer || row.answer || ''
              
              if (!question || !answer || !slug) {
                return null
              }
              
              return {
                domain: slug,
                question,
                answer,
                difficulty: row.Difficulty || row.difficulty || '',
              }
            })
            .filter((q): q is Question => q !== null)
          
          resolve(questions)
        },
        error: (error: Error) => {
          reject(error)
        },
      })
    })
  } catch (error) {
    console.error('Error loading CSV:', error)
    return []
  }
}

export function getQuestionsByDomain(questions: Question[], domain: string): Question[] {
  // Questions are already mapped to group slugs, so just filter by slug
  return questions.filter(q => q.domain.toLowerCase() === domain.toLowerCase())
}

export async function getAvailableCategories(): Promise<string[]> {
  const questions = await loadQuestionsFromCSV('/data/questions.csv')
  const categories = new Set<string>()
  
  questions.forEach(q => {
    const categoryName = slugToCategory[q.domain] || q.domain
    if (categoryName) {
      categories.add(categoryName)
    }
  })
  
  return Array.from(categories).sort()
}

