import "./VerifyEmail.css";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
const VerifyEmail = () => {
  const [inputOtp, setInputOtp] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  console.log(location.state);
  const [user, setUser] = useState({
    email: location.state.email,
    name: location.state.name,
    user_name: location.state.user_name,
    password: location.state.password,
    user_type: location.state.user_type,
    user_role: location.state.user_role,
  });
  const onVerifySuccess = async () => {
    await axios({
      method: "post",
      url: "http://localhost:8000/registration",
      data: user,
    }).then(
      (response) => {
        console.log(response);
        if (response.status === 201) {
          alert(`Registration successful`);
          navigate("/");
        } else {
          alert(
            `Registration failed. There was an error saving the user. Please try again`
          );
        }
      },
      (error) => {
        console.log(error);
        alert(
          `Registration failed. There was an error saving the user. Please try again`
        );
      }
    );
  };

  const verifyOtp = async () => {
    await axios
      .post("https://bank-management-backend-five.vercel.app/verify-otp", {
        email: user.email,
        otp: inputOtp,
      })
      .then(
        (response) => {
          console.log(response);
          if (response.status === 200) {
            alert(`Email verification successful`);
            onVerifySuccess();
          } else {
            alert(
              `Email verification failed. There was an error verifying the email. Please try again`
            );
          }
        },
        (error) => {
          console.log(error);
          alert(
            `Email verification failed. There was an error verifying the email. Please try again`
          );
        }
      );
  };
  return (
    <div className="verify-email-container">
      <button
        className="back-button"
        onClick={() => {
          window.history.back();
        }}
      >
        Back
      </button>
      <h1>Verify Email</h1>
      <form
        className="verify-input-container "
        method="post"
        onSubmit={async (e) => {
          e.preventDefault();
          await verifyOtp();
        }}
      >
        <div>
          <input
            className="verification-code"
            type="text"
            placeholder="Enter Verification Code"
            onChange={(e) => setInputOtp(e.target.value)}
          />
        </div>
        <div>
          <button className="verify-email-button" type="submit">
            Verify Email
          </button>
        </div>
      </form>
    </div>
  );
};

export default VerifyEmail;
