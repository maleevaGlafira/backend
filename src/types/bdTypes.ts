export interface IDbClient {
  executeSelect<T>(query: string, params?: any[]): Promise<T[]>;
  executeNonQuery(query: string, params?: any[]): Promise<any[]>;
  executeStoredProcedure<T>(
    procedureName: string,
    params?: any[]
  ): Promise<T[]>;
}

export type QueryWithParams = {
  sql: string;
  countSql: string;
  params: any[];
  newFilter: any;
};
