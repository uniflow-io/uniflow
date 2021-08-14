import React, { Component } from 'react';
import { Link } from 'gatsby';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { pathTo } from '../../routes';

class Navigation extends Component {
  state = {
    search: '',
    collapse: true,
  };

  onSearch = (event) => {
    this.setState({ search: event.target.value });
  };

  onToggle = (event) => {
    this.setState({ collapse: !this.state.collapse });
  };

  onSubmit = (event) => {
    event.preventDefault();
  };

  itemPathTo = (card) => {
    return pathTo('card', { slug: card.fields.slug });
  };

  isActive = (card, slug) => {
    return card.fields.slug === slug ? 'active' : null;
  };

  filterNav = (library, search) => {
    return library.reduce((cardList, card) => {
      let words = card.name;
      words += ' ' + card.description;
      for (let i = 0; i < card.fields.catalogs.length; i++) {
        words += ' ' + card.fields.catalogs[i];
      }
      words = words.toLowerCase();

      if (words.indexOf(search) !== -1) {
        cardList.push(card);
      }

      return cardList;
    }, []);
  };

  render() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'library' does not exist on type 'Readonl... Remove this comment to see the full error message
    const { library, slug } = this.props;

    return (
      <div className="sidebar">
        <form
          className="sidebar-search d-flex align-items-center"
          role="search"
          onSubmit={this.onSubmit}
        >
          <div className="input-group">
            <input
              type="search"
              className="form-control ds-input"
              placeholder="Search..."
              aria-label="Search for..."
              value={this.state.search}
              onChange={this.onSearch}
            />
          </div>
          <button
            className="btn d-sm-none p-0 ml-3 collapsed"
            type="button"
            onClick={this.onToggle}
          >
            <FontAwesomeIcon icon={faBars} />
          </button>
        </form>
        <nav className={`sidebar-nav${this.state.collapse ? ' d-none d-sm-block' : ''}`}>
          <div className="sidebar-section">
            <ul className="sidebar-items">
              {this.filterNav(library, this.state.search).map((card, cardIndex) => (
                <li className={this.isActive(card, slug)} key={`card-${cardIndex}`}>
                  <span className="link">
                    {card.name}{' '}
                    {card.fields.catalogs.map((catalog, j) => (
                      <span key={j} className="badge badge-light mr-1">
                        {catalog}
                      </span>
                    ))}
                  </span>
                  <span>{card.description}</span>
                  <Link to={this.itemPathTo(card)}>{card.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    );
  }
}

export default Navigation;
