import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useOutletContext } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { addRequests, removeRequest } from "../utils/requestSlice";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.requests);
  const { darkMode } = useOutletContext();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });
      dispatch(addRequests(res.data.pendingRequests));
    } catch (err) {
      console.error("Error in requests " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const requestReceived = async (status, _id) => {
    try {
      await axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(_id));
    } catch (err) {
      console.log("Error in requestReceived part: " + err.message);
    }
  };

  if (isLoading) {
    return (
      <div
        className={`flex flex-col items-center justify-center h-[80vh] text-center px-4 transition-all duration-300 ${
          darkMode ? "bg-gray-800 text-white" : ""
        }`}
      >
        <img
          src="https://cdn.pixabay.com/animation/2022/10/11/03/16/03-16-39-160_512.gif"
          alt="Loading requests..."
          className="w-24 h-24 mb-6"
        />
        <h2 className="text-2xl font-semibold animate-pulse">
          Checking for requests...
        </h2>
      </div>
    );
  }

  if (!requests || requests.length === 0) {
    return (
      <div
        className={`flex flex-col items-center justify-center h-[75vh] text-center px-4 transition-colors duration-300 ${
          darkMode ? "bg-gray-800 text-white" : ""
        }`}
      >
        <img
          src="https://cdn.pixabay.com/animation/2024/03/05/02/16/02-16-28-55_512.gif"
          alt="No requests"
          className="w-64 h-64 mb-6"
        />
        <h1 className="text-3xl font-bold mb-2">You're All Caught Up!</h1>
        <p
          className={`max-w-md mb-6 ${
            darkMode ? "text-gray-300" : "text-gray-500"
          }`}
        >
          No connection requests at the moment. Come back later or explore new
          users to connect with.
        </p>
        <a
          href="/"
          className="btn btn-primary px-6 py-2 rounded-full text-white shadow-md transition hover:scale-105"
        >
          🔍 Explore Users
        </a>
      </div>
    );
  }

  return (
    <div
      className={`text-center my-10 px-4 transition-colors duration-300 ${
        darkMode ? "bg-gray-800 text-white" : "text-black"
      }`}
    >
      <h1 className={`font-bold text-2xl mb-6`}>Connection Requests</h1>
      <div className="flex flex-col gap-6">
        {requests.map((request) => {
          const {
            firstName,
            lastName,
            age,
            gender,
            about,
            photoURL,
            skills = [],
            _id,
            isVerified,
          } = request.fromUserId;

          return (
            <div
              key={_id}
              className={`flex flex-col md:flex-row items-center justify-between p-4 rounded-lg shadow-lg gap-4 md:gap-6 transition-colors duration-300 ${
                darkMode ? "bg-slate-700 text-white" : "bg-gray-100 text-black"
              }`}
            >
              {/* Profile Section */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start w-full md:w-3/4 gap-4">
                <img
                  src={photoURL || "https://via.placeholder.com/100"}
                  alt="profile"
                  onClick={() => {
                    navigate("/user/" + _id);
                    window.scrollTo(0, 0);
                  }}
                  className="w-20 h-20 rounded-full object-cover border border-gray-300 cursor-pointer"
                />
                <div className="space-y-1 text-center sm:text-left flex flex-col items-center sm:items-start w-full">

                  <h2 className="font-bold text-xl flex items-center gap-1">
                    {firstName + " " + lastName}
                    {isVerified && (
                      <img
                      src="verify.png"
                      alt="Verified Badge"
                      className="w-5 h-5 object-contain -ml-0.5 -mb-1"
                    />
                    )}
                  </h2>

                  {age && gender && (
                    <p className="text-gray-500 text-sm">{age + ", " + gender}</p>
                  )}

                  <p
                    className={`text-sm ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {about?.split(" ").length > 15
                      ? `${about.split(" ").slice(0, 15).join(" ")}... `
                      : about}
                    {about?.split(" ").length > 15 && (
                      <span
                        className="text-blue-500 cursor-pointer hover:underline ml-1"
                        onClick={() => {
                          navigate("/user/" + _id);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        know more
                      </span>
                    )}
                  </p>

                  {skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {skills.map((skill, index) => (
                        <span
                          key={index}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            darkMode
                              ? "bg-blue-600 text-white"
                              : "bg-white text-blue-600 border border-blue-300"
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 w-full md:w-auto justify-center md:justify-end">
                <button
                  className={`px-4 py-2 btn w-24 ${
                    darkMode ? "btn-success" : "btn-primary"
                  }`}
                  onClick={() => requestReceived("accepted", request._id)}
                >
                  Accept
                </button>
                <button
                  className={`px-4 py-2 btn w-24 ${
                    darkMode ? "btn-info" : "btn-secondary"
                  }`}
                  onClick={() => requestReceived("rejected", request._id)}
                >
                  Reject
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Requests;
