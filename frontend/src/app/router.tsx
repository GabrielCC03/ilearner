import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/home/Page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
}; 