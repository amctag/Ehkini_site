import { getMockResponse } from "@/mocks/handlers";
import { clearAuth } from "./authSlice";

/** RTK Query baseQuery that serves @/mocks/data instead of the network */
export async function mockBaseQuery(args, api, extraOptions) {
  void extraOptions;
  const result = await getMockResponse(args);

  if (result.error?.status === 401) {
    api.dispatch(clearAuth());
  }

  return result;
}
