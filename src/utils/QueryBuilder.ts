import { Query } from "mongoose";
export class QueryBuilder<T> {
  private query: Record<string, string>;
  private modelQuery: Query<T[], T>;
  constructor(query: Record<string, string>, modelQuery: Query<T[], T>) {
    this.query = query;
    this.modelQuery = modelQuery;
  }
  filter(): this {
    const excludeFields = [
      "searchTerm",
      "limit",
      "sort",
      "fields",
      "page",
      "fee",
      "weight",
    ];
    const filter = { ...this.query };
    for (const field of excludeFields) {
      delete filter[field];
    }
    this.modelQuery = this.modelQuery.find(filter);
    return this;
  }
  search(searchableFields: string[]): this {
    const searchTerm = this.query.searchTerm || "";
    const searchQuery = {
      $or: searchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: "i" },
      })),
    };
    this.modelQuery = this.modelQuery.find(searchQuery);
    return this;
  }
  sort(): this {
    const sort = this.query.sort || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sort);
    return this;
  }
  fields(): this {
    const fields = this.query.fields?.split(",")?.join(" ") || "";
    this.modelQuery = this.modelQuery.select(fields);
    return this;
  }
  paginate(): this {
    const limit = Number(this.query.limit) || 10;
    const page = Number(this.query.page) || 1;
    const skip = (page - 1) * limit;
    this.modelQuery = this.modelQuery.skip(skip).limit(limit);
    return this;
  }
  build(isParcel = false): Query<T[], T> {
    if (isParcel) {
      return this.modelQuery.populate(
        "sender receiver statusLogs.updatedBy",
        "-__v -password -email"
      );
    }
    return this.modelQuery;
  }
  async getMetaData() {
    const limit = Number(this.query.limit) || 10;
    const page = Number(this.query.page) || 1;
    const filter = await this.modelQuery.getFilter();
    const totalDocuments = await this.modelQuery.model.countDocuments(filter);
    return {
      total: totalDocuments,
      page: page,
      limit: limit,
      totalPages: Math.ceil(totalDocuments / limit),
    };
  }
}
