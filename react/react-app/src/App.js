
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from "./components/Navbar";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login"
import { Signup } from './pages/Signup';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Bookspage } from './pages/Bookspage';
import { UserPage } from './pages/UserPage';
import { useEffect } from 'react';


function App() {
  useEffect(() => {

  }, []);
  return (
    <>
      <Navbar />
      <div className='auth-wrapper'>
        <div className='auth-inner'>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/signup" element={<Signup />}></Route>
            <Route path="/books" element={<Bookspage />}></Route>
            <Route path="/user" element={<UserPage />}></Route>
          </Routes>
        </div>
      </div>
    </>
  );
}

export default App;
