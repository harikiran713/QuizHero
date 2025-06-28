import QuizCard from './quiz-card'
import HistoryCard from './history-card'
export default function Dashboard(){

    return(
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
            <QuizCard/>
            <HistoryCard/>

        </div>
    )
}