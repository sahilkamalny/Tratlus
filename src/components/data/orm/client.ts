import { authApi } from "@/lib/auth-integration";
import { DataType, Direction, SimpleSelector } from "./common";
import type {
  Page,
  Format,
  Index,
  Filter,
  Sort,
  Data,
  SimpleFilter,
  MultiFilter,
  Value,
  AllRequest,
  InsertRequest,
  PurgeRequest,
  GetRequest,
  SetRequest,
  DeleteRequest,
  MGetRequest,
  MSetRequest,
  MultiSelector,
  ListRequest,
  IncreaseCounterRequest,
  CountRankedListRequest,
  AllResponse,
  InsertResponse,
  PurgeResponse,
  GetResponse,
  SetResponse,
  DeleteResponse,
  MGetResponse,
  MSetResponse,
  ListResponse,
  IncreaseCounterResponse,
  CountRankedListResponse,
} from "./common";

const BASE_URL = "https://api-production.creao.ai";
const BASE_TIMEOUT = 30000;


/**
 * Client for DataStore service.
 * It uses Singleton pattern to prevent re-initialization.
 */
export class DataStoreClient {
  private static instance: DataStoreClient | null = null;
  private host: string;
  private timeout: number;

  private constructor(timeout: number = BASE_TIMEOUT) {
    this.host = BASE_URL;
    this.timeout = timeout;
  }

  /**
   * Get singleton instance of DataStoreClient.
   */
  public static getInstance(timeout: number = BASE_TIMEOUT): DataStoreClient {
    if (!DataStoreClient.instance) {
      DataStoreClient.instance = new DataStoreClient(timeout);
    }

    return DataStoreClient.instance;
  }

  private async request<T>(endpoint: string, data: unknown): Promise<T> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await authApi.post(
        `${this.host}${endpoint}`,
        data,
        { signal: controller.signal }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.error(`Request timeout after ${this.timeout} seconds`);
        throw new Error(`Request timeout after ${this.timeout} seconds`);
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // General operations
  async all(request: AllRequest): Promise<AllResponse> {
    return this.request<AllResponse>("/data/store/v1/all", request);
  }

  async insert(request: InsertRequest): Promise<InsertResponse> {
    return this.request<InsertResponse>("/data/store/v1/insert", request);
  }

  async purge(request: PurgeRequest): Promise<PurgeResponse> {
    return this.request<PurgeResponse>("/data/store/v1/purge", request);
  }

  // Index operations
  async get(request: GetRequest): Promise<GetResponse> {
    return this.request<GetResponse>("/data/store/v1/get", request);
  }

  async set(request: SetRequest): Promise<SetResponse> {
    return this.request<SetResponse>("/data/store/v1/set", request);
  }

  async delete(request: DeleteRequest): Promise<DeleteResponse> {
    return this.request<DeleteResponse>("/data/store/v1/delete", request);
  }

  async mGet(request: MGetRequest): Promise<MGetResponse> {
    return this.request<MGetResponse>("/data/store/v1/mget", request);
  }

  async mSet(request: MSetRequest): Promise<MSetResponse> {
    return this.request<MSetResponse>("/data/store/v1/mset", request);
  }

  // List operations
  async list(request: ListRequest): Promise<ListResponse> {
    return this.request<ListResponse>("/data/store/v1/list", request);
  }

  // Counter operations
  async increaseCounter(
    request: IncreaseCounterRequest
  ): Promise<IncreaseCounterResponse> {
    return this.request<IncreaseCounterResponse>(
      "/data/store/v1/increase_counter",
      request
    );
  }

  // Ranked list operations
  async countRankedList(
    request: CountRankedListRequest
  ): Promise<CountRankedListResponse> {
    return this.request<CountRankedListResponse>(
      "/data/store/v1/count_ranked_list",
      request
    );
  }
}

/**
 * Builder for creating filters
 */
export class FilterBuilder {
  private simples: SimpleFilter[] = [];
  private multiples: MultiFilter[] = [];

  simple(
    field: string,
    selector: SimpleSelector,
    value?: Value
  ): FilterBuilder {
    this.simples.push({
      symbol: selector,
      field,
      value,
    });
    return this;
  }

  multiple(
    field: string | undefined,
    selector: MultiSelector,
    filters: SimpleFilter[]
  ): FilterBuilder {
    this.multiples.push({
      symbol: selector,
      field,
      value: filters,
    });
    return this;
  }

  // Convenience methods
  equal(field: string, value: Value): FilterBuilder {
    return this.simple(field, SimpleSelector.equal, value);
  }

  notEqual(field: string, value: Value): FilterBuilder {
    return this.simple(field, SimpleSelector.not_equal, value);
  }

  greater(field: string, value: Value): FilterBuilder {
    return this.simple(field, SimpleSelector.greater, value);
  }

  less(field: string, value: Value): FilterBuilder {
    return this.simple(field, SimpleSelector.less, value);
  }

  in(field: string, value: Value): FilterBuilder {
    return this.simple(field, SimpleSelector.in, value);
  }

  exists(field: string): FilterBuilder {
    return this.simple(field, SimpleSelector.exists);
  }

  build(): Filter {
    return {
      simples: this.simples,
      multiples: this.multiples,
      groups: [],
      unwinds: [],
    };
  }
}

/**
 * Builder for creating sort orders
 */
export class SortBuilder {
  private orders: Array<{ symbol: Direction; field: string }> = [];

  add(field: string, direction: Direction): SortBuilder {
    this.orders.push({ symbol: direction, field });
    return this;
  }

  ascending(field: string): SortBuilder {
    return this.add(field, Direction.ascending);
  }

  descending(field: string): SortBuilder {
    return this.add(field, Direction.descending);
  }

  build(): Sort {
    return {
      orders: this.orders,
    };
  }
}

export function CreateData(fields: Value[]): Data {
  return {
    structured: fields,
  };
}

export function CreateValue(
  type: DataType,
  value: unknown,
  name?: string
): Value {
  const v: Value = {
    type: type,
    name: name,
    object: [],
    array: [],
  };

  // Set the appropriate value field based on type
  switch (type) {
    case DataType.string:
      v.string = String(value);
      break;
    case DataType.number:
      v.number = Number(value);
      break;
    case DataType.boolean:
      v.boolean = Boolean(value);
      break;
    case DataType.enumeration:
      v.enumeration = typeof value === "bigint" ? Number(value) : Number(value);
      break;
    case DataType.array:
      v.array = createArrayValue(value);
      break;
    case DataType.object:
      v.object = createObjectValue(value);
      break;
    case DataType.reference:
      v.object = createObjectValue(value);
      break;
    default:
      break;
  }
  return v;
}

function createArrayValue(value: unknown): Value[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item, _) => {
    const itemType = determineValueType(item);
    return CreateValue(itemType, item);
  });
}

function createObjectValue(value: unknown): Value[] {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return [];
  }

  const fields: Value[] = [];
  for (const [key, val] of Object.entries(value)) {
    const fieldType = determineValueType(val);
    fields.push(CreateValue(fieldType, val, key));
  }

  return fields;
}

function determineValueType(value: unknown): DataType {
  if (typeof value === "string") return DataType.string;
  if (typeof value === "number") return DataType.number;
  if (typeof value === "boolean") return DataType.boolean;
  if (Array.isArray(value)) return DataType.array;
  if (typeof value === "object" && value !== null) return DataType.object;

  // Default to string for unknown types
  return DataType.string;
}

export function ParseValue(value: Value, type: DataType): unknown {
  switch (type) {
    case DataType.string:
      return value.string || "";
    case DataType.number:
      return value.number !== undefined ? Number(value.number) : 0;
    case DataType.boolean:
      return value.boolean !== undefined ? Boolean(value.boolean) : false;
    case DataType.enumeration:
      // Use number instead of BigInt
      return value.enumeration !== undefined ? Number(value.enumeration) : 0;
    case DataType.array:
      return parseArrayValue(value.array);
    case DataType.object:
      return parseObjectValue(value.object);
    case DataType.reference:
      return parseObjectValue(value.object);
    default:
      return "";
  }
}

function parseArrayValue(value: Value[]): unknown[] {
  if (!Array.isArray(value)) {
    return [];
  }

  // Sort by name (which should be the index) to maintain order
  const sortedItems = value.sort((a, b) => {
    const indexA = Number.parseInt(a.name ?? "") || 0;
    const indexB = Number.parseInt(b.name ?? "") || 0;
    return indexA - indexB;
  });

  return sortedItems.map((item) => {
    return ParseValue(item, item.type);
  });
}

function parseObjectValue(value: Value[]): Record<string, unknown> {
  if (!Array.isArray(value)) {
    return {};
  }

  const result: Record<string, unknown> = {};
  for (const field of value) {
    if (field.name) {
      result[field.name] = ParseValue(field, field.type);
    }
  }

  return result;
}

// Export convenience types
export type { Page, Format, Value, Filter, Index, Sort };
