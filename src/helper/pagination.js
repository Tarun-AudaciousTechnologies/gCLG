const paginationData = ({currentPage,limit}) => {
    currentPage = currentPage ? currentPage : 1
    limit = limit ? limit : 10
    let currentPages = parseInt(currentPage)
    let limits = parseInt(limit);
    const offset = (currentPages - 1) * limits
    return {offset, limits}
};

module.exports = { paginationData }