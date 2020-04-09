import {useContext, useEffect, useMemo, useRef, useState} from "react";
import {gql, useMutation} from '@apollo/client';
import {Image, Video, Transformation, CloudinaryContext as _CloudinaryContext} from 'cloudinary-react';
import * as React from 'react';

const CloudinaryWidgetContext = React.createContext(null);

export const CloudinaryContext = ({children}) => {
    const [widget, setWidget] = useState(null);
    const callbacks = useRef([]);

    const setCallback = useMemo(() => {
        return (f) => callbacks.current = f;
    }, []);

    useEffect(() => {
        let timeout = null;
        const checkForCloudinary = () => {
            if (typeof window === 'undefined') return;
            if (typeof window.cloudinary === 'undefined') {
                timeout = setTimeout(checkForCloudinary, 500);
                return;
            }
            setWidget(
                window.cloudinary.createUploadWidget({
                        cloudName: process.env.NEXT_CLOUDINARY_CLOUD_NAME,
                        uploadPreset: process.env.NEXT_CLOUDINARY_PRESET
                    }, (error, result) => {
                        if (!error && result && result.event === "success") {
                            let id = result.info.public_id;
                            callbacks.current(id);
                        }
                    }
                )
            )
        };
        checkForCloudinary();
        return () => {
            if (timeout) clearTimeout(timeout);
        }
    }, [callbacks]);

    return <>
        <script src="https://widget.cloudinary.com/v2.0/global/all.js" type="text/javascript"/>
        <CloudinaryWidgetContext.Provider value={{widget, setCallback}}>
            <_CloudinaryContext cloudName={process.env.NEXT_CLOUDINARY_CLOUD_NAME}>
                {children}
            </_CloudinaryContext>
        </CloudinaryWidgetContext.Provider>
    </>
};

const useCloudinaryWidget = () => {
    const {widget, setCallback} = useContext(CloudinaryWidgetContext);
    return {widget, setCallback};
};

export const Upload = ({children, onUpload}) => {
    const {widget, setCallback} = useCloudinaryWidget();

    const onClick = () => {
        setCallback(onUpload);
        if(widget) widget.open();
    };

    return <div>
        <button onClick={onClick}>
            {children}
        </button>
    </div>;
};
