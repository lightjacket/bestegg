import {DotLoader} from 'react-spinners';

// "#aaffaa"
export const Loader = ({size}) => {
    return <div className='m-2'><DotLoader size={size || 70} margin={2} color='#aaffaa'/></div>;
};

export const SmallLoader = () => {
    return <Loader size={25}/>;
};
