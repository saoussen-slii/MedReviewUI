import { ApolloProvider } from '@apollo/client'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

import App from './App'
import { apolloClient } from './graphql/client'
import './index.css'
import { store } from './store/store'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={apolloClient}>
      <Provider store={store}>
        <App />
      </Provider>
    </ApolloProvider>
  </StrictMode>,
)
