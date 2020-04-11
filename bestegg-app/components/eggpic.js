import * as React from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import {Modal} from "./modal";

export const EggPic = ({className, picId, width}) => {
    return <Modal
        placeholder={() => <img
            className={className || ''}
            src={`https://res.cloudinary.com/do8cebkqd/image/upload/c_thumb,w_${width || 200},g_face/v1586394745/${picId}.jpg`}
        />}
        style={{height: '80%', left: '10%', width: '80%', top: '10%'}}
    >{({close}) => {
        return <div className='h-full w-full pt-2'><AutoSizer>{({width, height}) => {
            return <div style={{width: `${width}px`, height: `${height}px`}}><img
                className='mx-auto block'
                src={`https://res.cloudinary.com/do8cebkqd/image/upload/c_thumb,w_${width},h_${height},c_fit/v1586394745/${picId}.jpg`}
            /></div>
        }}</AutoSizer></div>
    }}</Modal>
};
