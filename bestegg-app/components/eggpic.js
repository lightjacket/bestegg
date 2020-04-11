import * as React from "react";

export const EggPic = ({className, picId, width}) => {
    return <img
        className={className || ''}
        src={`https://res.cloudinary.com/do8cebkqd/image/upload/c_thumb,w_${width || 200},g_face/v1586394745/${picId}.jpg`}
    />
};
