import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import FormTable from './components/FormTable';


axios.defaults.baseURL = 'http://localhost:8080/';

function App() {
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: ""
  });

  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    _id: ""
  });

  const [DataList, setDataList] = useState([]);

  const handleOnChange = (e) => {
    const { value, name } = e.target;
    setFormData((preve) => {
      return {
        ...preve,
        [name] : value
      }
    })
  }

  const handleEditOnChange = (e) => {
    const { value, name } = e.target;
    setEditFormData((preve) => {
      return {
        ...preve,
        [name] : value
      }
    }
    )
  }


  const handleSubmit = async(e) => {
    e.preventDefault();
    const data = await  axios.post("/create", formData);
    console.log(data);
    if(data.data.success){
      setShowModal(false);
      alert(data.data.message);
      getFetchData();
    }
  }

  const getFetchData = async() => {
    const data = await axios.get("/");
    console.log(data);
    if(data.data.success){
      setDataList(data.data.data);
    }
  }


  useEffect(() => {
    getFetchData();
  },[]);

  const handleDelete = async(id) => {
    const data = await axios.delete('/delete/'+id);
    if(data.data.success){
      alert(data.data.message);
      getFetchData();
    }
  }

  const handleUpdate = async(e) => {
    e.preventDefault();
    const data = await axios.put("/update",editFormData);
    console.log(data);
    if(data.data.success){
      setShowEditModal(false);
      alert(data.data.message);
      getFetchData();
    }
  }

  const handleEdit = (item) => {
    setEditFormData(item)
    console.log(editFormData);
    setShowEditModal(true);
  }


  return (
    <>
      <div className="container">
        <button className='btn btn-add' onClick={() => setShowModal(true)}>ADD</button>
        {
          showModal && (
            <FormTable
              handleSubmit={handleSubmit}
              handleOnChange={handleOnChange}
              handleclose={() => setShowModal(false)}
              rest={formData}
            />
          )
        }

        {
          showEditModal && (
            <FormTable
              handleSubmit={handleUpdate}
              handleOnChange={handleEditOnChange}
              handleclose={() => setShowEditModal(false)}
              rest={editFormData}
            />
          )
        }

        <div className='tableContainer'>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              { DataList[0] ? (
                DataList.map((item) => (
                  <tr key={item._id}>
                    <td>{item.name}</td>
                    <td>{item.email}</td>
                    <td>{item.mobile}</td>
                    <td>
                      <button className='btn btn-edit' onClick={
                        ()=>{handleEdit(item)
                      }}>Edit</button>
                      <button className='btn btn-delete' onClick={()=>handleDelete(item._id)}>Delete</button>
                    </td>
                  </tr>
                )))
                : (
                  <tr>
                    <td colSpan='4'>No data found</td>
                  </tr>
                )

              }
            </tbody>
          </table>
        </div>

          

      </div>


    </>
  );
}

export default App;
