import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import Stack from '@mui/material/Stack';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

function App() {

  const [message, setMessage] = useState('');
  const [responseArr, setResponseArr] = useState([]);

  const [value, setValue] = React.useState('fruit');
  const [model, setModel] = React.useState('')
  const [models_list, setModelsList] = useState([]);
  const [mainModel, setMainModel] = useState('');

  useEffect(() => {
    fetch('/models_openai').then(res => res.json()).then(data => {
      setModelsList(data.models);
    });
  }, []);

 const handleChange = (event) => {

   setModel(event.target.value);

 };

 const handleModelChange = (event) => {
   if (event.target.value === "openai") {
     fetch('/models_openai').then(res => res.json()).then(data => {
       setModelsList(data.models);
     });
   } else if  (event.target.value === "anthropic") {
     fetch('/models_anthropic').then(res => res.json()).then(data => {
       setModelsList(data.models);
     });
   } else {
       setModelsList([]);
   }
   setMainModel(event.target.value);

 };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const message_temp = "Query: " + message
    setResponseArr(prevItems => [...prevItems, message_temp])
    const res = await fetch('/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, model, mainModel })
    });
    const data = await res.json();
    setMessage('');
    const response_temp = "Response: " + data.response
    setResponseArr(prevItems => [...prevItems, response_temp])
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
    <Card variant="outlined" sx={{ width: 0.9, padding:0.1 }}>
      <Box sx={{ p: 2 }}>
        <Stack spacing={2} style={{ display: 'flex' }}>
          {responseArr.map((item, index) => (<div key={index} style={{ flex: 1 }}>{item}</div>
          ))}
        </Stack>
      </Box>
      <Divider />
      <Box sx={{ p: 2 }} position="sticky">
      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>

      <Stack spacing={2} style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <div key="dropDown">
          <label sx={{ mt: 2 }}> Main Model
            <Select value={mainModel} onChange={handleModelChange} sx={{ mb: 1 }}>
               <MenuItem value="select">Select</MenuItem>
               <MenuItem value="openai">Open AI</MenuItem>
               <MenuItem value="anthropic">Anthropic</MenuItem>
             </Select>
          </label>
          <label> Model
            <Select value={model} onChange={handleChange}>
              {models_list.map((model) => (<MenuItem value={model}>{model}</MenuItem> ))}
            </Select>
            </label></div>

            <div position="sticky" key="text"><TextField
              type="text"
              id="outlined-multiline-flexible"
              label="Query"
              style={{ width: '300px', height: '50px', fontSize: '10px'}}
              multiline
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button type="submit">Send</Button></div>
    </Stack>
      </form>
      </Box>
    </Card>
    </div>
  );
}

export default App;
