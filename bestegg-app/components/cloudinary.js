import {useContext, useEffect, useMemo, useRef, useState} from "react";
import {gql, useMutation} from '@apollo/client';
import {Image, Video, Transformation, CloudinaryContext as _CloudinaryContext} from 'cloudinary-react';
import * as React from 'react';

const CloudinaryWidgetContext = React.createContext(null);

export const CloudinaryContext = ({children}) => {
    const [widget, setWidget] = useState(null);
    const callbacks = useRef([]);

    const [addCallback, removeCallback] = useMemo(() => {
        return [
            (f) => callbacks.current = [f, ...callbacks.current],
            (f) => callbacks.current = callbacks.current.filter(c => c !== f)
        ]
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
                            callbacks.current.forEach(c => c(id));
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
        <CloudinaryWidgetContext.Provider value={{widget, addCallback, removeCallback}}>
            <_CloudinaryContext cloudName={process.env.NEXT_CLOUDINARY_CLOUD_NAME}>
                {children}
            </_CloudinaryContext>
        </CloudinaryWidgetContext.Provider>
    </>
};

const useCloudinaryWidget = () => {
    const {widget, addCallback, removeCallback} = useContext(CloudinaryWidgetContext);
    return {widget, addCallback, removeCallback};
};

export const Upload = ({children, onUpload}) => {
    const {widget, addCallback, removeCallback} = useCloudinaryWidget();

    useEffect(() => {
        addCallback(onUpload);
        return () => removeCallback(onUpload);
    }, [addCallback, removeCallback, onUpload]);

    return <div>
        <button onClick={() => widget && widget.open()}>
            {children}
        </button>
    </div>;
};
