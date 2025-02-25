import '@styles/globals.css'
import { AuthContextProvider } from '../context/AuthContext'

function Application({ Component, pageProps }) {
  return (
    <AuthContextProvider>
      <Component {...pageProps} />
    </AuthContextProvider>
  )
}

export default Application
