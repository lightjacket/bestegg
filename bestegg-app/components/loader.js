import {DotLoader} from 'react-spinners';

// "#aaffaa"
export const Loader = () => {
    return <div className='m-2'><DotLoader size={70} margin={2} color='#aaffaa'/></div>;
};

export const SmallLoader = () => {
    return <div className='m-2'><DotLoader size={25} margin={2} color='#aaffaa'/></div>;
};
