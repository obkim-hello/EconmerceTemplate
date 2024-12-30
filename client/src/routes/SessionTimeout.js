import React, { useEffect, useState, Fragment, useRef } from "react";
// import { Dialog, Transition } from "@headlessui/react";
// import { sessionService } from "redux-react-session";
// import globalStore from "../store/globalStore";
// import config from "../config";
// import { useNavigate } from "react-router-dom";

export default function SessionTimeout() {
  // const navigator = useNavigate();
  // const logInTime = globalStore.getState().session.user.login_time;
  // const timeoutTime = () => {
  //   if (
  //     !config.usertype.customer.includes(
  //       globalStore.getState().session.user.user_type
  //     )
  //   ) {
  //     return 21600000;
  //     // return 6000;
  //   } else {
  //     return 21600000 / 4;
  //     // return 6000;
  //   }
  // };
  // useEffect(() => {
  //   //if logInTime is not null and "", then check the timetamp and log out if it is more than 6 hours
  //   if (logInTime !== "" && logInTime !== null) {
  //     const currentTime = new Date().getTime();
  //     const timeDifference = currentTime - logInTime;
  //     if (timeDifference > timeoutTime()) {
  //       sessionService.deleteSession();
  //       sessionService.deleteUser();
  //       navigator("/");
  //     }
  //   } else if (logInTime === "") {
  //     // dispatch({ type: "SET_LOGIN_TIME", payload: new Date().getTime() });
  //   }
  // }, []);

  // const eventTypes = [
  //   "keypress",
  //   "mousemove",
  //   "mousedown",
  //   "scroll",
  //   "touchmove",
  //   "pointermove",
  // ];
  // const addEventListeners = (listener) => {
  //   eventTypes.forEach((type) => {
  //     window.addEventListener(type, listener, false);
  //   });
  // };
  // const removeEventListeners = (listener) => {
  //   if (listener) {
  //     eventTypes.forEach((type) => {
  //       window.removeEventListener(type, listener, false);
  //     });
  //   }
  // };
  // const [isWarningModalOpen, setWarningModalOpen] = useState(false);
  // useEffect(() => {
  //   const createTimeout1 = () =>
  //     setTimeout(() => {
  //       setWarningModalOpen(true);
  //     }, timeoutTime()); //in miliseconds  1 minute

  //   const createTimeout2 = () =>
  //     setTimeout(() => {
  //       // Implement a sign out function here
  //       sessionService.deleteSession();
  //       sessionService.deleteUser();
  //       navigator("/");
  //     }, 60000); //in miliseconds 1 minute

  //   const listener = () => {
  //     if (!isWarningModalOpen) {
  //       clearTimeout(timeout);
  //       timeout = createTimeout1();
  //     }
  //   };

  //   // Initialization
  //   let timeout = isWarningModalOpen ? createTimeout2() : createTimeout1();
  //   addEventListeners(listener);

  //   // Cleanup
  //   return () => {
  //     removeEventListeners(listener);
  //     clearTimeout(timeout);
  //   };
  // }, [isWarningModalOpen]);

  // const TimeoutWarningModal = ({ isOpen, onRequestClose }) => {
  //   const cancelButtonRef = useRef(null);
  //   const onLogOffCall = () => {
  //     // Implement your logout functionality here, e.g. clear the users login cache or hit your signout server
  //     // window.location.href = "https://vincentntang.com";

  //     sessionService.deleteSession();
  //     sessionService.deleteUser();
  //     navigator("/");
  //   };

  //   const modal = (
  //     <Transition.Root show={isOpen} as={Fragment}>
  //       <Dialog
  //         as="div"
  //         className="relative z-30"
  //         initialFocus={cancelButtonRef}
  //         onClose={onRequestClose}
  //       >
  //         <Transition.Child
  //           as={Fragment}
  //           enter="ease-out duration-300"
  //           enterFrom="opacity-0"
  //           enterTo="opacity-100"
  //           leave="ease-in duration-200"
  //           leaveFrom="opacity-100"
  //           leaveTo="opacity-0"
  //         >
  //           <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
  //         </Transition.Child>

  //         <div className="fixed z-100 inset-0 overflow-y-auto">
  //           <div className="flex items-center justify-center min-h-full p-4 text-center sm:p-0 ">
  //             <Transition.Child
  //               as={Fragment}
  //               enter="ease-out duration-300"
  //               enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
  //               enterTo="opacity-100 translate-y-0 sm:scale-100"
  //               leave="ease-in duration-200"
  //               leaveFrom="opacity-100 translate-y-0 sm:scale-100"
  //               leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
  //             >
  //               <Dialog.Panel className="relative bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-3xl w-full">
  //                 <div className="bg-white px-20 py-20 sm:pb-4 text-dsblue-90 ">
  //                   <div className="flex justify-center items-center gap-3">
  //                     <svg
  //                       xmlns="http://www.w3.org/2000/svg"
  //                       fill="none"
  //                       viewBox="0 0 24 24"
  //                       stroke-width="1.5"
  //                       stroke="currentColor"
  //                       class="w-24 h-24 pt-3"
  //                     >
  //                       <path
  //                         stroke-linecap="round"
  //                         stroke-linejoin="round"
  //                         stroke={"#DC143C"}
  //                         d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
  //                       />
  //                     </svg>

  //                     <div>
  //                       <p className="text-xl font-Gilroy-m text-red-400 text-left">
  //                         Your session is about to expire in 60s.
  //                       </p>
  //                       <p className="text-lg font-Gilroy-m text-red-400 text-left">
  //                         Do you want to extend your session?
  //                       </p>
  //                     </div>
  //                   </div>
  //                   <div className="flex justify-center py-10 gap-10 ">
  //                     <button
  //                       className="px-4 py-2 rounded-xl border text-lg hover:bg-red-500 hover:text-white"
  //                       onClick={onLogOffCall}
  //                     >
  //                       Log Off
  //                     </button>
  //                     <button
  //                       className="px-4 py-2 rounded-xl border text-lg bg-dsblue-100 text-white"
  //                       onClick={onRequestClose}
  //                     >
  //                       Stay
  //                     </button>
  //                   </div>
  //                 </div>
  //               </Dialog.Panel>
  //             </Transition.Child>
  //           </div>
  //         </div>
  //       </Dialog>
  //     </Transition.Root>
  //   );

  //   return (
  //     <div>
  //       {/* <div
  //         className=" absolute z-100 "
  //         isOpen={isOpen}
  //         contentLabel="Example div"
  //       >
  //         <h2>Session Timeout</h2>
  //         <div>
  //           You're being timed out due to inactivity. Please choose to stay
  //           signed in or to logoff. Otherwise, you will be logged off
  //           automatically
  //         </div>
  //         <br />
  //         <button onClick={onLogOffCall}>Log off</button>
  //         <button onClick={onRequestClose}>Stay Logged In</button>
  //       </div> */}
  //       {modal}
  //     </div>
  //   );
  // };

  return (
    <div>
      {/* {isWarningModalOpen && (
        <TimeoutWarningModal
          isOpen={isWarningModalOpen}
          onRequestClose={() => setWarningModalOpen(false)}
        />
      )} */}
    </div>
  );
}
