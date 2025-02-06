import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css'
import Login1 from "./Login1";
import Mynote from "./Mynote";
import Signup from "./Signup";
import Layout from "./Layout";
import AddNote from "./AddNote";
import EditNote from "./Editnote"; // ✅ นำเข้า EditNote


const router = createBrowserRouter([
  { path: '/', element: <Login1 /> },
  { path: '/signup', element: <Signup /> },
  {
    path: '/user',
    element: <Layout />,
    children: [
      { path: 'mynote', element: <Mynote /> },
      { path: 'creat', element: <AddNote /> },
      { path: 'edit-note/:id', element: <EditNote /> } 
    ]
  }
]);

const App = () => (
  <div>
    <RouterProvider router={router} />
  </div>
);

export default App;
