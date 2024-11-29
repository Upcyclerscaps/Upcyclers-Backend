/* eslint-disable linebreak-style */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable space-before-function-paren */
/* eslint-disable indent */
/* eslint-disable quotes */

class APIFeatures {
    constructor(query, queryString) {
      this.query = query;
      this.queryString = queryString;
    }
   
    filter() {
      const queryObj = { ...this.queryString };
      const excludedFields = ['page', 'sort', 'limit', 'fields'];
      excludedFields.forEach(`el => delete queryObj[el]`);
   
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(`/\b(gte|gt|lte|lt)\b/g, match => $${match}`);
   
      this.query = this.query.find(JSON.parse(queryStr));
      return this;
    }
   
    sort() {
      if (this.queryString.sort) {
        const sortBy = this.queryString.sort.split(',').join(' ');
        this.query = this.query.sort(sortBy);
      }
      return this;
    }
   
    paginate() {
      const page = this.queryString.page * 1 || 1;
      const limit = this.queryString.limit * 1 || 10;
      const skip = (page - 1) * limit;
   
      this.query = this.query.skip(skip).limit(limit);
      return this;
    }
   }
   
   module.exports = APIFeatures;