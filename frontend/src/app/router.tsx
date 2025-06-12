import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './routes/Home';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  // Add more routes here
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
}; 