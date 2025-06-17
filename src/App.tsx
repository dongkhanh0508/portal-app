import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {ThemeProvider, createTheme} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from '@/components/common/Layout/Layout';
import DynamicWorkflowPage from '@/pages/DynamicWorkflow/DynamicWorkflowPage';
import WidgetsBuilderPage from '@/pages/WidgetsBuilder/WidgetsBuilderPage';
import BacklogPage from '@/pages/Backlog/BacklogPage';
import '@/styles/global.scss';
import ErrorBoundary from './components/common/ErrorBoundary';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
        },
        secondary: {
            main: '#dc004e',
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <div className="app-container">
                <Router>
                    <Layout>
                        <Routes>
                            <Route path="/" element={<DynamicWorkflowPage/>}/>
                            <Route path="/workflow" element={<DynamicWorkflowPage/>}/>
                            <Route path="/widgets" element={<WidgetsBuilderPage/>}/>
                            <Route path="/backlog" element={
                                <ErrorBoundary>
                                    <BacklogPage/>
                                </ErrorBoundary>
                            }/>
                        </Routes>
                    </Layout>
                </Router>
            </div>
        </ThemeProvider>
    );
}

export default App;
