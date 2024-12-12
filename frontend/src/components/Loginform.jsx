import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom"; 
import { useAuth } from "../context/AuthContext";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [mathAnswer, setMathAnswer] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [mathQuestion, setMathQuestion] = useState(generateMathQuestion());
  const [securityQuestion, setSecurityQuestion] = useState(""); 
  const [correctSecurityAnswer, setCorrectSecurityAnswer] = useState(""); 
  const navigate = useNavigate(); 
  const { setUserLoggedIn } = useAuth(); 

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleSecurityAnswerChange = (e) => setSecurityAnswer(e.target.value);
  const handleMathAnswerChange = (e) => setMathAnswer(e.target.value);

  function generateMathQuestion() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operator = Math.random() > 0.5 ? "+" : "-";
    return { num1, num2, operator };
  }

  const validateMathAnswer = () => {
    const { num1, num2, operator } = mathQuestion;
    const correctAnswer = operator === "+" ? num1 + num2 : num1 - num2;
    return parseInt(mathAnswer) === correctAnswer;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const baseUrl = process.env.REACT_APP_API_URL;

    if (currentStep === 1) {
      const apiUrl = `${baseUrl}/dev/auth/getSecurityQuestions`;
      const formData = { email, password };
      try {
        const response = await axios.post(apiUrl, formData, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        const parsedBody = response.data.body;
        console.log("pas", parsedBody);
        if (response.data.statusCode === 200) {
          toast.success("Correct Username and Password");
          localStorage.setItem('userEmail',email );

          setSecurityQuestion(parsedBody.securityQuestion);
          setCorrectSecurityAnswer(parsedBody.answer); 
          setCurrentStep(2);
        } else {
          toast.error("Incorrect Username or Password");
        }
      } catch (error) {
        console.error("Error making POST request:", error);
      }
    } else if (currentStep === 2) {
      if (securityAnswer === correctSecurityAnswer) {
        setCurrentStep(3);
        toast.success("Security answer verified!");
      } else {
        toast.error("Incorrect security answer. Please try again.");
      }
    } else if (currentStep === 3) {
      if (validateMathAnswer()) {
        const apiUrl = `${baseUrl}/dev/auth/login`; 
        try {
          const response = await axios.post(apiUrl, { email, password });
          
          const { token, username, role } = response.data.body;
          if (token) {
            localStorage.removeItem("processedFiles");
            setUserLoggedIn(token);
            await triggerLoginCountCloudFunction(email);
            localStorage.setItem("name", username);
            localStorage.setItem("role", role);
            // localStorage.setItem("token", token);
            console.log("dsfsdf",setUserLoggedIn)
            console.log("token",token)
            toast.success("Login successful!");
            navigate("/home"); 
          } else {
            toast.error("Login failed. No token returned.");
          }
        } catch (error) {
          if (error.response) {
            console.error("Error response:", error.response.data);
            toast.error(error.response.data.message || "Login failed. Please try again.");
          } else if (error.request) {
            console.error("Error request:", error.request);
            toast.error("No response from the server. Please try again later.");
          } else {
            console.error("Error message:", error.message);
            toast.error("An error occurred. Please try again.");
          }
        }
      } else {
        console.error("Math answer is incorrect");
        toast.error("Math answer is incorrect");
      }
    }
  };

  const triggerLoginCountCloudFunction = async (email) => {
    const cloudFunctionUrl = "https://us-central1-serverless-440117.cloudfunctions.net/UserLoginCount";
    try {
      const response = await axios.post(
        cloudFunctionUrl,
        { email }, // The body of the request
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Cloud Function triggered successfully:", response.data);
    } catch (error) {
      console.error("Error triggering Cloud Function:", error);
      toast.error("An error occurred while updating the login count.");
    }
  };

  return (
    <div className="card-body max-w-md mx-auto p-6 bg-base-200 rounded-lg shadow-md">
      <Toaster />
      <div className="steps w-full mb-6">
        <div
          className={`step ${currentStep > 1 ? "step-primary" : ""} ${currentStep === 1 ? "step-primary" : ""}`}
        >
          <span className="text-sm">Email & Password</span>
        </div>
        <div
          className={`step ${currentStep > 2 ? "step-primary" : ""} ${currentStep === 2 ? "step-primary" : ""}`}
        >
          <span className="text-sm">Security Question</span>
        </div>
        <div
          className={`step ${currentStep > 3 ? "step-primary" : ""} ${currentStep === 3 ? "step-primary" : ""}`}
        >
          <span className="text-sm">Math Question</span>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        {currentStep === 1 && (
          <>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text text-md font-bold">Email</span>
              </label>
              <input
                type="email"
                placeholder="email"
                className="input input-bordered"
                required
                value={email}
                onChange={handleEmailChange}
              />
            </div>
            <div className="form-control mb-6">
              <label className="label">
                <span className="label-text text-md font-bold">Password</span>
              </label>
              <input
                type="password"
                placeholder="password"
                className="input input-bordered"
                required
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary w-full">
                Next
              </button>
            </div>
          </>
        )}

        {currentStep === 2 && (
          <>
            <div className="form-control mb-6">
              <label className="label">
                <span className="label-text text-md font-bold">{securityQuestion}</span>
              </label>
              <input
                type="text"
                placeholder="Your answer"
                className="input input-bordered"
                required
                value={securityAnswer}
                onChange={handleSecurityAnswerChange}
              />
            </div>
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary w-full">
                Next
              </button>
            </div>
          </>
        )}

        {currentStep === 3 && (
          <>
            <div className="form-control mb-6">
              <label className="label">
                <span className="label-text text-md font-bold">Math Question</span>
              </label>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-semibold">
                  {mathQuestion.num1} {mathQuestion.operator} {mathQuestion.num2} =
                </span>
                <input
                  type="number"
                  placeholder="Answer"
                  className="input input-bordered"
                  required
                  value={mathAnswer}
                  onChange={handleMathAnswerChange}
                />
              </div>
            </div>
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary w-full">
                Login
              </button>
            </div>
          </>
        )}
      </form>
      <button
        onClick={() => document.getElementById("RegistrationModal").showModal()}
      >
        Register
      </button>
    </div>
  );
};

export default LoginForm;
