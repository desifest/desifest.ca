import { Toaster } from 'react-hot-toast'
import AppRoutes from './Routes/AppRoutes'
export default function App() {
    return (
        <>
            <Toaster
                position="top-center"
                toastOptions={{
                    style: {
                        background: '#ffffff',
                        color: '#100422',
                        fontWeight: 500,
                    },
                    success: {
                        duration: 3000,
                    },
                    error: {
                        duration: 4000,
                    },
                }}
            />

            <AppRoutes />
        </>
    )
}
