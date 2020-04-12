import {DotLoader} from 'react-spinners';

// "#aaffaa"
export const Loader = ({size}) => {
    return <img src='/loader-70.gif' width={size || 70} height={size || 70}/>
};

export const SmallLoader = () => {
    return <img src='/loader-25.gif'/>
};
