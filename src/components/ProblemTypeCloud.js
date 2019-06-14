import React from 'react';

import Chip from '@material-ui/core/Chip';

const ProblemTypeCloud=props=>{
    return(
        props.problems.map(problem=><Chip color={"secondary"} key={problem.id} label={problem.label} onClick={()=>props.onClick(problem.id)}
        style={{margin:'5px'}}   clickable /> )

    );

}

export default ProblemTypeCloud;

