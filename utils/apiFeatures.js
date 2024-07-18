class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    filter() {
        //Building Query
        const queryObj = { ...this.queryString };
        const excludedFields = ['page', 'sort', 'fields', 'limit'];
        excludedFields.forEach(field => delete queryObj[field]);

        //Advance filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        this.query = this.query.find(JSON.parse(queryStr));

        return this;
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt');
        };
        return this;
    };

    limitFields() {
        if (this.queryString.limit) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        } else {
            this.query = this.query.select('-__v');
        }
        return this;
    };

    paginate() {
        const page = this.queryString.page * 1 || 1;
        const pageSize = this.queryString.limit * 1 || 100;
        const skip = (page - 1) * pageSize;

        this.query = this.query.skip(skip).limit(pageSize);

        return this;
    };

};

module.exports = APIFeatures;