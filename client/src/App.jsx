import './App.css'
import Header from './components/Header/Header'
import AppRouter from './router'
import { GameProvider } from './contexts/GameContext'
import { LevelProvider } from './contexts/LevelContext'

function App() {
  return (
    <div className='app-wrapper'>
      <GameProvider>
        <LevelProvider>
          <Header />
          <main>
            <AppRouter />
          </main>
        </LevelProvider>
      </GameProvider>
    </div>
  )
}

export default App
