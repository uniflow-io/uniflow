import React from 'react';
import { pathTo } from '../../routes';
import { Link } from 'gatsby';
import { faTag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Tags = ({ tags }) => {
  const orderedTags = Object.keys(tags).sort((tag1, tag2) => {
    return tags[tag1] > tags[tag2];
  });

  return (
    <section className="section container-fluid">
      <h3>All tags</h3>
      <div className="row">
        <div className="col-sm-6 offset-sm-3">
          <p>{orderedTags.length} tags</p>
          <p>
            {orderedTags.map((tag) => (
              <Link to={pathTo('tag', { tag: tag })} key={tag} className="btn btn-primary mr-2">
                <FontAwesomeIcon icon={faTag} /> {tag} ({tags[tag]})
              </Link>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Tags;
