import React from 'react';
import { pathTo } from '../../routes';
import { Link } from 'gatsby';
import { faTag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC } from 'react';

export interface TagsProps {
  tags: {[key: string]: number}
}

const Tags: FC<TagsProps> = ({ tags }) => {
  const orderedTags = Object.keys(tags).sort((tag1: string, tag2: string): number => {
    return tags[tag2] - tags[tag1];
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
