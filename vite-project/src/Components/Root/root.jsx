import { useNavigate } from "react-router-dom";
import "./root.scss";
import { useState } from "react";
import axios from "axios";

let LOGIN_URL = "http://localhost:8000/login";

const Root = () => {
  const [user_userName, setUser_UserName] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [roleType, setRoleType] = useState("");

  const navigate = useNavigate();
  // Options for the second dropdown based on the first selection
  const secondDropdownOptions = {
    Internal: ["System Admin", "System Manager", "Employee"],
    External: ["Customer", "Merchant/Organisation"],
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // check all fields filled out
    if (user_userName === "" || userPassword === "") {
      alert("Login failed. Please fill out all fields");
      return;
    }

    // validate login
    axios({
      method: "post",
      url: LOGIN_URL,
      data: {
        user_name: user_userName,
        password: userPassword,
      },
    }).then(
      (response) => {
        if (response.status === 200) {
          alert(`Login successful`);

          console.log(response.data);
          sessionStorage.setItem("userid", response.data.user_id);
          sessionStorage.setItem("name", response.data.name);
          sessionStorage.setItem("name", response.data.name);
          sessionStorage.setItem("user_userName", response.data.user_name);
          sessionStorage.setItem("roleType", response.data.user_role);
          sessionStorage.setItem("userType", response.data.user_type);
          sessionStorage.setItem(
            "accountNumber",
            response.data.account.account_number
          );
          sessionStorage.setItem("balance", response.data.account.balance);
          console.log(sessionStorage);

          navigate({
            pathname: "../" + userType.toLowerCase() + "user",
          });
        } else {
          alert(`Login failed. Please check your information and try again`);
        }
      },
      (error) => {
        console.log(error);
        alert(
          `Login failed: ${error.response.data}. Please check your information and try again`
        );
      }
    );
  };

  const handleClick = () => {
    navigate("/registration");
  };
  return (
    <>
      <div className="box-container">
        <div className="login-container">
          <h1>Login</h1>
          <form
            className="input-container"
            onSubmit={handleLoginSubmit}
            method="post"
          >
            <div>
              <select
                value={userType}
                className="user-dropdown"
                onChange={(e) => setUserType(e.target.value)}
              >
                <option value="">Select User Type</option>
                <option value="Internal">Internal</option>
                <option value="External">External</option>
              </select>

              {userType && (
                <select
                  value={roleType}
                  className="role-dropdown"
                  onChange={(e) => setRoleType(e.target.value)}
                >
                  <option value="">Select Option</option>
                  {secondDropdownOptions[userType].map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div>
              <input
                value={user_userName}
                className="username"
                type="text"
                placeholder="Username"
                onChange={(e) => setUser_UserName(e.target.value)}
              />
            </div>
            <div>
              <input
                value={userPassword}
                className="password"
                type="password"
                placeholder="Password"
                onChange={(e) => setUserPassword(e.target.value)}
              />
            </div>
            <button className="primary-button" type="submit">
              Login
            </button>
            <button className="primary-button" onClick={handleClick}>
              Register
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Root;
