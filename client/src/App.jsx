import React from 'react'
import WebRoutes from './routes/WebRoutes'
import { useApi } from './context/ApiProvider'

export default function App() {
  const { loading } = useApi();

  return (
    <div>
      { loading && <>Loading ...</> }
      { !loading && <WebRoutes/> }
    </div>
  )
}