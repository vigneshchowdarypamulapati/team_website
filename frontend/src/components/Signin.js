import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import image from "../images/login.jpg";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Login() {
  var bg = {
    backgroundImage: `url(${image})`,
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  };

  const history = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const validate = (e) => {
    e.preventDefault();
    if (email === "") {
      alert("Email field is required");
    } else if (!email.includes("@")) {
      alert("Please enter a valid email address");
    } else if (password === "") {
      alert("Password is required");
    } else {
      handlesubmit();
    }
  };

  const handlesubmit = () => {
    fetch("https://team-website-backend.onrender.com/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        email: email,
        pass: password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.message === "Login successful") {
          alert("Login successful");
          history("/firstpage"); // This is the routing after login
        } else {
          // Access the 'message' property of the response and show it in the alert
          alert(data.message || "Error occurred");
        }
      })
      .catch((error) => {
        console.error("Error during signin:", error);
        alert("An error occurred. Please try again later.");
      });
  };

  return (
    <>
      <div
        className="image"
        style={{
          ...bg,
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="mx-4">
          <h3 className="text-center" style={{ color: "white" }}>
            Sign In
          </h3>
          <Form onSubmit={validate}>
            <Form.Group className="mx-4 my-3">
              <Form.Control
                type="email"
                name="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email"
              />
            </Form.Group>
            <Form.Group className="mx-4 my-3">
              <Form.Control
                type="password"
                name="password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your Password"
              />
            </Form.Group>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                variant="success"
                className="mx-4"
                type="submit" // Removing onClick here
              >
                Submit
              </Button>
            </div>
          </Form>
          <p className="mt-3 mx-5" style={{ color: "white" }}>
            Don't have an account?{" "}
            <span>
              <NavLink style={{ color: "red" }} to="/signup">
                Sign Up
              </NavLink>
            </span>
          </p>
        </div>
      </div>
    </>
  );
}
