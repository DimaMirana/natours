class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    filter() {
        // 1A) FILTERING
        const queryObj = { ...this.queryString }
        const excludedFiles = ['page', 'sort', 'limit', 'fields'];
        excludedFiles.forEach(el => delete queryObj[el]);

        // 1B) ADVANCED FILTERING --> for gte,gt,lte,lt in query string i.e duration[gte]=5
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte)\b/g, (match) => `$${match}`);

        this.query = this.query.find(JSON.parse(queryStr))
        return this;
    }
    sort() {
        // 2) SORTING 
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }
    limitFields() {
        // 3) Field limiting
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v')
        }
        return this;
    }
    paginate() {
        // 4) Pagination
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * limit;

        // page = 3&limit=10,1-10 page 1,11-20 page 2,21-30 page 3...
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

module.exports = APIFeatures;