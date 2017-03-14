declare var require: any;
import * as React from 'react';
import { Component } from 'react';
const logo = require('./logo.svg');
import './App.scss';

class App extends Component<any, any> {
  render() {
    return (
      <div className='App'>
        <div className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <h2>Welcome to React</h2>
        </div>
        <p className='App-intro'>
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
