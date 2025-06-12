import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/home/Home';
import SpacePage from './pages/learningSpace/Page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/spaces/:id',
    element: <SpacePage/>,
  },
  // Add more routes here
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
}; 