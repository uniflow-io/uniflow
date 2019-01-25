exports.onCreatePage = function onCreatePage({
                                                 page,
                                                 actions: { createPage },
                                             }) {
    if (page.path.startsWith(`/article`)) {
        page.matchPath = `/blog/*`
        createPage(page)
    } else if(page.path.startsWith(`/feed`)) {
        page.matchPath = `/me/feed/*`
        createPage(page)
    }
}
