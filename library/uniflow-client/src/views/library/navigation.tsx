import React, { useState } from 'react';
import { Link } from 'gatsby';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { pathTo } from '../../routes';

export interface Card {
  name: string
  description: string
  fields: {
    slug: string
    catalogs: string[]
  }
}

export interface NavigationProps {
  library: Card[]
  slug?: string
}

function Navigation(props: NavigationProps) {
  const [search, setSearch] = useState<string>('')
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true)

  const onSearch: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setSearch( event.target.value );
  };

  const onToggle: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    setIsCollapsed(!isCollapsed);
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
  };

  const itemPathTo = (card: Card) => {
    return pathTo('card', { slug: card.fields.slug });
  };

  const isActive = (card: Card, slug?: string) => {
    return card.fields.slug === slug ? 'active' : undefined;
  };

  const filterNav = (library: Card[], search: string) => {
    return library.reduce((cardList: Card[], card) => {
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

  const { library, slug } = props;

  return (
    <div className="sidebar">
      <form
        className="sidebar-search d-flex align-items-center"
        role="search"
        onSubmit={onSubmit}
      >
        <div className="input-group">
          <input
            type="search"
            className="form-control ds-input"
            placeholder="Search..."
            aria-label="Search for..."
            value={search}
            onChange={onSearch}
          />
        </div>
        <button
          className="btn d-sm-none p-0 ml-3 isCollapsedd"
          type="button"
          onClick={onToggle}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
      </form>
      <nav className={`sidebar-nav${isCollapsed ? ' d-none d-sm-block' : ''}`}>
        <div className="sidebar-section">
          <ul className="sidebar-items">
            {filterNav(library, search).map((card, cardIndex) => (
              <li className={isActive(card, slug)} key={`card-${cardIndex}`}>
                <span className="link">
                  {card.name}{' '}
                  {card.fields.catalogs.map((catalog, j) => (
                    <span key={j} className="badge badge-light mr-1">
                      {catalog}
                    </span>
                  ))}
                </span>
                <span>{card.description}</span>
                <Link to={itemPathTo(card)}>{card.name}</Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default Navigation;
