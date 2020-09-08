import React from "react";
import CategoryCard from "../components/CategoryCard/CategoryCard";
import { Grid, Link, Typography } from "@material-ui/core/";
import axios from 'axios';


class CategorySelection extends React.Component {
    state = {
        categories: [], current: ""
    }
    baseCategories = [];
    onCategoryClick = id => {
        const category = this.state.categories.find(item => item.id === id);
        const subcategories = category.subcategories ? [...category.subcategories] : [];

        if (subcategories.length > 0)
            this.setState({ categories: subcategories, current: category.label });
        else
            this.props.onComplete({ element: "problemType", object: category });

    }
    /*onClickLink = () => {
        this.setState({ categories: this.baseCategories, current: "" })
    }*/
    componentDidMount() {
        axios.post("obtienecategorias").then(response => {
            this.setState({ categories: response.data.Categorias });
            this.baseCategories = response.data.Categorias;
        });

    }
    render() {
        const styleBreadcum = { margin: '10px' }
        return (
            <Grid container >
                {/* <Grid item xs={12} style={{ display: 'inline-flex' }} >
                    <div style={styleBreadcum}> <Link variant={'h6'} style={{ cursor: "pointer" }} onClick={this.onClickLink}>Todas</Link> </div>
                    <div style={styleBreadcum}> <Typography variant={'h6'}> </Typography> </div>
                    <div style={styleBreadcum}>
                        {this.state.current === "" ? null : <Typography variant={'h6'}>{this.state.current}</Typography>}
                    </div>
                </Grid> */}
                {this.state.categories.map(category => {

                    const engineers = category.engineers.length ? category.engineers : (
                        category.subcategories ? category.subcategories.reduce((previous, current) => {
                            if (current.engineers.length >= 0) {
                                for (let i = 0; i < current.engineers.length; i++) {
                                    if (previous.lastIndexOf(current.engineers[i]) < 0)
                                        previous.push(current.engineers[i]);

                                }
                            }

                            return previous;
                        }, []) : []
                    )
                    return <Grid item xs={6} sm={6} md={3} key={category.id} ><CategoryCard {...category} engineers={engineers}
                        onClick={this.onCategoryClick} />

                    </Grid>
                })}
            </Grid>
        )
    }
}

export default CategorySelection;
