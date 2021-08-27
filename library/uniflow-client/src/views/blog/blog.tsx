import React from 'react';
import { StaticQuery, graphql } from 'gatsby';
import ArticleItem from './articleItem';
import { FC } from 'react';

export interface BlogProps {}

const Blog: FC<BlogProps> = () => (
  <>
    <section className="section container-fluid">
      <h3>Blog</h3>
      <StaticQuery
        query={graphql`
          query ArticlesQuery {
            allMdx(
              filter: { fields: { sourceName: { eq: "blog" } } }
              sort: { fields: frontmatter___date, order: DESC }
            ) {
              edges {
                node {
                  ...ArticleItemFragment
                }
              }
            }
          }
        `}
        render={(data) =>
          data.allMdx.edges.map((item: any, i: number) => (
            <div className="row mb-3" key={i}>
              <div className="col-md-6 offset-md-3">
                <ArticleItem article={item.node} />
              </div>
            </div>
          ))
        }
      />
    </section>
  </>
);

export default Blog;
