import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import TravelStoryCard from '../../components/Cards/TravelStoryCard';

const Home = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [allStories, setAllStories] = useState([]);

  // Get information of logged-in user
  const getUserInfo = async () => {
    try {
      console.log("Fetching user info..."); // Debugging
      const response = await axiosInstance.get('/api/user/get-user');

      if (response.data?.user) {
        setUserInfo(response.data.user);
        console.log("User info set:", response.data.user);
      }
    } catch (error) {
      if (error.response?.status === 400) {
        localStorage.clear();
        navigate('/login');
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

  }

  // Function to view story
  const viewTravelStory = (data) => {

  }

  // Function to toggle favorite/unfavorite story
  const updateIsFavorite = async (story) => {
    try {
      // Optimistically update the UI
      console.log(story.isFavorite);
      

      // API call to update favorite status
      const response = await axiosInstance.put(`/api/travel-story/update-favorite/${story._id}`, {
        isFavorite: !story.isFavorite,
      });



      if (response.data.story) {
        getAllTravelStories();
      }

      console.log(story.isFavorite);

    } catch (error) {
      console.error("Error updating favorite status:", error?.response?.data || error);
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
            {
              allStories.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {
                    allStories.map((item) => {
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
                    })
                  }
                </div>
              ) : (
                <>You have not created any story.</>
              )
            }
          </div>
          <div className="w-[320px]"></div>
        </div>
      </div>
    </>
  );
};

export default Home;
