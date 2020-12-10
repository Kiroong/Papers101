import { createAction } from "typesafe-actions";
import { Dispatch } from "react";

export function makeThunk<
  FetchType extends string,
  CompleteType extends string,
  FetchPayload,
  CompletePayload,
  Args extends any[]
>(
  fetchType: FetchType,
  completeType: CompleteType,
  describer: (
    ...args: Args
  ) => {
    request: FetchPayload;
    response: () => Promise<CompletePayload>;
  }
) {
  const fetch = createAction(
    fetchType,
    (fetchPayload: FetchPayload) => fetchPayload
  )();

  const complete = createAction(
    completeType,
    (completePayload: CompletePayload, fetchPayload: FetchPayload) =>
      completePayload,
    (completePayload: CompletePayload, fetchPayload: FetchPayload) =>
      fetchPayload
  )();

  const thunk = (...args: Args) => async (dispatch: Dispatch<any>) => {
    const { request, response } = describer(...args);
    dispatch(fetch(request));
    dispatch(complete(await response(), request));
  };

  return { fetch, complete, thunk };
}
