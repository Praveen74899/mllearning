import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/index';
import { MyProvider } from './contexts/AuthContext';



function App() {
  return (
       <MyProvider>
        <div className="min-h-screen bg-gray-50 font-inter text-gray-900">
        <AppRoutes />
         <Toaster/>
      </div>
       </MyProvider>
      
  );
}

export default App;