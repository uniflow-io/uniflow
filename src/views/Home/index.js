import React, {Component} from 'react'

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
                        <li><a href="#"><i className="fa fa-dashboard"/> Home</a></li>
                    </ol>
                </section>
            </div>
        )
    }

}

export default Home
