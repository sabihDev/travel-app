import React from "react";
import moment from "moment/moment"
import { FaHeart, FaLocationDot  } from "react-icons/fa6";

const TravelStoryCard = ({
    imgUrl,
    title,
    story,
    date,
    visitedLocation,
    isFavorite,
    onFavoriteClick,
    onEdit,
    onClick,
}) => {
    return (
        <div className="border max-w-sm rounded-lg overflow-hidden hover:shadow-lg hover:shadow-slate-200 bg-white m-4 transition-all ease-in-out relative cursor-pointer">
            <img
                className="w-full h-56 object-cover"
                src={
                    imgUrl
                        ? imgUrl
                        : "https://media.slidesgo.com/storage/25666487/planning-my-trip1664874934.jpg"
                }
                alt={title}
            />

            <button className="w-12 h-12 flex items-center justify-center bg-white/40 rounded-lg border border-white/30 absolute top-4 right-4" onClick={onFavoriteClick}>
                <FaHeart className={`icon-btn ${isFavorite ? "text-red-500" : "text-white"}`}/>
            </button>

            <div className="p-4" onClick={onClick}>
                <div className="flex item-center gap-3">
                    <div className="flex-1">
                        <h6 className="text-sm font-medium">{title}</h6>
                        <span className="text-xs text-slate-600">
                            {date ? moment(date).format("DD MMM YYYY") : "-"}
                        </span>
                    </div>
                </div>

                <p className="text-xs text-slate-600 mt-2">{story?.slice(0, 60)}</p>

                <div className="inline-flex items-center gap-2 text-[13px] text-cyan-600 bg-cyan-200/40 rounded mt-3 px-2 py-1 border border-cyan-600">
                    <FaLocationDot  className="text-sm" />
                    {visitedLocation.map((location, index) => (
                        <span key={index}>{location}</span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TravelStoryCard;
