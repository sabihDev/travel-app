import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";

import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

import TravelStoryCard from "../../components/Cards/TravelStoryCard";
import { MdAdd } from "react-icons/md";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Modal from "react-modal";
import AddEditTravelStory from "./AddEditTravelStory";
import ViewTravelStory from "./ViewTravelStory";

const Home = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [allStories, setAllStories] = useState([]);

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [openViewModal, setOpenViewModal] = useState({
    isShown: false,
    data: null,
  });

  // Get information of logged-in user
  const getUserInfo = async () => {
    try {
      console.log("Fetching user info..."); // Debugging
      const response = await axiosInstance.get("/api/user/get-user");

      if (response.data?.user) {
        setUserInfo(response.data.user);
        console.log("User info set:", response.data.user);
      }
    } catch (error) {
      if (error.response?.status === 400) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  // Get all travel stories API function
  const getAllTravelStories = async () => {
    try {
      console.log("Fetching all travel stories...");
      const response = await axiosInstance.get("/api/travel-story/getall");

      if (response.data?.stories) {
        setAllStories(response.data.stories);
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again");
    }
  };

  // Function to edit story
  const handleEdit = (data) => {};

  // Function to view story
  const viewTravelStory = (data) => {
    setOpenViewModal({
      isShown: true,
      data,
    });
  };

  // Function to toggle favorite/unfavorite story
  const updateIsFavorite = async (story) => {
    try {
      // Optimistically update the UI
      console.log(story.isFavorite);

      // API call to update favorite status
      const response = await axiosInstance.put(
        `/api/travel-story/update-favorite/${story._id}`,
        {
          isFavorite: !story.isFavorite,
        }
      );

      if (response.data.story) {
        toast.success("Favorite status updated successfully");
        getAllTravelStories();
      }

      console.log(story.isFavorite);
    } catch (error) {
      console.error(
        "Error updating favorite status:",
        error?.response?.data || error
      );
      // Revert UI change if API call fails
      setAllStories((prevStories) =>
        prevStories.map((s) =>
          s._id === story._id ? { ...s, isFavorite: story.isFavorite } : s
        )
      );
    }
  };

  useEffect(() => {
    getUserInfo();
    getAllTravelStories();
  }, []); // Runs only on mount

  // Debugging: Log when `allStories` updates
  useEffect(() => {
    console.log("Updated allStories:", allStories);
  }, [allStories]);

  return (
    <>
      <Navbar userInfo={userInfo} />
      <div className="container mx-auto py-10">
        <div className="flex gap-7">
          <div className="flex-1">
            {allStories.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {allStories.map((item) => {
                  return (
                    <TravelStoryCard
                      key={item._id}
                      imgUrl={item.imageUrl}
                      title={item.title}
                      story={item.story}
                      date={item.visitedDate}
                      visitedLocation={item.visitedLocation}
                      isFavorite={item.isFavorite}
                      onEdit={() => handleEdit(item)}
                      onClick={() => viewTravelStory(item)}
                      onFavoriteClick={() => updateIsFavorite(item)}
                    />
                  );
                })}
              </div>
            ) : (
              <>You have not created any story.</>
            )}
          </div>
          <div className="w-[320px]"></div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            background: "rgba(0,0,0,0.2)",
            zIndex: 999,
          },
        }}
        appElement={document.getElementById("root")}
        className="modal-box"
      >
        <AddEditTravelStory
          storyInfo={openAddEditModal.data}
          type={openAddEditModal.type}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
          }}
          getAllTravelStories={getAllTravelStories}
        />
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={openViewModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            background: "rgba(0,0,0,0.2)",
            zIndex: 999,
          },
        }}
        appElement={document.getElementById("root")}
        className="modal-box"
      >
        <ViewTravelStory
          storyInfo={openViewModal.data || null}
          onEditClick={()=>{}}
          onDeleteClick={()=>{}}
          onClose={() =>{
            setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
          }}
        />
      </Modal>

      <button
        className="w-16 h-16 flex items-center justify-center bg-primary hover:bg-cyan-400 rounded-full fixed right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModal({
            isShown: true,
            type: "add",
            data: null,
          });
        }}
      >
        <MdAdd className="text-white text-[32px]" />
      </button>

      <ToastContainer />
    </>
  );
};

export default Home;
