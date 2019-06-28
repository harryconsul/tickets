import React from 'react';
import NewTicketFlow from './NewTicketFlow';
import MenuBar from '../components/MenuBar';


const User = props => {

    const [marginCal, updateMargin] = React.useState({ ref: React.createRef(), margin: null });
    React.useEffect(() => {
        if (!marginCal.margin) {
            const style = window.getComputedStyle(marginCal.ref.current.children[0]);
            
            const margin = Number(style.height.replace("px",""));
            updateMargin({ref:marginCal.ref,margin:margin+"px"})
        }
    },[marginCal.ref,marginCal.margin])

    return (
        <div>

            <MenuBar barRef={marginCal.ref} isManager={false}/>
            <div style={{ marginTop: marginCal.margin?marginCal.margin:"0px" }}>
                <NewTicketFlow />
            </div>



        </div>

    )

};


export default User;
