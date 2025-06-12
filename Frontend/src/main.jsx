import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux'
import {store} from './app/store.js'

// ComingSoon.jsx
// import Header from './layout/Header';
// import Footer from './layout/Footer';

// import * as themes from '../utils/themes';

// const SubmissionResultDetails = ({ testResults, setTestResults }) => {
//     return (
//         <div>
//             <button onClick={() => setTestResults(null)}>Back to Submissions</button>
//         </div>
//     );
// };

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
