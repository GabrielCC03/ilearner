import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/home/Page';
import LearningSpacePage from './pages/learningSpace/Page';
import EssayTopicPage from './pages/tools/essayTopic/Page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/learning-space/:id',
    element: <LearningSpacePage />,
  },
  {
    path: '/tools/essay-topic',
    element: <EssayTopicPage />,
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
}; 