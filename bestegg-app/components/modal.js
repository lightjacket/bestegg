import {default as React, useState} from "react";

export const Modal = ({placeholder, children, style}) => {
    const [open, setOpen] = useState(false);
    const C = placeholder;

    return <>
        <button className='z-40' onClick={() => setOpen(!open)}><C/></button>
        {!open ? null : <div className='fixed top-0 left-0 w-full h-full z-50'>
            <div className='opacity-50 bg-black w-full h-full' onClick={() => setOpen(false)}/>
            <div className='absolute opacity-100 bg-white p-2 w-1/2 rounded flex flex-col'
                 style={{left: '25%', top: '15%', ...(style || {})}}>
                <div className='h-4 text-right'>
                    <button onClick={() => setOpen(false)}>
                        <i className='fas fa-times'/>
                    </button>
                </div>
                <div className='flex-grow'>
                    {children({close: () => setOpen(false)})}
                </div>
            </div>
        </div>}
    </>;
};
