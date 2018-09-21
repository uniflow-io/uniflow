import React, {Component} from 'react'
import {pathTo} from "../../routes";
import {Link} from "react-router-dom";

class Home extends Component {

    render() {
        return (
            <div id="home" className="content-wrapper">
                <section className="content-header">
                    <h1>
                        Home
                        <small>Control panel</small>
                    </h1>
                    <ol className="breadcrumb">
                        <li><Link to={pathTo('home')}><i className="fa fa-dashboard"/> Home</Link></li>
                    </ol>
                </section>
            </div>
        )
    }

}

export default Home
