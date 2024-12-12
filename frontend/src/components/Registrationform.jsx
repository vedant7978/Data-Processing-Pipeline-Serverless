import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const RegistrationForm = ({ parentModalRef }) => {
  const [formData, setFormData] = useState({
    name: "",
    emailId: "",
    password: "",
    confirmPassword: "",
    securityQuestion1: "",
    securityQuestion2: "",
    answer1: "",
    answer2: "",
    mathAnswer: "", 
    role: "Customer", 
  });

  const [securityQuestions] = useState([
    "What is your favorite color?",
    "What was the name of your first pet?",
    "What is your mother's maiden name?",
    "What city were you born in?",
    "What is the name of your favorite book?",
    "What is your favorite food?",
  ]);

  const [mathQuestion, setMathQuestion] = useState("");
  const [mathAnswer, setMathAnswer] = useState(null);

  const [formErrorMessage, setFormErrorMessage] = useState({
    emailIdError: "",
    passwordError: "",
    confirmPasswordError: "",
    mathError: "",
    questionError: "",
  });

  const [formValidity, setFormValidity] = useState({
    emailIdField: false,
    passwordField: false,
    confirmPasswordField: false,
    mathField: false, // State to track math validation
    questionField: false, // State for question selection validation
  });

  useEffect(() => {
    generateMathQuestion();
  }, []);

  const generateMathQuestion = () => {
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    const operation = Math.random() > 0.5 ? "+" : "-";
    setMathQuestion(`What is ${num1} ${operation} ${num2}?`);
    setMathAnswer(operation === "+" ? num1 + num2 : num1 - num2);
  };

  const validateField = (fieldName, value) => {
    let error = "";
    const emailRegex = /^[A-Za-z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;

    if (fieldName === "emailId") {
      if (!emailRegex.test(value)) {
        error = "Please enter a valid email id.";
        setFormValidity((prev) => ({ ...prev, emailIdField: false }));
      } else {
        setFormValidity((prev) => ({ ...prev, emailIdField: true }));
      }
      setFormErrorMessage((prev) => ({ ...prev, emailIdError: error }));
    }

    if (fieldName === "password") {
      if (!passwordRegex.test(value)) {
        error =
          "Password must have at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.";
        setFormValidity((prev) => ({
          ...prev,
          passwordField: false,
          confirmPasswordField: false,
        }));
      } else {
        setFormValidity((prev) => ({ ...prev, passwordField: true }));
      }
      setFormErrorMessage((prev) => ({ ...prev, passwordError: error }));
    }

    if (fieldName === "confirmPassword") {
      if (value !== formData.password) {
        error = "Your Password does not match.";
        setFormValidity((prev) => ({ ...prev, confirmPasswordField: false }));
      } else {
        setFormValidity((prev) => ({ ...prev, confirmPasswordField: true }));
      }
      setFormErrorMessage((prev) => ({ ...prev, confirmPasswordError: error }));
    }

    // Validate math answer
    if (fieldName === "mathAnswer") {
      if (parseInt(value) !== mathAnswer) {
        error = "Incorrect answer to the math question.";
        setFormValidity((prev) => ({ ...prev, mathField: false }));
      } else {
        setFormValidity((prev) => ({ ...prev, mathField: true }));
      }
      setFormErrorMessage((prev) => ({ ...prev, mathError: error }));
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => {
      const updatedFormData = { ...prevData, [name]: value };
      validateField(name, value);
      return updatedFormData;
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const { emailIdField, passwordField, confirmPasswordField, mathField } =
      formValidity;

    if (
      !formData.name ||
      !formData.emailId ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.securityQuestion1 ||
      !formData.answer1
    ) {
      toast.error("Field cannot be empty.");
      return;
    }

    if (formData.securityQuestion1 === formData.securityQuestion2) {
      setFormErrorMessage((prev) => ({
        ...prev,
        questionError: "Please select two different security questions.",
      }));
      setFormValidity((prev) => ({ ...prev, questionField: false }));
      return;
    } else {
      setFormErrorMessage((prev) => ({ ...prev, questionError: "" }));
      setFormValidity((prev) => ({ ...prev, questionField: true }));
    }

    if (emailIdField && passwordField && confirmPasswordField && mathField) {
      const baseUrl = process.env.REACT_APP_API_URL;
      const apiUrl = `${baseUrl}/dev/auth/register`;
    
      axios
        .post(apiUrl, formData)
        .then((response) => {
          const parsedBody = JSON.parse(response.data.body);
          if (response.data.statusCode === 201) {
            toast.success(parsedBody.message);
            const apiUrlSns = `https://c71c3c65hh.execute-api.us-east-1.amazonaws.com/dev/sns/CreateTopic`;
            axios
              .post(apiUrlSns, { email: formData.emailId })
              .then(() => {
                toast.success("SNS Topic created successfully.");
                parentModalRef.current.close();
              })
              .catch((error) => {
                console.error("Error creating SNS Topic:", error);
              });
    
          } else {
            toast.error(parsedBody.message);
          }
        })
        .catch((error) => {
          console.error("Error making POST request:", error);
        });
    }    
  };

  return (
    <form className="card-body" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-4 text-center">Registration</h2>

      <div className="mb-4">
        <label className="label" htmlFor="name">
          <span className="label-text text-md font-bold">Name</span>
        </label>
        <input
          type="text"
          className="input input-bordered w-full"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-4">
        <label className="label" htmlFor="emailId">
          <span className="label-text text-md font-bold">Email Id</span>
        </label>
        <input
          type="text"
          className={`input input-bordered w-full ${formData.emailId && !formValidity.emailIdField ? "border-red-500" : formValidity.emailIdField ? "border-green-500" : ""}`}
          name="emailId"
          value={formData.emailId}
          onChange={handleChange}
          required
        />
        {formData.emailId && (
          <div
            className={`mt-2 text-xs ${formValidity.emailIdField ? "text-green-500" : "text-red-500"}`}
          >
            {formValidity.emailIdField
              ? "Email-id format correct ✓"
              : formErrorMessage.emailIdError}
          </div>
        )}
      </div>

      <div className="mb-4">
        <label className="label" htmlFor="password">
          <span className="label-text text-md font-bold">Password</span>
        </label>
        <input
          type="password"
          className={`input input-bordered w-full ${formData.password && !formValidity.passwordField ? "border-red-500" : formValidity.passwordField ? "border-green-500" : ""}`}
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        {formData.password && (
          <div
            className={`mt-2 text-xs ${formValidity.passwordField ? "text-green-500" : "text-red-500"}`}
          >
            {formValidity.passwordField
              ? "Password strength is good ✓"
              : formErrorMessage.passwordError}
          </div>
        )}
      </div>

      <div className="mb-4">
        <label className="label" htmlFor="confirmPassword">
          <span className="label-text text-md font-bold">Confirm Password</span>
        </label>
        <input
          type="password"
          className={`input input-bordered w-full ${formData.confirmPassword && !formValidity.confirmPasswordField ? "border-red-500" : formValidity.confirmPasswordField ? "border-green-500" : ""}`}
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        {formData.confirmPassword && (
          <div
            className={`mt-2 text-xs ${formValidity.confirmPasswordField ? "text-green-500" : "text-red-500"}`}
          >
            {formValidity.confirmPasswordField
              ? "Passwords match ✓"
              : formErrorMessage.confirmPasswordError}
          </div>
        )}
      </div>

      <div className="mb-4">
        <label className="label" htmlFor="role">
          <span className="label-text text-md font-bold">Role</span>
        </label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="input input-bordered w-full"
        >
          <option value="Customer">Customer</option>
          <option value="Admin">Admin</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="label" htmlFor="securityQuestion1">
          <span className="label-text text-md font-bold">
            Security Question 1
          </span>
        </label>
        <select
          name="securityQuestion1"
          value={formData.securityQuestion1}
          onChange={handleChange}
          className="input input-bordered w-full"
          required
        >
          <option value="">Select a question</option>
          {securityQuestions.map((question, index) => (
            <option key={index} value={question}>
              {question}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="label" htmlFor="answer1">
          <span className="label-text text-md font-bold">Answer 1</span>
        </label>
        <input
          type="text"
          className="input input-bordered w-full"
          name="answer1"
          value={formData.answer1}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-4">
        <label className="label" htmlFor="securityQuestion2">
          <span className="label-text text-md font-bold">
            Security Question 2
          </span>
        </label>
        <select
          name="securityQuestion2"
          value={formData.securityQuestion2}
          onChange={handleChange}
          className="input input-bordered w-full"
          required
        >
          <option value="">Select a question</option>
          {securityQuestions
            .filter((question) => question !== formData.securityQuestion1) 
            .map((question, index) => (
              <option key={index} value={question}>
                {question}
              </option>
            ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="label" htmlFor="answer2">
          <span className="label-text text-md font-bold">Answer 2</span>
        </label>
        <input
          type="text"
          className="input input-bordered w-full"
          name="answer2"
          value={formData.answer2}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-4">
        <label className="label" htmlFor="mathAnswer">
          <span className="label-text text-md font-bold">{mathQuestion}</span>
        </label>
        <input
          type="number"
          className={`input input-bordered w-full ${formData.mathAnswer && !formValidity.mathField ? "border-red-500" : formValidity.mathField ? "border-green-500" : ""}`}
          name="mathAnswer"
          value={formData.mathAnswer}
          onChange={handleChange}
          required
        />
        {formData.mathAnswer && (
          <div
            className={`mt-2 text-xs ${formValidity.mathField ? "text-green-500" : "text-red-500"}`}
          >
            {formValidity.mathField
              ? "Math answer correct ✓"
              : formErrorMessage.mathError}
          </div>
        )}
      </div>

      {formErrorMessage.questionError && (
        <div className="text-red-500 text-xs mb-4">
          {formErrorMessage.questionError}
        </div>
      )}

      <button type="submit" className="btn btn-primary w-full">
        Register
      </button>
      <Toaster />
    </form>
  );
};

export default RegistrationForm;
