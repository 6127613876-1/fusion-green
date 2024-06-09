import React from 'react';
import { Route, Routes } from "react-router-dom";
import Form from './routes/form'
import Home from './routes/Home';
import Footer from './components/Footer';
import validationSchema from './routes/ValidateFieldWithSchema' 

function App() {
    return (
      <div className="App">
        <Routes>
            <Route path="/"  element={<Home/>} />
            <Route path="/appointment" element={<Form/>} />
            <Route path="/foot"  element={<Footer />} />
            <Route path='/vali' element={<validationSchema/>}/>
        </Routes>
        </div>
    );
}

export default App;
