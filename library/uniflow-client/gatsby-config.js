const projectPath = './';
const docsPath = '../../docs';
const activeEnv = process.env.GATSBY_ACTIVE_ENV || process.env.NODE_ENV || 'development';
console.log(`Using environment config: '${activeEnv}'`);

require('dotenv').config({
  path: `.env.${activeEnv}`,
});

module.exports = {
  siteMetadata: {
    title: `Uniflow`,
    siteUrl: `https://uniflow.io`,
    description: `Unified Workflow Automation Tool`,
    twitter: `@uniflow_io`,
  },
  mapping: {
    'Mdx.frontmatter.author': 'ContributorsYaml.name',
  },
  plugins: [
    {
      resolve: `gatsby-plugin-typescript`,
      options: {
        isTSX: true,
        jsxPragma: `jsx`,
        allExtensions: true,
      },
    },
    `gatsby-plugin-sass`,
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-plugin-gtag`,
      options: {
        trackingId: process.env.GATSBY_TRACKING_ID,
        head: true,
        anonymize: false,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Uniflow`,
        short_name: `Uniflow`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#007bff`,
        display: `minimal-ui`,
        icon: `src/assets/images/logo.png`,
      },
    },
    //`gatsby-plugin-offline`, // @todo to need fix front cache html headers before adding it
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        serialize: ({ site, allSitePage }) =>
          allSitePage.edges.map((edge) => {
            if (edge.node.path === '/') {
              return {
                url: site.siteMetadata.siteUrl,
                changefreq: `daily`,
                priority: 1,
              };
            }

            return {
              url: site.siteMetadata.siteUrl + edge.node.path,
              changefreq: `monthly`,
              priority: 0.7,
            };
          }),
      },
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `{
                  site {
                    siteMetadata {
                      title
                      description
                      siteUrl
                    }
                  }
                  logo: file(
                    sourceInstanceName: { eq: "images" }
                    relativePath: { eq: "logo.png" }
                  ) {
                    publicURL
                  }
                }`,
        feeds: [
          {
            title: `Uniflow Blog`,
            query: `{
                      articles: allMdx(
                        filter: {fields: {sourceName: {eq: "blog"}}},
                        sort: {fields: frontmatter___date, order: DESC}
                      ) {
                        nodes {
                          id
                          excerpt
                          html
                          fields {
                            slug
                          }
                          frontmatter {
                            title
                            tags
                            author {
                              name
                            }
                            coverSeo {
                              publicURL
                              internal {
                                mediaType
                              }
                              size
                            }
                            tags
                            date
                          }
                        }
                      }
                    }`,
            output: `/blog/rss.xml`,
            link: 'https://feeds.feedburner.com/uniflow-io/blog',
            setup: ({
              query: {
                site: { siteMetadata },
                logo,
              },
            }) => {
              return {
                title: siteMetadata.title,
                description: siteMetadata.description,
                feed_url: siteMetadata.siteUrl + `/blog/rss.xml`,
                site_url: siteMetadata.siteUrl,
                image_url: siteMetadata.siteUrl + logo.publicURL,
                generator: `Uniflow`,
              };
            },
            serialize: ({
              query: {
                site: { siteMetadata },
                articles,
              },
            }) => {
              return articles.nodes.map((node) => {
                return {
                  title: node.frontmatter.title,
                  description: node.excerpt,
                  url: `${siteMetadata.siteUrl}/blog/${node.fields.slug}`,
                  guid: `${siteMetadata.siteUrl}/blog/${node.fields.slug}`,
                  custom_elements: [
                    {
                      'content:encoded': node.html,
                    },
                  ],
                  categories: node.frontmatter.tags,
                  author: node.frontmatter.author.name,
                  date: node.frontmatter.date,
                  enclosure: {
                    url: siteMetadata.siteUrl + node.frontmatter.coverSeo.publicURL,
                    size: node.frontmatter.coverSeo.size,
                    type: node.frontmatter.coverSeo.internal.mediaType,
                  },
                };
              });
            },
          },
        ],
      },
    },
    `gatsby-transformer-yaml`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-mdx`,
      options: {
        extensions: [`.mdx`, `.md`],
        gatsbyRemarkPlugins: [`gatsby-remark-images`, `gatsby-remark-static-images`],
        plugins: [`gatsby-remark-images`, `gatsby-remark-static-images`], // https://github.com/gatsbyjs/gatsby/issues/15486#issuecomment-510153237
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${projectPath}/src/assets/images`,
        name: 'images',
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${docsPath}/changelog.yaml`,
        name: 'changelog',
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${docsPath}/docs.yaml`,
        name: 'doc',
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${docsPath}/docs`,
        name: 'doc',
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${docsPath}/contributors`,
        name: 'contributors',
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${docsPath}/blog`,
        name: 'blog',
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${docsPath}/newsletters`,
        name: 'newsletters',
      },
    },
  ],
};
