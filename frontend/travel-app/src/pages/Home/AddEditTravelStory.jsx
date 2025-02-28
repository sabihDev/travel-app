import React, { useState } from "react";
import { MdAdd, MdClose, MdDeleteOutline, MdUpdate } from "react-icons/md";
import DateSelector from "../../components/Input/DateSelector";
import ImageSelector from "../../components/ImageSelector";
import TagInput from "../../components/Input/TagInput";
import moment from "moment";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-toastify";
import uploadImage  from "../../utils/uploadImage";

const AddEditTravelStory = ({
  storyInfo,
  type,
  onClose,
  getAllTravelStories,
}) => {
  const [visitedDate, setVisitedDate] = useState(null);
  const [visitedLocation, setVisitedLocation] = useState([]);
  const [story, setStory] = useState("");
  const [title, setTitle] = useState("");
  const [storyImage, setStoryImage] = useState(null);

  const [error, setError] = useState("");

  // Add story
  const addTravelStory = async () => {
    try {
      let imageUrl = "";

      // Upload image
      if (storyImage) {
        const imageUploadResponse = await uploadImage(storyImage);
        imageUrl = imageUploadResponse.imageUrl || "";
      }

      // Add story
      const response = await axiosInstance.post("/api/travel-story/add", {
        title,
        visitedDate: visitedDate
          ? moment(visitedDate).valueOf()
          : moment().valueOf(),
        visitedLocation,
        story,
        imageUrl: imageUrl || "",
      });

      if(response.data && response.data.story){
        toast.success("Story added successfully");

        // Get all stories
        getAllTravelStories();
        onClose();
      }
    } catch (error) {}
  };

  // edit story
  const editTravelStory = async () => {};

  const handleAddOrUpdate = () => {
    console.log("Story data", {
      title,
      visitedDate,
      visitedLocation,
      story,
      storyImage,
    });

    if (!title) {
      setError("Title is required");
      return;
    }
    if (!story) {
      setError("story is required");
      return;
    }

    setError("");

    if (type === "add") {
      // Add new story
      addTravelStory();
    } else {
      // Update story
      editTravelStory();
    }
  };

  const handleDeleteStoryImg = async () => {
    setStoryImage(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <h5 className="text-xl font-medium text-slate-700">
          {type === "add" ? "Add" : "Edit"} Travel Story
        </h5>

        <div>
          <div className="flex items-center gap-3  p-2 rounded-l-lg">
            {type === "add" ? (
              <button className="btn-small" onClick={handleAddOrUpdate}>
                <MdAdd className="text-lg" /> Add Story
              </button>
            ) : (
              <>
                <button className="btn-small" onClick={handleAddOrUpdate}>
                  <MdUpdate className="text-lg" /> Update Story
                </button>
              </>
            )}
            <button onClick={onClose}>
              <MdClose className="text-xl text-slate-400" />
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-xs pt-2 text-right">{error}</p>
          )}
        </div>
      </div>

      <div>
        <div className="flex flex-1 flex-col gap-2 pt-4">
          <label className="input-label">TITLE</label>
          <input
            type="text"
            className="text-2xl text-slate-950 outline-none"
            placeholder="A day at great wall"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />

          <div className="my-3">
            <DateSelector date={visitedDate} setDate={setVisitedDate} />
          </div>

          <ImageSelector
            image={storyImage}
            setImage={setStoryImage}
            handleDeleteImage={handleDeleteStoryImg}
          />

          <div className="flex flex-col gap-2 mt-4">
            <label className="input-label">STORY</label>
            <textarea
              type="text"
              className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
              placeholder="Your Story"
              rows={10}
              value={story}
              onChange={(e) => {
                setStory(e.target.value);
              }}
            />
          </div>

          <div className="pt-3">
            <label className="input-label"> VISITED LOCATIONS </label>
            <TagInput tags={visitedLocation} setTags={setVisitedLocation} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditTravelStory;
