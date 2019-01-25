exports.onCreatePage = function onCreatePage({
                                                 page,
                                                 actions: { createPage },
                                             }) {
    if (page.path.startsWith(`/blog/`)) {
        page.matchPath = `/blog/:slug`
        createPage(page)
    }
}
