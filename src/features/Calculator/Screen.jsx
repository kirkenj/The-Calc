import { Textfit } from "react-textfit";

const Screen = ({children}) => {
    return (
        <Textfit className='screen' max={70} mode="single">{children}</Textfit>
    )
}

export default Screen