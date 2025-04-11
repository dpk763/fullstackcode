import React, {useState, useEffect, useRef} from 'react'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css'
function App() {
  const [data,setData] = useState([]);
  const [val, setVal]=useState('');
  const [update, setUpdate]=useState(null);
  const updateBtn = useRef(null);
  const addBtn = useRef(null);
  useEffect(()=>{
    axios
    .get("http://localhost:5000/users")
    .then(res=> setData(res.data))
    .catch(error=> console.log(error))
  },[]);
  
  const handleChange = ()=>{
    if(val.trim()==='') return;
    axios
    .post("http://localhost:5000/users",{id:data.length+1,name:val})
    .then(res=> {
      setData([...data, res.data]);
      setVal('');
    })
    .catch(error=> console.log(error))
  }

  const handleInput = (e)=>{
    setVal(e.target.value);
  }

  const deleteHandle = (e, index)=>{
    axios
    .delete(`http://localhost:5000/users/${e}`)
    .then(res=> {
      console.log("Data Deleted");
      setData(data.filter((item, i)=>i!==index));
    })
    .catch(error=> console.log(error))
  }

  const editHandle = (e,name)=>{
    updateBtn.current.style.display="inline";
    addBtn.current.style.display="none";
    setUpdate(e);
    setVal(name);
  }

  const updateHandle = ()=>{
    axios
    .put(`http://localhost:5000/users/${update}`,{name:val})
    .then(res=> {
      axios
      .get("http://localhost:5000/users")
      .then(res=> setData(res.data))
      .catch(error=> console.log(error));
      setVal('');
      updateBtn.current.style.display="none";
      addBtn.current.style.display="inline";
    })
    .catch(error=> console.log(error))
  }
  return (
    <>
      <div className="container mt-4">
      <input className='form-control' type="text" onChange={handleInput} value={val}/>
      <button className='btn btn-primary my-2' ref={addBtn} onClick={handleChange}>add</button>
      <button className='btn btn-primary my-2' ref={updateBtn} onClick={updateHandle} style={{display:"none"}}>Update</button>
      <table className="table">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Name</th>
          <th scope="col">Edit</th>
          <th scope="col">Delete</th>
        </tr>
      </thead>
      <tbody>
    {data.map((item, index)=>{
      return (
       
              <tr key={index}>
                <th scope="row">{index+1}</th>
                <td>{item.name}</td>
                <td><button className='btn btn-success' onClick={()=>editHandle(item._id,item.name)}>Edit</button></td>
                <td><button className='btn btn-primary' onClick={()=>deleteHandle(item._id, index)}>Delete</button></td>
              </tr>
      
      )
    })}
    </tbody>
  </table>
  </div>
    </>
  )
}

export default App
