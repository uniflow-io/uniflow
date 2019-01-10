import React from 'react'
import {pathTo} from "../../../routes";
import {Link} from "react-router-dom";

export default () => (
    <div className="content-wrapper">
        <section className="content-header">
            <h1>
                Article
                <small>Control panel</small>
            </h1>
            <ol className="breadcrumb">
                <li><Link to={pathTo('home')}><i className="fa fa-dashboard"/> Home</Link></li>
                <li><Link to={pathTo('blog')}>Blog</Link></li>
                <li className="active">Article</li>
            </ol>
        </section>

        <section className="content">
            <div className="row">
                <div className="col-md-12">

                </div>
            </div>
        </section>
    </div>

)
