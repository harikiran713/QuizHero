import QuizCard from './quiz-card'
import HistoryCard from './history-card'

interface DashboardGridProps {
    totalQuizzes: number;
}

export default function DashboardGrid({ totalQuizzes }: DashboardGridProps) {

    return (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            <QuizCard />
            <HistoryCard totalQuizzes={totalQuizzes} />

        </div>
    )
}