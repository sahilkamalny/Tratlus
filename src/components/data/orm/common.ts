/**
 * Data value types
 */
export enum DataType {
  string = 1,
  number = 2,
  boolean = 3,
  enumeration = 100,
  array = 101,
  object = 102,
  reference = 103,
}

/**
 * Simple filter selectors
 */
export enum SimpleSelector {
  equal = 1,
  not_equal = 2,
  similar = 3,
  not_similar = 4,
  match = 5,
  not_match = 6,
  greater = 7,
  greater_or_equal = 8,
  less = 9,
  less_or_equal = 10,
  in = 11,
  not_in = 12,
  not = 13,
  exists = 14,
  not_exists = 15,
}

/**
 * Multi filter selectors
 */
export enum MultiSelector {
  and = 1,
  or = 2,
  nor = 3,
  all = 4,
  elem_match = 5,
  size = 6,
}

/**
 * Sort direction
 */
export enum Direction {
  ascending = 1,
  descending = 2,
}

/**
 * Data value structure
 */
export interface Value {
  type: DataType;
  name?: string;
  string?: string;
  number?: number;
  boolean?: boolean;
  enumeration?: number;
  object: Value[];
  array: Value[];
  nullable?: boolean;
}

/**
 * Format options for responses
 */
export interface Format {
  schema?: boolean;
  structured?: boolean;
  serialized?: boolean;
}

/**
 * Pagination - simplified from protobuf Page
 */
export interface Page {
  number: number;
  size: number;
  total?: number;
}

/**
 * Trace information
 */
export interface Trace {
  id: string;
  env: string;
  lane: string;
  caller: string;
  duration: string;
}

/**
 * Data structure
 */
export interface Data {
  structured: Value[];
  serialized?: string;
}

/**
 * Index structure
 */
export interface Index {
  fields: string[];
  values: Value[];
}

/**
 * Simple filter
 */
export interface SimpleFilter {
  symbol: SimpleSelector;
  field: string;
  value?: Value;
}

/**
 * Multi filter
 */
export interface MultiFilter {
  symbol: MultiSelector;
  field?: string;
  value: SimpleFilter[];
}

/**
 * Group structure
 */
export interface Group {
  symbol: number; // Accumulator enum simplified to number
  keyMap: Record<string, string>;
}

/**
 * Sort order
 */
export interface Order {
  symbol: Direction;
  field: string;
}

/**
 * Unwind structure
 */
export interface Unwind {
  field: string;
}

/**
 * Filter structure
 */
export interface Filter {
  simples: SimpleFilter[];
  multiples: MultiFilter[];
  groups: Group[];
  unwinds: Unwind[];
}

/**
 * Sort structure
 */
export interface Sort {
  orders: Order[];
}

/**
 * Result structure
 */
export interface Result {
  values: Data[];
  page?: Page;
}

/**
 * Score range for ranked lists
 */
export interface ScoreRange {
  scoreMin: number;
  scoreMax: number;
  excludeMin: boolean;
  excludeMax: boolean;
}

/**
 * Base response structure
 */
export interface BaseResponse {
  code?: number;
  message?: string;
  error?: string;
  trace?: Trace;
}

// Request types
export interface AllRequest {
  id: string;
  namespace: string;
  name: string;
  version: string;
  task: string;
  format?: Format;
}

export interface InsertRequest {
  id: string;
  namespace: string;
  name: string;
  version: string;
  task: string;
  data?: Data;
  batch?: Data[];
  upsert?: boolean;
  format?: Format;
}

export interface PurgeRequest {
  id: string;
  namespace: string;
  name: string;
  version: string;
  task: string;
  format?: Format;
}

export interface GetRequest {
  id: string;
  namespace: string;
  name: string;
  version: string;
  task: string;
  index?: Index;
  format?: Format;
}

export interface SetRequest {
  id: string;
  namespace: string;
  name: string;
  version: string;
  task: string;
  index?: Index;
  data?: Data;
  upsert?: boolean;
  previous?: Data;
  format?: Format;
}

export interface DeleteRequest {
  id: string;
  namespace: string;
  name: string;
  version: string;
  task: string;
  index?: Index;
  format?: Format;
}

export interface MGetRequest {
  id: string;
  namespace: string;
  name: string;
  version: string;
  task: string;
  indexes: Index[];
  format?: Format;
}

export interface MSetRequest {
  id: string;
  namespace: string;
  name: string;
  version: string;
  task: string;
  indexes: Index[];
  data: Data[];
  upsert?: boolean;
  previous: Data[];
  format?: Format;
}

export interface ListRequest {
  id: string;
  namespace: string;
  name: string;
  version: string;
  task: string;
  filter?: Filter;
  sort?: Sort;
  paginate?: Page;
  format?: Format;
}

export interface IncreaseCounterRequest {
  id: string;
  namespace: string;
  name: string;
  version: string;
  task: string;
  index?: Index;
  delta?: number;
  format?: Format;
}

export interface CountRankedListRequest {
  id: string;
  namespace: string;
  name: string;
  version: string;
  task: string;
  range?: ScoreRange;
  format?: Format;
}

// Response types
export interface AllResponse extends BaseResponse {
  data?: Result;
}

export interface InsertResponse extends BaseResponse {
  data?: Result;
}

export interface PurgeResponse extends BaseResponse {
  data?: Result;
}

export interface GetResponse extends BaseResponse {
  data?: Result;
}

export interface SetResponse extends BaseResponse {
  data?: Result;
}

export interface DeleteResponse extends BaseResponse {
  data?: Result;
}

export interface MGetResponse extends BaseResponse {
  data?: Result;
}

export interface MSetResponse extends BaseResponse {
  data?: Result;
}

export interface ListResponse extends BaseResponse {
  data?: Result;
}

export interface IncreaseCounterResponse extends BaseResponse {
  data?: Result;
}

export interface CountRankedListResponse extends BaseResponse {
  data?: Result;
}