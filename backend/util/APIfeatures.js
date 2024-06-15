class APIfeatures {
  constructor({ query }) {
    this.query = query;
  }
  getQuery() {
    return this.query;
  }
  skip(amount) {
    this.query = this.query.skip(amount);
    return this;
  }
  limit(amount) {
    this.query = this.query.limit(amount);
    return this;
  }
  regexField(field, pattern) {
    this.query = this.query.where(field).regex(new RegExp(pattern, "i"));
    return this; // Return instance for chaining
  }
}
module.exports = APIfeatures;
