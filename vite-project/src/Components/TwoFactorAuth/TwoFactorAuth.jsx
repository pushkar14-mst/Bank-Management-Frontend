import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "./TwoFactorAuth.css";

const TwoFactorAuth = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [inputSecret, setInputSecret] = useState("");
  const state = useLocation().state;
  const username = state.username;
  const userType = String(state.userType);
  const password = state.password;
  const navigate = useNavigate();
  useEffect(() => {
    const fetch2FA = async () => {
      await axios
        .post("https://bank-management-backend-five.vercel.app/enable-2fa", {
          username,
        })
        .then(
          (response) => {
            console.log(response);
            if (response.status === 200) {
              setQrCodeUrl(response.data.qrCode);
            } else {
              alert(
                `2FA failed. There was an error generating the 2FA code. Please try again`
              );
            }
          },
          (error) => {
            console.log(error);
            alert(
              `2FA failed. There was an error generating the 2FA code. Please try again`
            );
          }
        );
    };
    fetch2FA();
  }, []);

  // Do something
  const verifySecret = async () => {
    await axios
      .post("https://bank-management-backend-five.vercel.app/verify-secret", {
        username: username,
        clientSecret: inputSecret,
      })
      .then(
        (response) => {
          console.log(response);
          if (response.status === 200) {
            alert(`2FA successful`);
            onVerifySuccess();
          } else {
            alert(
              `2FA failed. There was an error verifying the 2FA code. Please try again`
            );
          }
        },
        (error) => {
          console.log(error);
          alert(
            `2FA failed. There was an error verifying the 2FA code. Please try again`
          );
        }
      );
  };

  const onVerifySuccess = async () => {
    await axios({
      method: "post",
      url: "http://localhost:8000/login",
      data: {
        user_name: username,
        password: password,
      },
    }).then(
      (response) => {
        if (response.status === 200) {
          alert(`Login successful`);
          console.log(response.data);
          console.log(response.data.user_details.account);
          sessionStorage.setItem("userid", response.data.user_details.user_id);
          sessionStorage.setItem("name", response.data.user_details.name);
          sessionStorage.setItem("name", response.data.user_details.name);
          sessionStorage.setItem(
            "user_userName",
            response.data.user_details.user_name
          );
          sessionStorage.setItem(
            "roleType",
            response.data.user_details.user_role
          );
          sessionStorage.setItem(
            "userType",
            response.data.user_details.user_type
          );
          sessionStorage.setItem(
            "accountNumber",
            response.data.user_details.account.account_number
          );
          sessionStorage.setItem(
            "balance",
            response.data.user_details.account.balance
          );
          console.log(sessionStorage);
          navigate({
            pathname:
              "../" + sessionStorage.getItem("userType").toLowerCase() + "user",
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
  return (
    <>
      <div className="two-factor-auth-container">
        <div className="two-factor-auth">
          {qrCodeUrl.length > 0 ? (
            <>
              <h1>Two Factor Authentication</h1>
              <img
                src={qrCodeUrl}
                alt="QR Code"
                style={{ width: "200px", height: "200px" }}
              />
              <p>Scan the QR and type the security code for verification.</p>
              <div>
                <input
                  value={inputSecret}
                  className="otp"
                  type="text"
                  placeholder="OTP"
                  onChange={(e) => setInputSecret(e.target.value)}
                />
              </div>
              <button className="verify-secret" onClick={verifySecret}>
                Verify Secret
              </button>
            </>
          ) : (
            <h1>Generating 2FA Code...</h1>
          )}
        </div>
      </div>
    </>
  );
};
export default TwoFactorAuth;
