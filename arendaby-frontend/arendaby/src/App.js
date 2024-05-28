import Navbar from "./components/navbar/navbar.jsx";
import HeaderInfo from "./components/header/header.jsx";
import Ideas from "./components/body-ideas/ideas.jsx";
import './App.css';
import React, {Fragment, Component} from "react";
import axios from "axios"

class App extends Component {
    state = {details: [],}

    componentDidMount() {
        let data;
        axios.get('http://localhost:8000')
            .then(res => {
                data = res.data;
                this.setState({
                    details: data
                });
            })
            .catch(err => {
                console.log(err)
            })
    }

    render() {
        return (
            <Fragment>
                <Navbar/>
                <HeaderInfo/>
                <Ideas/>
            </Fragment>
        );
    }
}

export default App;
