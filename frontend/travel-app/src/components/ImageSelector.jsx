import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { FaRegFileImage } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

const ImageSelector = ({ image, setImage, handleDeleteImage }) => {
    const inputRef = useRef();
    const [previewURL, setPreviewURL] = useState(image);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(file);
        }
    };

    const onChooseFile = () => {
        inputRef.current.click();
    };

    const handleRemoveImage = () => {
        setImage(null);
        handleDeleteImage();
    };

    useEffect(() => {

        // if image is a prop string, set it as previewURL
        if (typeof image === 'string') {
            setPreviewURL(image);
        }
        else if (image) {
            setPreviewURL(URL.createObjectURL(image));
        }
        else {
            setPreviewURL(null);
        }

        return () => { 
            if (previewURL && typeof previewURL !== 'string' && !image) {
                URL.revokeObjectURL(previewURL);
            }
        }
    }, [image]);

    return (
        <div>
            <input
                type="file"
                accept="image/*"
                ref={inputRef}
                onChange={handleImageChange}
                className="hidden"
            />

            {!image ? (
                <button
                    className="w-full h-[220px] flex flex-col items-center justify-center gap-4 bg-slate-50 rounded border border-slate-200/50"
                    onClick={onChooseFile}
                >
                    <div className="w-14 h-14 flex items-center justify-center rounded-full bg-cyan-100 border border-cyan-300">
                        <FaRegFileImage className="text-xl text-cyan-500" />
                    </div>
                    <p className="text-sm text-slate-500">Browse image files to upload</p>
                </button>
            ) : (
                <div className="w-full relative">
                    <img src={previewURL} alt="Selected image" className="w-full h-[300px] object-cover rounded-lg" />

                    <button className="btn-small btn-delete absolute top-2 right-2" onClick={handleRemoveImage}>
                        <MdDeleteOutline className="text-lg" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default ImageSelector;
