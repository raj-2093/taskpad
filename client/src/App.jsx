import React from 'react'
import WebRoutes from './routes/WebRoutes'
import { useApi } from './context/ApiProvider'
import { Toaster } from 'react-hot-toast';

export default function App() {
  const { loading } = useApi();

  return (
    <div>
      { loading && <>Loading ...</> }
      { !loading && <WebRoutes/> }
      <Toaster
        toastOptions={{
          className: "", 
          style: {
            fontSize: "13px",
          }
        }}
      />
    </div>
  )
}