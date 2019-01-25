exports.onCreatePage = function onCreatePage({
                                                 page,
                                                 actions: { createPage },
                                             }) {
    if (page.path.startsWith(`/article`)) {
        page.matchPath = `/blog/:slug`
        createPage(page)
    }
}
