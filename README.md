# Tech Interviewer

A modern, interactive web application for practicing technical interview questions across multiple domains. Built with Next.js, TypeScript, and Tailwind CSS.

🌐 **Live Demo**: [https://tech-interviewer-weld.vercel.app/](https://tech-interviewer-weld.vercel.app/)

## Features

- 📚 **Multiple Tech Domains**: Practice questions from various categories including:
  - Web Development (Front-end, Back-end, Full-stack)
  - Database & SQL
  - Data Science & AI
  - Systems & Infrastructure
  - DevOps & Tools
  - Programming Fundamentals
  - Security

- 🎯 **Interactive Question Cards**: 
  - Swipe left or right to navigate between questions (mobile-friendly)
  - Click buttons to navigate (desktop-friendly)
  - Show/hide answers with a single click
  - **AI-Powered "Explain More"**: Get detailed AI explanations for any answer

- 📱 **Responsive Design**: 
  - Fully optimized for both mobile and desktop devices
  - Touch-friendly swipe gestures on mobile
  - Beautiful, modern UI with dark mode support

- 📊 **CSV-Based Questions**: 
  - Easy to add new questions by updating the CSV file
  - Supports custom categories and difficulty levels
  - Automatic category grouping for better organization
  - Client-side caching for fast loading (5-minute cache)

- 🤖 **AI Chatbot Assistant**: 
  - Powered by Groq AI (Llama 3.1 8B) for instant help with technical questions
  - Get explanations, coding tips, and interview guidance
  - Navigate to practice categories by asking the chatbot
  - Available on every page via floating chat button

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **CSV Parsing**: PapaParse
- **AI**: Groq SDK (Llama 3.1 8B Instant)

## Live Demo

🚀 **Try it now**: [https://tech-interviewer-weld.vercel.app/](https://tech-interviewer-weld.vercel.app/)

The app is deployed and ready to use! No installation required.

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Dizay1957/Tech_interviewer.git
cd Tech_interviewer
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your Groq API key:
```
GROQ_API_KEY=your_groq_api_key_here
```

Get your API key from [Groq Console](https://console.groq.com/)

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
Tech_interviewer/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Home page with category selection
│   ├── practice/          # Practice pages
│   │   └── [domain]/      # Dynamic route for each category
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── QuestionCard.tsx   # Question card with swipe functionality
│   ├── Chatbot.tsx       # AI chatbot assistant component
│   └── ExplanationModal.tsx # AI explanation modal
├── app/
│   ├── api/
│   │   └── chat/         # Chatbot API route
│   ├── page.tsx          # Home page with category selection
│   └── practice/        # Practice pages
├── lib/                   # Utility functions
│   └── csvParser.ts       # CSV parsing and category mapping
├── public/
│   └── data/
│       └── questions.csv  # Question dataset
└── README.md
```

## Adding Questions

To add new questions, edit `public/data/questions.csv` with the following format:

```csv
Question Number,Question,Answer,Category,Difficulty
1,Your question here?,Your answer here.,Category Name,Medium
```

### Supported Categories

- Front-end
- Back-end
- Full-stack
- Web Development
- Database and SQL
- Database Systems
- Data Structures
- Algorithms
- Machine Learning
- Artificial Intelligence
- Data Engineering
- System Design
- Distributed Systems
- Networking
- Low-level Systems
- DevOps
- Version Control
- Software Testing
- General Programming
- Languages and Frameworks
- Security

Questions are automatically grouped into logical categories for easier navigation.

## Features in Detail

### Category Grouping

Related categories are automatically grouped:
- **Web Development**: Front-end, Back-end, Full-stack, Web Development
- **Database**: Database and SQL, Database Systems
- **Data Science & AI**: Data Structures, Algorithms, Machine Learning, AI, Data Engineering
- **Systems & Infrastructure**: System Design, Distributed Systems, Networking, Low-level Systems
- **DevOps & Tools**: DevOps, Version Control, Software Testing
- **Programming Fundamentals**: General Programming, Languages and Frameworks

### Question Navigation

- **Swipe Gestures**: On mobile devices, swipe left or right to move between questions
- **Button Navigation**: Use Previous/Next buttons for precise navigation
- **Answer Toggle**: Click "Show Answer" to reveal the solution, "Hide Answer" to conceal it
- **Question Counter**: See your progress with the current question number

### Chatbot Features

- **Ask Questions**: Get help with any technical interview topic
- **Category Navigation**: Ask the chatbot to navigate to specific categories (e.g., "Show me web development questions")
- **Explanations**: Get detailed explanations and coding tips
- **Available Everywhere**: Access the chatbot from any page via the floating button

### AI Explanation Feature

- **Explain More Button**: Appears when you show an answer
- **Detailed Explanations**: Get comprehensive AI-powered explanations for any question
- **Bilingual Support**: Switch between English and French explanations
- **Beautiful Modal**: Elegant, responsive modal with smooth animations
- **Context-Aware**: AI understands the question and answer context
- **Fast Responses**: Powered by Groq's fast inference engine
- **Smart Caching**: Explanations cached for instant language switching

### Performance Optimizations

- **Client-Side Caching**: Categories cached for 5 minutes for instant loading
- **Optimized CSV Parsing**: Efficient parsing with error handling
- **Lazy Loading**: Components load only when needed
- **Memory Management**: Proper cleanup to prevent memory leaks
- **Responsive Design**: Optimized for all screen sizes

## Contributing

Contributions are welcome! Feel free to:
- Add more questions to the CSV file
- Improve the UI/UX
- Add new features
- Fix bugs
- Update documentation

## License

This project is open source and available for personal and educational use.

## Author

Created for practicing technical interview questions and improving coding interview skills.

---

Happy Interviewing! 🚀

