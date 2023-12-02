import { useEffect } from 'react';
import './App.css';

function App() {



  useEffect(()=>{
    const fetchdata=async ()=>{
      try{
        const data= await fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json');
        if(data.ok) {
          const res=await data.json();
          console.log(res);
        }
        else console.log("Data not found");
      }catch(error){
        console.error("Data not fount",error);
      }
    }
    fetchdata();
  },[])
  return (
    <div className="absolute w-screen px-8 py-2 bg-gradient-to-b from-black z-10 flex justify-between">
      <h1>hello world</h1>
    </div>
  );
}

export default App;
