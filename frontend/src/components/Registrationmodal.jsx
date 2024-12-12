import { Toaster } from "react-hot-toast";
const RegistrationModal = (props) => {
  return (
    <>
      <dialog
        ref={props.parentModalRef}
        id="RegistrationModal"
        className="modal"
      >
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          {props.children}
        </div>
        <Toaster />
      </dialog>
    </>
  );
};

export default RegistrationModal;
