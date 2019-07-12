import React from 'react';
import {configure,shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import MenuBar from './MenuBar';
import SearchField from './searchfield/SearchField'
configure({adapter:new Adapter()});
describe("Menu Bar- <MenuBar />",()=>{
    let wrapper;
    beforeEach(()=>{
        wrapper=shallow(<MenuBar />);
    });
    it("must show the search bar if the user is manager",()=>{
        wrapper.setProps({isManager:true});
        expect(wrapper.find(SearchField)).toHaveLength(1);
        wrapper.setProps({isManager:false});
        expect(wrapper.find(SearchField)).toHaveLength(0);
 
    });
    


});

