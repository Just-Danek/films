import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppRoot, ConfigProvider } from '@vkontakte/vkui';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx'
import '@vkontakte/vkui/dist/cssm/styles/themes.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ConfigProvider>
        <AppRoot>
          <App />
        </AppRoot>
      </ConfigProvider>
    </BrowserRouter>
  </StrictMode>,
)
