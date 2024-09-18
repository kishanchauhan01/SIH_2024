import React from 'react';
import {Tilt} from 'react-tilt';
import NewsForm from './NewsForm';
// import './App.css'; // Optionally, add custom styles if needed

const Temp = () => {
  return (
    <Tilt className="Tilt" options={{ max: 25, speed: 400 }} style={{ width:600 , margin:"auto  " } }> 
        <NewsForm />
    </Tilt>
  );
};

export default Temp;


