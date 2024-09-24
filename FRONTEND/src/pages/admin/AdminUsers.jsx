import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Header from '../Header'
import { Container } from '@mui/material'

const AdminUsers = () => {
    const[data,setData]=useState([])
    const fetechDataFromApi=()=>{
        axios.get('http://localhost:5000/api/userlist').then(
            (response)=>{
                setData(response.data)
            }
        )

    }

    
    const deleteUser = (id) => {
        const token = sessionStorage.getItem("userToken"); // Get the token from session storage

        console.log('button is working');
        axios.delete(`http://localhost:5000/api/deleteone/${id}`, {
            headers: {
                Authorization: `${token}` // Add the token to the headers
            }
        })
        .then((response) => {
            alert(response.data.message);
            window.location.reload(false);
        })
        .catch((error) => {
            console.error('Error deleting user:', error);
            alert('An error occurred while deleting the user.');
        });
    };
    // const deleteUser=(id)=>{
        
    //     // sessionStorage.setItem("userToken", token);
    //     console.log('button is working');
    //     axios.delete('http://localhost:5000/api/deleteone/'+id)
    //     .then((response)=>{
    //         alert(response.data.message);
    //         const token = response.data.token;
    //         sessionStorage.setItem("userToken", token);
    //         window.location.reload(false);
    //     })
    // }



    useEffect(()=>{
        fetechDataFromApi()
    },[])

  return (
    <div>
         <Header/>
         <Container  style={{backgroundColor:'#423B47',marginBottom:'30px',borderRadius:'50px',maxWidth:'84.5%'}}>
        <h2 style={{textAlign:'center',fontWeight:'bolder',marginTop:'40px',color:'aliceblue',}}>USERS LIST </h2>
        </Container>
        <div className="container mt-2">
  <div className="row justify-content-center">
    <div className="col-12 col-md-12">
      <div className="row g-3 mt-3 mb-3">
        {data.map((value, index) => {
          return (
            <div className="col-12 col-sm-6 col-md-6 col-lg-6">
              <div class="card border-dark">
                <ul class="list-group list-group-flush">
                  <li class="list-group-item">Name: {value.name}</li>
                  <li class="list-group-item">Email: {value.email}</li>
                  <li class="list-group-item">Phone: {value.phone}</li>
                  <li class="list-group-item">Role: {value.role}</li>
                  <li class="list-group-item">Username: {value.username}</li>
                  <li class="list-group-item">Password: {value.password}</li>
                  <li class="list-group-item">
                    <button
                      type="button"
                      class="btn btn-danger"
                      onClick={() => deleteUser(value._id)}
                    >
                      Delete
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
</div>;
    </div>
  )
}

export default AdminUsers