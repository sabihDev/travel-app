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
import EmptyCard from "../../components/Cards/EmptyCard";
import { DayPicker } from "react-day-picker";
import moment from "moment";
import FilterInfoTitle from "../../components/Cards/FilterInfoTitle";
import { getEmptyCardMessage } from "../../utils/helper";

const Home = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [allStories, setAllStories] = useState([]);

  const [filterType, setFilterType] = useState("");

  const [dateRange, setDateRange] = useState({ from: null, to: null });

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [openViewModal, setOpenViewModal] = useState({
    isShown: false,
    data: null,
  });

  const [searchQuery, setSearchQuery] = useState("");

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
  const handleEdit = (data) => {
    setOpenAddEditModal({
      isShown: true,
      type: "edit",
      data,
    });
  };

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
        if(filterType === "search" && searchQuery){
          onSearchStory(searchQuery);
        }
        else if(filterType === "date"){
          filterStoriesByDate(dateRange);
        }
        else{
        getAllTravelStories();
        }
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

  // Delete Travel Story
  const deleteTravelStory = async (story) => {
    if (!story || !story._id) {
      toast.error("Invalid story data. Unable to delete.");
      return;
    }

    const storyId = story._id;

    try {
      const response = await axiosInstance.delete(
        `/api/travel-story/delete/${storyId}`
      );

      if (response.data.message === "Travel story deleted successfully") {
        toast.error("Story deleted successfully");
        setOpenViewModal((prevState) => ({ ...prevState, isShown: false }));
        getAllTravelStories(); // Ensure the latest stories are fetched
      }
    } catch (error) {
      toast.error(
        "An error occurred while deleting the story. Please try again."
      );
    }
  };

  // Search Travel Story
  const onSearchStory = async (query) => {
    try {
      const response = await axiosInstance.get(`/api/travel-story/search`, {
        params: {
          query,
        },
      });

      if (response.data.stories) {
        setFilterType("search");
        setAllStories(response.data.stories);
      }
    } catch (error) {
      console.log(
        "An error occurred while deleting the story. Please try again."
      );
    }
  };

  // Handle Clear Search
  const handleClearSearch = async () => {
    setFilterType("");
    getAllTravelStories();
  };

  // Filter Stories By Date
  const filterStoriesByDate = async (day) => {
    try {
      const startDate = day.from ? moment(day.from).valueOf() : null;
      const endDate = day.to ? moment(day.to).valueOf() : null;

      if (startDate && endDate) {
        const response = await axiosInstance.get(
          `/api/travel-story/filter/date`,
          {
            params: {
              startDate,
              endDate,
            },
          }
        );

        if (response.data.stories) {
          setFilterType("date");
          setAllStories(response.data.stories);
        }
      }
    } catch (error) {
      console.log("An error occurred while filtering stories by date.");
    }
  };

  // Handle Day Click
  const handleDayClick = async (day) => {
    setDateRange(day);
    filterStoriesByDate(day);
  };

  // Reset Filter
  const resetFilter = () => {
    setDateRange({ from: null, to: null });
    setFilterType("");
    getAllTravelStories();
  };

  useEffect(() => {
    getUserInfo();
    getAllTravelStories();
  }, []); // Runs only on mount

  // Debugging: Log when `allStories` updates
  useEffect(() => {
    console.log("Updated allStories:");
  }, [allStories]);

  return (
    <>
      <Navbar
        userInfo={userInfo}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchNote={onSearchStory}
        handleClearSearch={handleClearSearch}
      />
      <div className="container mx-auto py-10">
        <FilterInfoTitle
          filterType={filterType}
          filterDates={dateRange}
          onClear={() => {
            resetFilter();
          }}
        />

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
              <EmptyCard
                message={getEmptyCardMessage(filterType)}
                imgSrc={filterType}
              />
            )}
          </div>
          <div className="w-[340px]">
            <div className="bg-white border border-slate-200 rounded-lg shadow-lg shadow-slate-200/60">
              <div className="p-3">
                <DayPicker
                  captionLayout="dropdown-buttons"
                  mode="range"
                  selected={dateRange}
                  onSelect={handleDayClick}
                  pagedNavigation
                />
              </div>
            </div>
          </div>
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
      {openViewModal.isShown && (
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
            onEditClick={() => {
              setOpenViewModal((prevState) => ({
                ...prevState,
                isShown: false,
              }));
              handleEdit(openViewModal.data || null);
            }}
            onDeleteClick={() => {
              deleteTravelStory(openViewModal.data || null);
            }}
            onClose={() => {
              setOpenViewModal((prevState) => ({
                ...prevState,
                isShown: false,
              }));
            }}
          />
        </Modal>
      )}

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
