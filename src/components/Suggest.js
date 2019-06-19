import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Downshift from 'downshift';
import deburr from 'lodash.deburr';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';

const styles = theme => ({
    root: {
      flexGrow: 1,
    },
    container: {
      flexGrow: 1,
      position: 'relative',
    },
    paper: {
      position: 'absolute',
      zIndex: 1,
      marginTop: theme.spacing.unit,
      left: 0,
      right: 0,
    },
    chip: {
      margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
    },
    inputRoot: {
      flexWrap: 'wrap',
    },
    inputInput: {
      width: 'auto',
      flexGrow: 1,
    },
    divider: {
      height: theme.spacing.unit * 2,
    },
  });
  
  function renderSuggestion({ sugerencia, index, itemProps, highlightedIndex, selectedItem }){
    const isHighlighted = highlightedIndex === index;
    const isSelected = (selectedItem || '').indexOf(sugerencia.nombre) > -1;
  
    return (
      <MenuItem
        {...itemProps}
        key={sugerencia.value}
        selected={isHighlighted}
        component="div"
        style={{
          fontWeight: isSelected ? 500 : 400,
          fontSize:"0.8rem"
        }}
      >
        {sugerencia.nombre}
      </MenuItem>
    );
}

function renderInput (inputProps){
    const { InputProps, classes, ref, ...other } = inputProps;
    
    return (
      <TextField
        InputProps={{
          inputRef: ref,
          classes: {
            root: classes.inputRoot,
            input: classes.inputInput,
          },
          ...InputProps,style:{minHeight:"36px"}
        }}
        {...other}
        InputLabelProps={{children:inputProps.label,shrink:true}}
        fullWidth
      />
    );
}

renderSuggestion.propTypes = {
    highlightedIndex: PropTypes.number,
    index: PropTypes.number,
    itemProps: PropTypes.object,
    selectedItem: PropTypes.string,
    suggestion: PropTypes.shape({ medico: PropTypes.string }).isRequired,
};

class Suggest extends Component{
  constructor(){
    super();
  
    this.state={value:'',multipleValue:[]};

  }
  handleStateChange = changes => {
    
    if (changes.hasOwnProperty('selectedItem')) {
    

        this.setState({value: changes.selectedItem})
        this.props.handleSuggest(changes.selectedItem,true);
      

    } else if (changes.hasOwnProperty('inputValue')) {
      this.setState({value: changes.inputValue})
      this.props.handleSuggest(changes.inputValue,false);
    }
  }
  componentDidMount(){
    let _value=this.props.defaultValue;
    let _multipleValue = [];

    
    if(this.props.isMultiple){
      if(this.props.defaultValue!==""){
        _value = this.props.listaMedicos.reduce((previous,current)=>{
            if(previous.includes(current.nombre)){
              previous= previous.replace(current.nombre,"");
              _multipleValue.push(current.nombre);
            }
            return previous;

        },_value)
      }
      _value = _value.length>=2?_value.substring(0,_value.lastIndexOf(",")-1):"";

    }
    
  
    
    this.setState({value:_value,multipleValue:_multipleValue});
  }
  shouldComponentUpdate(nextProps,nextState){
    if(nextProps.listaMedicos.length!==this.props.listaMedicos.length
      || nextState.value!==this.state.value
      || nextState.multipleValue.length!==this.state.multipleValue.length
      )
        return true;
    else
        return false;

  }
    obtenerSugerencias = value => {
        const inputValue = deburr(value.trim()).toLowerCase();
        const inputLength = inputValue.length;
        let count = 0;

        return inputLength === 0
          ? (this.props.showOnEmpty?this.props.listaMedicos:[])
          : this.props.listaMedicos.filter(sugerencia => {
              const keep =
                count < 5 && sugerencia.nombre.slice(0, inputLength).toLowerCase() === inputValue;
      
              if (keep) {
                count += 1;
              }
      
              return keep;
        });
    }
    onChange=(selection)=>{
      
    }
    handleDelete=(item)=>{
      const _multipleValue = [...this.state.multipleValue];
      _multipleValue.splice(_multipleValue.indexOf(item),1);
      this.setState({multipleValue:_multipleValue});

    }
    handleInputChange = event => {
      this.setState({ value: event.target.value });
    };

    handleChange = item => {
      let { multipleValue } = this.state;
  
      if (multipleValue.indexOf(item) === -1) {
        multipleValue = [...multipleValue, item];
      }
  
      this.setState({
        value: '',
        multipleValue,
      });
    };
    
    onKeyUp=(event)=>{
      if(event.keyCode === 13){
      let _concat = this.state.multipleValue.reduce((previous,current)=>{
          previous = previous + "," + current;
          return previous;

       },"");
       
       _concat=event.target.value!==""?event.target.value +_concat:
          (_concat.length>0?_concat.substring(1):_concat);


        this.props.onKeyUp({keyCode:13,target:{value:_concat}});


    }
    else{
      const { value, multipleValue } = this.state;
      if (multipleValue.length && !value.length && event.key === 'Backspace') {
        this.setState({
          multipleValue: multipleValue.slice(0, multipleValue.length - 1),
        });
      }
    }
  }

    render(){
       

        const { classes } = this.props;
        
        

        return(
            <div className={classes.root}>{ this.props.isMultiple?
                <Downshift id="downshift-multiple" selectedItem={this.state.multipleValue} 
                onChange={this.handleChange} inputValue={this.state.value}>
                    {({
                    getInputProps,
                    getItemProps,
                    getMenuProps,
                    highlightedIndex,
                    inputValue:inputValue2,
                    isOpen,
                    selectedItem,
                    openMenu,
                    }) => (
                    <div className={classes.container}>{
                        renderInput(
                        {
                          fullWidth: true,
                          classes,
                          InputProps: getInputProps({
                            startAdornment: selectedItem.map(item => (
                              <Chip
                                key={item}
                                tabIndex={-1}
                                label={item}
                                
                                onDelete={()=>this.handleDelete(item)}
                              />
                            )),
                            onChange: this.handleInputChange,
                            onKeyUp: this.onKeyUp,
                            inputRef : this.props.inputRef,
                            onFocus:openMenu,
                          }),
                          
                        }
                        )
                        }
                        <div {...getMenuProps()}>
                        {isOpen ? (
                            <Paper className={classes.paper} square>
                            {this.obtenerSugerencias(inputValue2).map((sugerencia, index) =>
                                renderSuggestion({
                                sugerencia,
                                index,
                                itemProps: getItemProps({ item: sugerencia.nombre }),
                                highlightedIndex,
                                selectedItem,
                                }),
                            )}
                            </Paper>
                        ) : null}
                        </div>
                    </div>
                    )}
                </Downshift>:
                 <Downshift id="downshift-simple" 
                 onStateChange={this.handleStateChange} >
                     {({
                     getInputProps,
                     getItemProps,
                     getMenuProps,
                     highlightedIndex,
                     inputValue:inputValue2,
                     isOpen,
                     selectedItem,
                     }) => (
                     <div className={classes.container}>{
                         renderInput({
                           fullWidth: false,
                           classes,
                           InputProps: getInputProps({
                               //placeholder: 'Buscar...',
                               
                           }),label:this.props.label,
                         }
                         )
                         }
                         <div {...getMenuProps()}>
                         {isOpen ? (
                             <Paper className={classes.paper} square>
                             {this.obtenerSugerencias(inputValue2).map((sugerencia, index) =>
                                 renderSuggestion({
                                 sugerencia,
                                 index,
                                 itemProps: getItemProps({ item: sugerencia.nombre }),
                                 highlightedIndex,
                                 selectedItem,
                                 }),
                             )}
                             </Paper>
                         ) : null}
                         </div>
                     </div>
                     )}
                 </Downshift>}
            </div>
        );
    }

}

Suggest.defaultValue={
  showOnEmpty : false,
  isMultiple:false
}
Suggest.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Suggest);