import React from 'react';
import BlackPage from './components/BlackPage';
import T1Logo from './components/T1Logo';
import StarsAnimation from './components/StarsAnimation';

function App() {
  return (
      <div className="App">
        <BlackPage>

            <T1Logo/>
            <StarsAnimation/>
        </BlackPage>
      </div>
  );
}

export default App;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import logo from './logo.svg';
// import './App.css';
//
// function App() {
//   const [data, setData] = useState(null);
//
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get('http://localhost:3000/api/data'); // Replace with your backend URL
//         setData(response.data);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };
//
//     fetchData();
//   }, []);
//
//   return (
//       <div className="App">
//         <header className="App-header">
//           <img src={logo} className="App-logo" alt="logo" />
//           {data ? (
//               <p>Data from backend: {data.nahhCount}</p>
//           ) : (
//               <p>Loading...</p>
//           )}
//           <a
//               className="App-link"
//               href="https://reactjs.org"
//               target="_blank"
//               rel="noopener noreferrer"
//           >
//             Learn React
//           </a>
//         </header>
//       </div>
//   );
// }
//
// export default App;