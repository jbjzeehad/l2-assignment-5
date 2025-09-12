import { Response } from "express";

interface Tmeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

interface IResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  meta?: Tmeta;
}

const sendResponse = <T>(res: Response, data: IResponse<T>) => {
  res.status(data.statusCode).json({
    statusCode: data.statusCode,
    success: true,
    message: data.message,
    data: data.data,
    meta: data.meta,
  });
};

export default sendResponse;
