import React from 'react';
import gerry from   '../assets/gerry.svg';

const EngineerAvatar = props =>{
    const style = {width:'100px',height:'100px',borderRadius:'50px',position:'relative',float:'right'
    ,right:'10px',bottom:'40px',...props.style};
    return(
        
       <img src={gerry} alt="Avatar del responsable del servicio" style={style} />
    )
}

export default EngineerAvatar;