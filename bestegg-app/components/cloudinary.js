import {useEffect, useRef, useState} from "react";

export const Upload = () => {
    const [widget, setWidget] = useState(null);

    useEffect(() => {
        let timeout = null;
        const checkForCloudinary = () => {
            if (typeof window === 'undefined') return;
            if (typeof window.cloudinary === 'undefined') {
                timeout = setTimeout(checkForCloudinary, 500);
            }
            setWidget(
                window.cloudinary.createUploadWidget({
                        cloudName: process.env.NEXT_CLOUDINARY_CLOUD_NAME,
                        uploadPreset: process.env.NEXT_CLOUDINARY_PRESET
                    }, (error, result) => {
                        if (!error && result && result.event === "success") {
                            let id = result.info.public_id;
                        }
                    }
                )
            )
        };
        checkForCloudinary();
        return () => {
            if(timeout) clearTimeout(timeout);
        }
    }, []);

    return <div>
        <script src="https://widget.cloudinary.com/v2.0/global/all.js" type="text/javascript"/>
        <button onClick={() => widget && widget.open()}>Add egg pic</button>
    </div>;
};
