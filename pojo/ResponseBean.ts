export default class ResponseBean<T> {
  code: number | null = null;
  res: T | null = null;
  msg: string | null = null;
  md5: string | null = null;
}
