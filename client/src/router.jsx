import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home/Home'
import GameWrapper from './pages/Game/GameWrapper'

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element= {<Home />} />
            <Route path="/level/:levelId" element= {<GameWrapper />}/>
        </Routes>
    )
}

export default AppRouter