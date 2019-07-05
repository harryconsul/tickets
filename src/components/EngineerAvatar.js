import React from 'react';


const EngineerAvatar = props =>{
    const style = {width:'100px',height:'100px',borderRadius:'50px',position:'relative',float:'right'
    ,right:'10px',bottom:'40px',...props.style};
    return(
        
       <img src={props.photo} alt="Avatar del responsable del servicio" style={style} />
    )
}

export default EngineerAvatar;