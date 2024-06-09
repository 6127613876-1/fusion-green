import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";
import axios from "../axiosConfig";
import "bootstrap/dist/css/bootstrap.min.css";
import "./form.css";
import { db } from "./firebase"; // Import Realtime Database
import { ref, get, child } from "firebase/database";

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
    expectedTime: "09:00 AM",
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
        const snapshot = await get(child(dbRef, "Products")); // Fetch from 'Products' node
        if (snapshot.exists()) {
          const data = snapshot.val();
          console.log("Fetched data:", data); // Log fetched data
          const productList = [];
          for (let id in data) {
            productList.push({ id, ...data[id] });
          }
          console.log("Product List:", productList); // Log product list
          setProducts(productList);
        } else {
          console.log("No data available");
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchProducts();
    const fetchProducts2 = async () => {
      try {
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, "Products")); // Fetch from 'Products' node
        if (snapshot.exists()) {
          const data = snapshot.val();
          const structuredData = {};
          for (let id in data) {
            const product = data[id];
            const department = product.Department_name;
            if (!structuredData[department]) {
              structuredData[department] = [];
            }
            structuredData[department].push(product);
          }
          console.log("Structured Data:", structuredData); // Log structured data
          setDeptProducts(structuredData);
        } else {
          console.log("No data available");
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchProducts();
    fetchProducts2();
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
          if (!validateForm()) {
            return;
          }
          return {
            ...prevState,
            [name]: prevState[name].filter((item) => item !== value),
          };
        }
      });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
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
      department,
      equipment,
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
        department,
        equipment,
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
          department: [],
          equipment: [],
          expectedDate: "",
          expectedTime: "09:00 AM",
        });
        setSelectedProducts([]);
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
      <div className="form-content-right">
        <form
          className="bg-white p-5 rounded-lg shadow-lg"
          method="POST"
          noValidate
          id="form"
          onSubmit={handleSubmit}
          style={{ maxWidth: "500px", width: "100%" }}
        >
          <h1 className="text-center text-success mb-4">
            FusionGreen Healthcare
          </h1>

          <div className="form-group">
            <label htmlFor="title" className="font-weight-bold">
              Title
            </label>
            <select
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="form-control"
              style={{ border: " .5px solid green" }}
            >
              <option value="Mr.">Mr.</option>
              <option value="Ms.">Ms.</option>
              <option value="Mrs.">Mrs.</option>
              <option value="Dr.">Dr.</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="name" className="font-weight-bold">
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className="form-control"
              required
            />
            <div className="text-danger">{errors.name}</div>
          </div>

          <div className="form-group">
            <label htmlFor="occupation" className="font-weight-bold">
              Occupation
            </label>
            <input
              type="text"
              name="occupation"
              placeholder="Enter your occupation"
              value={formData.occupation}
              onChange={handleChange}
              className="form-control"
              required
            />
            <div className="text-danger">{errors.occupation}</div>
          </div>

          <div className="form-group">
            <label className="font-weight-bold">Company Type</label>
            <div className="d-flex">
              <div className="form-check">
                <input
                  type="radio"
                  name="companyType"
                  value="Company"
                  checked={formData.companyType === "Company"}
                  onChange={handleChange}
                  className="form-check-input"
                  id="companyTypeCompany"
                />
                <label
                  className="form-check-label"
                  htmlFor="companyTypeCompany"
                >
                  Company
                </label>
              </div>
              <div className="form-check">
                <input
                  type="radio"
                  name="companyType"
                  value="Hospital"
                  checked={formData.companyType === "Hospital"}
                  onChange={handleChange}
                  className="form-check-input"
                  id="companyTypeHospital"
                />
                <label
                  className="form-check-label"
                  htmlFor="companyTypeHospital"
                >
                  Hospital
                </label>
              </div>
              <div className="form-check">
                <input
                  type="radio"
                  name="companyType"
                  value="Laboratory"
                  checked={formData.companyType === "Laboratory"}
                  onChange={handleChange}
                  className="form-check-input"
                  id="companyTypeLaboratory"
                />
                <label
                  className="form-check-label"
                  htmlFor="companyTypeLaboratory"
                >
                  Laboratory
                </label>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="mobile" className="font-weight-bold">
              Mobile
            </label>
            <input
              type="text"
              name="mobile"
              placeholder="Enter your mobile number"
              value={formData.mobile}
              onChange={handleChange}
              className="form-control"
              required
            />
            <div className="text-danger">{errors.mobile}</div>
          </div>

          <div className="form-group">
            <label htmlFor="email" className="font-weight-bold">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              required
            />
            <div className="text-danger">{errors.email}</div>
          </div>

          <div className="form-group">
            <label htmlFor="productInterest" className="font-weight-bold">
              Product Interest
            </label>
            <select
              name="productInterest"
              value={formData.productInterest}
              onChange={handleChange}
              className="form-control"
              style={{ border: ".5px solid green" }}
            >
              <option value="">--- Select a product ---</option>
              <option value="Mindray">Mindray</option>
              <option value="Sinocare">Sinocare</option>
            </select>
          </div>
          {/* <div className="department-products">
            {Object.entries(deptProducts).map(([department, products]) => (
                <div key={department} className="department-section">
                    <h2>{department}</h2>
                    <div className="product-list">
                        {products.map(product => (
                            <div key={product.product_id} className="product-item">
                                {product.product_name}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div> */}
          <div className="department-products">
            {Object.entries(deptProducts).map(([department, products]) => (
              <div key={department} className="department-section">
                <h5>{department}</h5>
                <div className="product-list">
                  {products.map((product) => (
                    <div
                      key={product.product_id}
                      className="product-item"
                      style={{ fontSize: "16px" }}
                    >
                      <label style={{ paddingLeft: "2px" }}>
                        <input
                          type="checkbox"
                          value={product.product_name}
                          onChange={(e) =>
                            handleProductChange(e, product.product_name)
                          }
                          checked={selectedProducts.includes(
                            product.product_name
                          )}
                          className="checkbox"
                        />
                        {product.product_name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="form-group">
            <label htmlFor="expectedDate" className="font-weight-bold">
              Expected Date for Appointment
            </label>
            <input
              type="date"
              name="expectedDate"
              value={formData.expectedDate}
              onChange={handleChange}
              className="form-control"
              style={{ border: " .5px solid green" }}
              required
            />
            <div className="text-danger">{errors.expectedDate}</div>
          </div>

          <div className="form-group">
            <label htmlFor="expectedTime" className="font-weight-bold">
              Expected Time
            </label>
            <input
              type="time"
              name="expectedTime"
              value={formData.expectedTime}
              onChange={handleChange}
              className="form-control"
              style={{ border: " .5px solid green" }}
              required
            />
            <div className="text-danger">{errors.expectedTime}</div>
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-success btn-block">
              Make Appointment
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Form;
