import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";
import axios from "../axiosConfig";
import "bootstrap/dist/css/bootstrap.min.css";
import "./form.css";
import { db } from "./firebase"; // Import Realtime Database
import { ref, get, child } from "firebase/database";
import img from '../assets/Screenshot 2024-06-11 225909.png';

const Form = () => {
  const [formData, setFormData] = useState({
    title: "Mr.",
    name: "",
    occupation: "",
    companyType: "Company",
    mobile: "",
    email: "",
    productInterest: "",
    expectedDate: "",
    expectedTime: "",
  });


  const [products, setProducts] = useState([]);
  const [deptProducts, setDeptProducts] = useState({});
  const [dept, setDept] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    const fetchDept = async () => {
      try {
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, "Department"));
        if (snapshot.exists()) {
          const data = snapshot.val();
          const departments = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setDept(departments);
        } else {
          console.log("No data available");
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchDept();

    const fetchProducts = async () => {
      try {
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, "Products"));
        if (snapshot.exists()) {
          const data = snapshot.val();
          const productList = [];
          for (let id in data) {
            productList.push({ id, ...data[id] });
          }
          setProducts(productList);

          const structuredData = {};
          for (let id in data) {
            const product = data[id];
            const department = product.Department_name;
            if (!structuredData[department]) {
              structuredData[department] = [];
            }
            structuredData[department].push(product);
          }
          setDeptProducts(structuredData);
        } else {
          console.log("No data available");
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchProducts();
  }, []);

  const handleProductChange = (e, productName) => {
    if (e.target.checked) {
      setSelectedProducts([...selectedProducts, productName]);
    } else {
      setSelectedProducts(
        selectedProducts.filter((name) => name !== productName)
      );
    }
  };

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prevState) => {
        if (checked) {
          return {
            ...prevState,
            [name]: [...prevState[name], value],
          };
        } else {
          return {
            ...prevState,
            [name]: prevState[name].filter((item) => item !== value),
          };
        }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    validateField(name, value);
  };

  const validateField = (name, value) => {
    let formErrors = { ...errors };

    switch (name) {
      case "name":
        formErrors[name] = value ? "" : "Name is required.";
        break;
      case "occupation":
        formErrors[name] = value ? "" : "Occupation is required.";
        break;
      case "mobile":
        formErrors[name] =
          value.length === 10 ? "" : "Mobile number must be 10 digits.";
        break;
      case "email":
        formErrors[name] = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)
          ? ""
          : "Email is not valid.";
        break;
      case "expectedDate":
        formErrors[name] = value ? "" : "Expected date is required.";
        break;
      case "expectedTime":
        formErrors[name] = value ? "" : "Expected time is required.";
        break;
      case "productInterest":
        formErrors[name] = value ? "" : "Product interest is required.";
        break;
      case "selectedProducts":
        formErrors[name] =
          value.length > 0 ? "" : "At least one product must be selected.";
        break;
      default:
        break;
    }

    setErrors(formErrors);
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!formData.name) {
      isValid = false;
      formErrors["name"] = "Name is required.";
    }
    if (!formData.occupation) {
      isValid = false;
      formErrors["occupation"] = "Occupation is required.";
    }
    if (!formData.mobile) {
      isValid = false;
      formErrors["mobile"] = "Mobile number is required.";
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      isValid = false;
      formErrors["mobile"] = "Mobile number must be 10 digits.";
    }
    if (!formData.email) {
      isValid = false;
      formErrors["email"] = "Email is required.";
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      isValid = false;
      formErrors["email"] = "Email is not valid.";
    }
    if (!formData.productInterest) {
      isValid = false;
      formErrors["productInterest"] = "Product interest is required.";
    }
    if (selectedProducts.length === 0) {
      isValid = false;
      formErrors["selectedProducts"] = "At least one product must be selected.";
    }
    if (!formData.expectedDate) {
      isValid = false;
      formErrors["expectedDate"] = "Expected date is required.";
    }
    if (!formData.expectedTime) {
      isValid = false;
      formErrors["expectedTime"] = "Expected time is required.";
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const {
      title,
      name,
      occupation,
      companyType,
      mobile,
      email,
      productInterest,
      expectedDate,
      expectedTime,
    } = formData;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        name,
        occupation,
        companyType,
        mobile,
        email,
        productInterest,
        selectedProducts,
        expectedDate,
        expectedTime,
      }),
    };

    try {
      const res = await fetch(
        "https://fusiongreen-93d54-default-rtdb.firebaseio.com/Appoinments.json",
        options
      );
      if (res.ok) {
        alert("Message Sent");
        setFormData({
          title: "Mr.",
          name: "",
          occupation: "",
          companyType: "Company",
          mobile: "",
          email: "",
          productInterest: "",
          expectedDate: "",
          expectedTime: "09:00 AM",
        });
        setSelectedProducts([]);
        setErrors({});
      }
    } catch (error) {
      console.error("There was an error sending the form data!", error);
    }

    axios
      .post("/api/send-email", formData)
      .then((response) => {
        alert("Email sent successfully");
      })
      .catch((error) => {
        console.error("There was an error sending the email!", error);
      });
  };

  return (
    <>
      <h1 className="text-center text-success mb-4" style={{justifyContent:"center",padding:"20px"}}>
          FusionGreen Healthcare
      </h1>
      <div className="frmcnt">
        <form
          className="bg-white p-5 rounded-lg shadow-lg"
          method="POST"
          noValidate
          id="form"
          onSubmit={handleSubmit}
          style={{ maxWidth: "500px", width: "100%",borderRadius:"18px",zIndex:'200px'}}
        >
          <div className="frmb">

          </div>
          <h3 style={{color:'#198754'}}>Product Appointment</h3>
          <div className="form-group" style={{display:"flex"}} >
            <select
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-control"
              style={{borderColor:"#D5E0DB",width:"55px",border:"1.6px solid #D5E0DB"}}
            >
              <option value="Mr.">Mr.</option>
              <option value="Ms.">Ms.</option>
              <option value="Mrs.">Mrs.</option>
              <option value="Dr.">Dr.</option>
            </select>
            <div style={{paddingLeft:"15px"}}></div>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="form-control"
              required
              style={{
                paddingLeft:"15px",
                border:
                  formData.name.length  < 3 && formData.name.length > 0 ? "1.6px solid red" : "1.6px solid #D5E0DB",
              }}
            />
            </div>
            <div className="text-danger"  style={{marginTop:"-15px"}}>{errors.name}</div>
            <div style={{paddingBottom:"13px"}}></div>
          <div className="form-group">
            <input
              type="text"
              name="occupation"
              placeholder="Occupation"
              value={formData.occupation}
              onChange={handleChange}
              className="form-control"
              required
              style={{
                border:
                  formData.occupation.length < 3 && formData.occupation.length > 0
                    ? "1.6px solid red"
                    : "1.6px solid #D5E0DB",
              }}
            />
            <div className="text-danger">{errors.occupation}</div>
          </div>

          <div className="form-group">
            <select
              name="companyType"
              value={formData.companyType}
              onChange={handleChange}
              className="form-control"
              style={{borderColor:"#D5E0DB",border: '1.6px solid #D5E0DB'}}
            >
              <option value="Company">Company</option>
              <option value="Startup">Startup</option>
              <option value="Individual">Individual</option>
            </select>
          </div>

          <div className="form-group">
            <input
              type="tel"
              name="mobile"
              placeholder="Mobile"
              value={formData.mobile}
              onChange={handleChange}
              className="form-control"
              required
              style={{
                border:
                  formData.mobile.length !=10 && formData.mobile.length > 0
                    ? "1.6px solid red"
                    : "1.6px solid #D5E0DB",
              }}
            />
            <div className="text-danger">{errors.mobile}</div>
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              style={{
                border: !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email) && formData.mobile.length > 0
                  ? "1.6px solid red"
                  : "1.6px solid #D5E0DB",
              }}
              required
            />
            <div className="text-danger">{errors.email}</div>
          </div>

          <div className="form-group">
            <select
              name="productInterest"
              value={formData.productInterest}
              onChange={handleChange}
              className="form-control"
              style={{ border: "1.6px solid #D5E0DB" }}
            >
              <option value="">--- Select a product ---</option>
              <option value="Mindray">Mindray</option>
              <option value="Sinocare">Sinocare</option>
            </select>
            <div className="text-danger">{errors.productInterest}</div>
          </div>
      <h3 style={{color:"#198754"}}>Department</h3>
      <div className="department-products">
      {Object.entries(deptProducts).map(([department, products]) => (
        <div key={department} className="department-section">
          <label style={{}}>{department}</label>
          <div className="product-list d-flex">
            {products.map(product => (
              <div
                key={product.product_id}
                className="product-item d-flex align-items-center"
                style={{ fontSize: "10px" }}
              >
                <input
                  type="checkbox"
                  value={product.product_name}
                  onChange={e => handleProductChange(e, product.product_name)}
                  checked={selectedProducts.includes(product.product_name)}
                  id={`check-${product.product_id}`}
                  className="check"
                />
                <label htmlFor={`check-${product.product_id}`} style={{color:'#D5E0DB',}} className="glowing">
                  {product.product_name}
                </label>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>

    <div className="form-group">
            <input
              type="date"
              name="expectedDate"
              value={formData.expectedDate}
              onChange={handleChange}
              className="form-control"
              style={{borderColor:"#D5E0DB"}}
              required
            />
            <div className="text-danger">{errors.expectedDate}</div>
    </div>

          <div className="form-group">
            <input
              type="time"
              name="expectedTime"
              value={formData.expectedTime}
              onChange={handleChange}
              className="form-control"
              style={{
                border:
                  formData.expectedTime.length == 0
                    ? "1.6px solid red"
                    : "1.6px solid #D5E0DB",
                borderColor:"#D5E0DB"
              }}
              required
            />
            <div className="text-danger">{errors.expectedTime}</div>
          </div>

          <button type="submit" className="btn btn-success btn-block" >
            Book Appointment
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Form;
