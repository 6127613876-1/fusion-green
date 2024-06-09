import React, { useEffect, useState } from 'react';
import { Sidebar } from './Sidebar';
import { Button, Table } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useNavigate } from 'react-router-dom';
import { db } from './firebase'; // Import Realtime Database
import { ref, get, child, remove } from "firebase/database";

const appoi = () =>{
    const [formData, setFormData] = useState([]);
     useEffect(() => {
    const fetchProducts = async () => {
      try {
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, 'Appoinments'));
        if (snapshot.exists()) {
          const data = snapshot.val();
          const productsArray = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          setFormData(productsArray);
        } else {
          console.log("No data available");
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchProducts();
  }, []);
  return (
    <>
      <div className='d-flex'>
        <div>
          <Sidebar />
        </div>
        <div className='p-5'>
          <h2 className='mb-3'>Appoinments</h2>
          <Table striped bordered hover className='mt-4'>
            <thead>
              <tr>
                <th>title</th>
                <th>Name</th>
                <th>Occupation</th>
                <th>CompanyType</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>ProductInterest</th>
                <th>Department</th>
                <th>ExpectedDate</th>
                <th>ExpectedTime</th>
              </tr>
            </thead>
            <tbody>
              {formData.map(formData => (
                <tr key={formData.id}>
                  <td>{formData.title}</td>
                  <td>{formData.name}</td>
                  <td>{formData.occupation}</td>
                  <td>{formData.companyType}</td>
                  <td>{formData.mobile}</td>
                  <td>{formData.email}</td>
                  <td>{formData.productInterest}</td>
                  <td>{formData.department}</td>
                  <td>{formData.expectedDate}</td>
                  <td>{formData.expectedTime}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default appoi;
