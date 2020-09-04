import React from 'react';
import {Typography } from '@material-ui/core';
import fallBack from '../assets/persona.png';

const EngineerAvatar = props =>{
    const style = {width:'100px',height:'100px',borderRadius:'50px',...props.style};
    return(
       <div style={{position:'relative',float:'right'
       ,right:'10px',bottom:'40px',width:'100px',display:'flex',flexDirection:"column"}}>
             
             <img src={props.photo===""?fallBack:props.photo} alt="Avatar del responsable del servicio" style={style} />
           
            
           
                <Typography variant={"caption"} style={{textAlign:"center"}}>
                    <i>
                    {props.isManager?props.userFullName + " - " + props.department
                     : "Recibimos su solicitud, nos pondremos en contacto para atenderte."
                    }
                    </i>
                </Typography>
                
            
       </div>
       
    )
}

export default EngineerAvatar;