const { createFilePath } = require(`gatsby-source-filesystem`);
const _ = require('lodash');
const fs = require('fs');
const localPackages = '../';
const activeEnv = process.env.GATSBY_ACTIVE_ENV || process.env.NODE_ENV || 'development';

console.log(`Using environment config: '${activeEnv}'`);

require('dotenv').config({
  path: `.env.${activeEnv}`,
});

exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  const isSSR = stage.includes(`html`);

  let config = {
    module: {
      rules: isSSR
        ? [
            {
              test: /brace/,
              use: loaders.null(),
            },
          ]
        : [],
    },
    resolve: {
      fallback: {
        vm: require.resolve('vm-browserify'),
      },
    },
  };

  if (activeEnv === 'production') {
    config.devtool = false;
  }

  actions.setWebpackConfig(config);
};

exports.sourceNodes = async ({ actions, createNodeId, createContentDigest }, { keywords }) => {
  const { createNode } = actions;

  fs.readdirSync(localPackages)
    .filter((file) => {
      return fs.existsSync(`${localPackages}/${file}/package.json`);
    })
    .forEach((file) => {
      const readme = fs.readFileSync(`${localPackages}/${file}/README.md`, 'utf8');
      const packageJson = JSON.parse(
        fs.readFileSync(`${localPackages}/${file}/package.json`, 'utf8')
      );
      const parentId = createNodeId(`card ${file}`);

      if (
        !packageJson.keywords ||
        !packageJson.keywords.reduce((hasCatalogList, keyword) => {
          return hasCatalogList || keyword.indexOf('uniflow-') === 0;
        }, false)
      ) {
        return;
      }

      const readmeNode = {
        id: createNodeId(`readme ${file}`),
        parent: parentId,
        children: [],
        internal: {
          type: `NPMLocalPackageReadme`,
          mediaType: `text/markdown`,
          content: readme,
        },
      };
      readmeNode.internal.contentDigest = createContentDigest(readmeNode);

      const node = Object.assign({}, packageJson, {
        id: parentId,
        parent: null,
        children: [],
        slug: packageJson.name,
        readme___NODE: readmeNode.id,
        title: packageJson.name,
        description: packageJson.description,
        internal: {
          type: `NPMLocalPackage`,
          content: readme,
        },
      });
      node.internal.contentDigest = createContentDigest(node);

      createNode(readmeNode);
      createNode(node);
    });
};

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `Mdx`) {
    const parent = getNode(node.parent);

    if (parent.internal.type === 'File') {
      const slug = createFilePath({ node, getNode, trailingSlash: false }).substr(1);
      createNodeField({
        node,
        name: `slug`,
        value: slug,
      });

      createNodeField({
        name: `sourceName`,
        node,
        value: parent.sourceInstanceName,
      });
    }
  } else if (node.internal.type === `ContributorsYaml`) {
    const slug = _.kebabCase(node.name);
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    });
  } else if (node.internal.type === `NPMPackage` || node.internal.type === `NPMLocalPackage`) {
    const slug = _.kebabCase(node.name);
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    });

    const catalogs = node.keywords.reduce((catalogList, keyword) => {
      if (keyword.indexOf('uniflow-') === 0) {
        catalogList.push(keyword.slice(8));
      }

      return catalogList;
    }, []);
    createNodeField({
      node,
      name: `catalogs`,
      value: catalogs,
    });
  }
};

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;

  const result = await graphql(`
    {
      articles: allMdx(
        filter: {fields: {sourceName: {eq: "blog"}}},
        sort: {fields: frontmatter___date, order: DESC}
      ) {
        nodes {
          id
          fields {
            slug
          }
          frontmatter {
            title
            tags
            author {
              fields {
                slug
              }
            }
          }
        }
      }
      docs: allMdx(
        filter: {fields: {sourceName: {eq: "doc"}}}
      ) {
        nodes {
          id
          fields {
            slug
          }
          frontmatter {
            title
          }
        }
      }
      docNav: allDocsYaml
      {
        nodes {
          title
          items {
            link
            title
          }
        }
      }
      newsletters: allMdx(
        filter: {fields: {sourceName: {eq: "newsletters"}}}
      ) {
        nodes {
          id
          fields {
            slug
          }
          frontmatter {
            title
          }
        }
      }
      ${
        /*library: allNpmPackage(filter: {keywords: {in: ["uniflow-client", "uniflow-flow"]}, deprecated: {eq: "false"}}) {
        nodes {
          fields {
            slug
          }
        }
      }*/ ''
      }
      localLibrary: allNpmLocalPackage(filter: {keywords: {in: ["uniflow-client", "uniflow-flow"]}}) {
        nodes {
          fields {
            slug
          }
        }
      }
    }
    `);

  if (result.errors) {
    reporter.panic(result.errors);
  }

  const {
    articles,
    docNav,
    docs,
    newsletters,
    //library,
    localLibrary,
  } = result.data;
  const docsBySlug = docs.nodes.reduce((value, doc) => {
    value[`/docs${doc.fields.slug ? '/' + doc.fields.slug : ''}`] = doc;
    return value;
  }, {});

  const docItems = docNav.nodes.reduce((value, docSection) => {
    docSection.items.forEach((docItem) => {
      const slug = docItem.link;
      const doc = docsBySlug[slug];
      if (doc !== undefined) {
        value.push(doc);
      }
    });
    return value;
  }, []);
  docItems.forEach((doc, index) => {
    const previous = index === 0 ? null : docItems[index - 1];
    const next = index === docItems.length - 1 ? null : docItems[index + 1];
    createPage({
      path: `/docs${doc.fields.slug ? '/' + doc.fields.slug : ''}`,
      component: require.resolve('./src/templates/doc.tsx'),
      context: {
        ...doc,
        previous,
        next,
      },
    });
  });

  newsletters.nodes.forEach((newsletter) => {
    createPage({
      path: `/newsletters/${newsletter.fields.slug}`,
      component: require.resolve('./src/templates/newsletter.tsx'),
      context: {
        ...newsletter,
      },
    });
  });

  const tags = {};
  const contributorSet = new Set();
  articles.nodes.forEach((article, index) => {
    article.frontmatter.tags.forEach((tag) => {
      tags[tag] = (tags[tag] || 0) + 1;
    });
    contributorSet.add(article.frontmatter.author.fields.slug);

    const previous = index === articles.nodes.length - 1 ? null : articles.nodes[index + 1];
    const next = index === 0 ? null : articles.nodes[index - 1];
    createPage({
      path: `/blog/${article.fields.slug}`,
      component: require.resolve('./src/templates/article.tsx'),
      context: {
        ...article,
        previous,
        next,
      },
    });
  });

  createPage({
    path: `/blog/tags`,
    component: require.resolve('./src/templates/tags.tsx'),
    context: {
      tags,
    },
  });

  const tagList = Object.keys(tags);
  tagList.forEach((tag) => {
    createPage({
      path: `/blog/tags/${tag}`,
      component: require.resolve('./src/templates/tag.tsx'),
      context: {
        tag,
      },
    });
  });

  const contributorList = Array.from(contributorSet);
  contributorList.forEach((contributor) => {
    createPage({
      path: `/blog/contributors/${contributor}`,
      component: require.resolve('./src/templates/contributor.tsx'),
      context: {
        slug: contributor,
      },
    });
  });

  let cardSlugs = new Set();
  /*library.nodes.forEach(card => {
        cardSlugs.add(card.fields.slug);
    });*/
  localLibrary.nodes.forEach((card) => {
    cardSlugs.add(card.fields.slug);
  });
  cardSlugs.forEach(function (cardSlug) {
    createPage({
      path: `/library/${cardSlug}`,
      component: require.resolve('./src/templates/card.tsx'),
      context: {
        slug: cardSlug,
      },
    });
  });
};

const replacePath = (_path) => (_path === `/` ? _path : _path.replace(/\/$/, ``));

exports.onCreatePage = ({ page, actions }) => {
  const { createPage, deletePage } = actions;

  if (page.path.startsWith(`/feed`)) {
    page.matchPath = `/*`;
    createPage(page);
  }

  return new Promise((resolve) => {
    const oldPage = Object.assign({}, page);
    page.path = replacePath(page.path);
    if (page.path !== oldPage.path) {
      deletePage(oldPage);
      createPage(page);
    }
    resolve();
  });
};
