import styled from 'styled-components';
import React from "react";
import './App.css';
import Home from './components/Home/Home';
import data from './data.js';

const Header = styled.div`
  text-align: center;
  padding: 1.2em;
`;

function App() {
  return (
    <div>
      <Header>
        <h1>Team F</h1>
        <h2><i>YikYak meets Spotify</i></h2>
      </Header>
      <Home posts={data}/>
    </div>
  );
}

export default App;
