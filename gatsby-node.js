exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
    if (stage === "develop-html" || stage === "build-html") {
        actions.setWebpackConfig({
            module: {
                rules: [
                    {
                        test: /brace/,
                        use: loaders.null(),
                    },
                ],
            },
        })
    }
}

exports.onCreatePage = function onCreatePage({
                                                 page,
                                                 actions: { createPage },
                                             }) {
    if (page.path.startsWith(`/article`)) {
        page.matchPath = `/blog/*`
        createPage(page)
    } else if(page.path.startsWith(`/feed`)) {
        page.matchPath = `/*`
        createPage(page)
    }
}
