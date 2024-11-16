import { useState } from 'react';
//import 'bootstrap/dist/css/bootstrap.min.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'

import CreateUser from './CreateUser';

function RoutesNav(){
    return(
        <div className='RoutesNav'>
            <BrowserRouter>
                <Routes>
                <Route path='/CreateUser' element= {<CreateUser />}></Route>
                </Routes>
            </BrowserRouter>
        </div>
    )
}

export default RoutesNav;