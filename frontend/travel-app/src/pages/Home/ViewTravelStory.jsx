import moment from "moment";
import React from "react";
import { FaLocationDot } from "react-icons/fa6";
import { MdAdd, MdClose, MdDeleteOutline, MdUpdate } from "react-icons/md";

const ViewTravelStory = ({storyInfo, onClose, onEditClick, onDeleteClick}) => {
  return (
    <div className="relative">

      <div className="flex items-center justify-end">

        <div>

          <div className="flex items-center gap-3  p-2 rounded-l-lg">
            <button className="btn-small" onClick={onEditClick}>
              <MdUpdate className="text-lg" /> UPDATE STORY
            </button>

            <button className="btn-small btn-delete" onClick={onDeleteClick}>
              <MdDeleteOutline className="text-lg" /> DELETE
            </button>

            <button onClick={onClose}>
              <MdClose className="text-xl text-slate-400" />
            </button>
          </div>

        </div>

      </div>

      <div>
        <div className="flex flex-col flex-1 gap-2 py-4">
            <h1 className="text-2xl text-slate-950">
                {storyInfo && storyInfo.title}
            </h1>

            <div className="flex justify-between items-center gap-3">
                <span className="text-xs text-slate-500">
                    {storyInfo && moment(storyInfo.visitedDate).format("DD MMM YYYY")}
                </span>

                <div className="inline-flex items-center gap-2 text-[13px] text-cyan-600 bg-cyan-200/40 rounded px-2 py-2 border border-cyan-600">
                    <FaLocationDot className="text-sm"/>
                    {storyInfo && storyInfo.visitedLocation.map((location, index) => storyInfo.visitedLocation.length == index + 1 ? location : location + ", ")}
                </div>
            </div>
        </div>

        <img src={storyInfo && storyInfo.imageUrl} alt="Selected" className="w-full h-[300px] object-cover rounded" />

        <div className="mt-4">
            <p className="text-sm text-slate-950 leading-6 text-justify whitespace-pre-line">{storyInfo.story}</p>
        </div>
      </div>
    
    </div>
  );
};

export default ViewTravelStory;
