import { useRef, useEffect } from 'react';

const AlertModal = ({ isOpen, onClose, onConfirm, message }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div
          ref={modalRef}
          tabIndex={-1}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none"
        >
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="relative w-auto max-w-md mx-auto my-6">
            <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
              <div className="relative flex items-start justify-between p-5 border-b border-solid border-gray-200 rounded-t">
                <h3 className="text-lg font-semibold">{message}</h3>
                <button
                  className="p-1 ml-auto bg-transparent border-0 text-black float-right text-2xl leading-none font-semibold outline-none focus:outline-none"
                  onClick={onClose}
                >
                  <span className="bg-transparent text-black h-6 w-6 text-2xl block outline-none focus:outline-none">×</span>
                </button>
              </div>
              <div className="relative p-6 flex-auto">
                <div className="flex justify-end">
                  <button
                    onClick={onConfirm}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={onClose}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded ml-2"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AlertModal;
