import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import TodoBoard from './pages/TodoBoard'

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<TodoBoard />} />
        </Routes>
      </Router>
    </>
  )
}

export default App