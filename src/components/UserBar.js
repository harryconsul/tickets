import React from 'react';
import { Avatar, Popover, Typography, Grid ,Button} from '@material-ui/core';
import Logout from 'mdi-material-ui/Logout';
import { connect } from 'react-redux';


class UserBar extends React.Component {
    state = {
        anchorEL: null,
    }
    handleClickOpen = (event) => {
        this.setState({ anchorEL: event.target });
    }
    handleClose = () => {
        this.setState({ anchorEL: null });
    }
    render() {
        const photo = this.props.user ? this.props.user.photo : "";
        const { anchorEL } = this.state;
        const open = Boolean(anchorEL);
        return (
            <div>
                <Avatar src={photo} onClick={this.handleClickOpen} style={{ cursor: "pointer" }} />


                <Popover anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    onClose={this.handleClose}
                    anchorEl={anchorEL}
                    open={open}
                    PaperProps={{
                        style: { padding: "25px" }
                    }}
                >
                    <Grid container direction={"column"} alignItems={"flex-start"} 
                      spacing={16}>
                        <Grid item md={2}>
                            <Avatar src={photo} />
                        </Grid>

                        <Grid>
                            <Typography variant={"h6"}>{this.props.user.name}</Typography>
                        </Grid>
                        <Grid>
                            <Typography variant={"subtitle1"}>{this.props.user.department}</Typography>
                        </Grid>
                        <Grid>
                            <Button variant={"contained"} color={"secondary"}
                             onClick={()=>this.props.user.logout()}
                             >
                                 Salir
                                 <Logout/>
                            </Button>
                        </Grid>


                    </Grid>




                </Popover>
            </div>

        )
    }

}
const mapStateToProps = state => {
    return {
        user: state.user,
    }
}
export default connect(mapStateToProps)(UserBar)