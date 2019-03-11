let conn = require("./db");

class Pagination {
    constructor(query, params = [], itemsPerPage = 10) {
        this.query = query;
        this.params = params;
        this.itemsPerPage = itemsPerPage;
        this.currentPage;
    }

    getPage(page) {

        this.currentPage = page - 1;

        this.params.push(
            this.currentPage * this.itemsPerPage,
            this.itemsPerPage
        )
        console.log(this.params);
        return new Promise((resolve, reject) => {
            conn.query([this.query, "SELECT FOUND_ROWS() AS ROWS"].join(";"), this.params, (err, results, fields) => {
                if(err) {
                    reject(err);
                } else {

                    this.data = results[0];
                    this.total = results[1][0].ROWS;
                    this.totalPages = Math.ceil(results[1][0].ROWS / this.itemsPerPage);
                    this.currentPage++;

                    resolve(this.data);
                }
            })
        })
    }

    getTotal() {
        return this.total;
    }

    getCurrentPage() {
        return this.currentPage;
    }

    getTotalPages() {
        return this.totalPages;
    }

    getNavigation(params) {
        let limitNavigation = 5,
        links = [],
        nrstart = 0,
        nrend = 0;

        if(this.getTotalPages() > this.limitNavigation) limitNavigation = this.getTotalPages();

        if(this.getCurrentPage() - parseInt(limitNavigation/2) < 1) {
            nrstart = 1;
            nrend = limitNavigation;
        } else if(this.getCurrentPage() + parseInt(limitNavigation/2) > this.getTotalPages()) {
            nrstart = this.getCurrentPage() - parseInt(limitNavigation/2);
            nrend = this.getTotalPages();
        } else {
            nrstart = this.getCurrentPage() - parseInt(limitNavigation/2);
            nrend = this.getCurrentPage() + parseInt(limitNavigation/2);
        }

        if(this.getCurrentPage() > 1) {
            links.push({
                text: "<",
                href: `${this.queryString(Object.assign({}, {page: this.getCurrentPage() - 1}, params))}`,
                active: false
            })
        }

        for(let x = nrstart; x <= nrend; x++) {
            links.push({
                text: x,
                href: `${this.queryString(Object.assign({}, {page: x}, params))}`,
                active: (x == this.getCurrentPage())
            })
        }

        if(this.getCurrentPage() < this.getTotalPages()) {
            links.push({
                text: '>',
                href: `${this.queryString(Object.assign({}, {page: this.getCurrentPage() + 1}, params))}`,
                active: false
            })
        }

        return links;
    }

    queryString(params) {
        let query = [];

        for(let name in params) {
            query.push(`?${name}=${params[name]}`);
        }

        return query.join("&");
    }
}

module.exports = Pagination;