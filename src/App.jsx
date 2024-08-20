import './App.css'
import { MainAppLayout } from './components/layout/mainapp'
import { Suspense } from 'react'
import { ColoredLoader } from './components/global/loader'
import ErrorBoundary from './utils/errorboundary'
import { ErrorBoundaryFallBack } from './routes/error/errorboundary'

function App() {

  return (
    // <ErrorBoundary fallback={<ErrorBoundaryFallBack />}>
    <Suspense fallback={<ColoredLoader />} >
      <MainAppLayout />
    </Suspense>
    // </ErrorBoundary>
  )
}

export default App