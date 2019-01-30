const path = require('path')

exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
    const isSSR = stage.includes(`html`)

    actions.setWebpackConfig({
        module: {
            rules: isSSR ? [
                {
                    test: /brace|remote-browser/,
                    use: loaders.null(),
                }
            ] : [],
        }
    })
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
