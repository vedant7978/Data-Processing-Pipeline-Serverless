import { useRef } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import RegistrationForm from "../components/Registrationform";
import RegistrationModal from "../components/Registrationmodal";
import LoginForm from "../components/Loginform";

function LoginPage() {
  const parentModalRef = useRef(null);
  const navigate = useNavigate(); // Initialize useNavigate

  return (
    <>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col lg:flex-row w-3/4">
          <div className="text-center lg:text-left grow">
            <h1 className="text-5xl font-bold">Quick Data Processor</h1>
            <p className="py-6">Welcome to Quick Data Processor</p>

       
            <button
              className="btn btn-primary mt-4"
              onClick={() => {
                navigate("/dataprocessing"); 
              }}
            >
              Want to convert JSON to CSV?
            </button>
          </div>
          <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
            <LoginForm />
          </div>

          <RegistrationModal parentModalRef={parentModalRef}>
            <RegistrationForm parentModalRef={parentModalRef} />
          </RegistrationModal>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
