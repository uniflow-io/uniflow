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

  itemPathTo = (item) => {
    const slug = item.link.slice(6);
    return pathTo('doc', { slug: slug ? slug : null });
  };

  isActive = (item, slug) => {
    return item.link === `/docs${slug ? '/' + slug : ''}` ? 'active' : null;
  };

  filterNav = (nav, search) => {
    return nav.reduce((value, section) => {
      const items = section.items.filter((item) => {
        let words = item.title;
        words = words.toLowerCase();

        return words.indexOf(search) !== -1;
      });

      if (items.length > 0) {
        value.push({
          ...section,
          items: items,
        });
      }

      return value;
    }, []);
  };

  render() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'docNav' does not exist on type 'Readonly... Remove this comment to see the full error message
    const { docNav, slug } = this.props;

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
            {this.filterNav(docNav.nodes, this.state.search).map((section, sectionIndex) => (
              <React.Fragment key={`section-${sectionIndex}`}>
                <h4>{section.title}</h4>
                <ul className="sidebar-items">
                  {section.items.map((item, itemIndex) => (
                    <li
                      className={this.isActive(item, slug)}
                      key={`item-${sectionIndex}-${itemIndex}`}
                    >
                      <span className="link">{item.title}</span>
                      <Link to={this.itemPathTo(item)}>{item.title}</Link>
                    </li>
                  ))}
                </ul>
              </React.Fragment>
            ))}
          </div>
        </nav>
      </div>
    );
  }
}

export default Navigation;
