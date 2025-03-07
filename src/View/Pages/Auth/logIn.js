import "../../../CSS/Auth/login.css";
import brightBackGround from "../../../Assets/Images/Logo/PNG/brightFormBackGround.png";
import studentBackGround from "../../../Assets/Images/Logo/PNG/StudentBackGround.png";
import Logo from "../../../Assets/Images/Logo/PNG/LogoSquare@0.5x.png";
import Input from "../../Components/Auth/Input";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import "../../../index.css";
import axios from "axios";
import { LOGIN } from "../../../Api/Api";
import { AuthContext } from "../../../Context/AuthContext.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Error from "../../Components/Auth/Error.js";
import { useContext } from "react";



export default function Login() {
  //hooks
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  //token context
  const  token  = useContext(AuthContext);
  console.log(token);
  //to use navigation
  const navigate = useNavigate();

  //functions
  function handleChanges(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });//to change the value of the input
  }
  //to handle the login
  async function handleLogin(e) {
    e.preventDefault();//to prevent the default behavior of the form
    setLoading(true);//to show the loading spinner
    setError("");
    try {
      
      const loginResponse = await axios.post(LOGIN, formData,
      {headers: {Authorization: `Bearer `}});//to send the data to the server
      const serverToken = loginResponse.data.token;//to get the token from the server
      token.setToken(serverToken);//to set the token in the context
      navigate("/dashboard", { replace: true });//to navigate to the dashboard
    } catch (err) {
      console.log("Login Error:", err);
      setError("Failed to log in");
    }
    setLoading(false);
  }
  return (
    <div className="body">
      <div className="container">
        <div className="form-container">
          <div className="login-form form-splitter">
              <form className="form-group" onSubmit={handleLogin}>
                <img className="logo" src={Logo} alt="logo" />
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter email"
                    label="Email"
                    value= {formData.email}
                    icon={faUser}
                    onChange={handleChanges}
                  />
                
                  <Input
                    type="password"
                    id="password"
                    placeholder="Password"
                    name="password"
                    label="password"
                    value= {formData.password}
                    icon={faLock}
                    onChange={handleChanges}
                  />
                
                <button type="submit" className="btn">
                  Submit
                </button>
                {error && <Error />}
              </form>

              <div className="form-images">
                <img className="bright-background"
                  src={brightBackGround}
                  alt="login"
                />
                <h3>Empowering learners<br/>
                   of today to become <br/>the leaders of <br/>tomorrow</h3>
                <img className="student-background"
                  src={studentBackGround}
                  alt="login"
                />
              </div>
            </div>
          </div>
        </div>
      
    </div>
  );
};