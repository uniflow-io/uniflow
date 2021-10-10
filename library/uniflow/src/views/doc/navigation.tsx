import React, { useState } from 'react';
import { Link } from 'gatsby';
import { pathTo } from '../../routes';
import { FC } from 'react';

interface NavigationItem {
  link: string;
  title: string;
}

interface NavigationItemGroup {
  title: string;
  items: NavigationItem[];
}

export interface NavigationProps {
  docNav: {
    nodes: NavigationItemGroup[];
  };
  slug: string;
}

const Navigation: FC<NavigationProps> = (props) => {
  const [search, setSearch] = useState<string>('');
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);

  const onSearch: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setSearch(event.target.value);
  };

  const onToggle: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    setIsCollapsed(!isCollapsed);
  };

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
  };

  const itemPathTo = (item: NavigationItem) => {
    const slug = item.link.slice(6);
    return pathTo('doc', { slug: slug ? slug : null });
  };

  const isActive = (item: NavigationItem, slug: string) => {
    return item.link === `/docs${slug ? '/' + slug : ''}` ? 'active' : undefined;
  };

  const filterNav = (nav: NavigationItemGroup[], search: string) => {
    return nav.reduce((value: NavigationItemGroup[], group) => {
      const items = group.items.filter((item) => {
        let words = item.title;
        words = words.toLowerCase();

        return words.indexOf(search) !== -1;
      });

      if (items.length > 0) {
        value.push({
          ...group,
          items: items,
        });
      }

      return value;
    }, []);
  };

  const { docNav, slug } = props;

  return (
    <div className="sidebar">
      <form className="sidebar-search d-flex align-items-center" role="search" onSubmit={onSubmit}>
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
          className="btn d-sm-none py-0 px-0 ms-3 isCollapsedd"
          type="button"
          onClick={onToggle}
        >
          {(isCollapsed && (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              className="bi bi-expand"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <title>Expand</title>
              <use xlinkHref="#nav-expand" />
            </svg>
          )) || (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              className="bi bi-expand"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <title>Collapse</title>
              <use xlinkHref="#nav-collapse" />
            </svg>
          )}
        </button>
      </form>
      <nav className={`sidebar-nav${isCollapsed ? ' d-none d-sm-block' : ''}`}>
        <div className="sidebar-section">
          {filterNav(docNav.nodes, search).map((section, sectionIndex) => (
            <React.Fragment key={`section-${sectionIndex}`}>
              <h4>{section.title}</h4>
              <ul className="sidebar-items">
                {section.items.map((item, itemIndex) => (
                  <li className={isActive(item, slug)} key={`item-${sectionIndex}-${itemIndex}`}>
                    <span className="link">{item.title}</span>
                    <Link to={itemPathTo(item)}>{item.title}</Link>
                  </li>
                ))}
              </ul>
            </React.Fragment>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Navigation;
