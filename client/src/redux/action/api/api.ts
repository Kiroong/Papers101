import Axios from "axios";
import { PaperEntry } from "../../state/overview";

export async function getData() {
  const r = await Axios.get("data.json");
  return Object.entries(r.data)
    .map(([doi, entry]: [string, any]) => ({
      ...entry,
      doi,
    }))
    .filter((entry) => entry.title.length) as PaperEntry[];
}

// const baseUrl = process.env.REACT_APP_BASEURL || "http://localhost:8998/";

// export async function getQuery(issueQueryId: number) {
//   const r = await Axios.get<IssueQuery>(baseUrl + `query/${issueQueryId}`);
//   return r.data;
// }

// export async function postQuery(description: string) {
//   console.log(process.env);
//   console.log("baseUrl: " + baseUrl);
//   const r = await Axios.post<IssueQuery>(baseUrl + "query/", {
//     description,
//   });
//   return r.data;
// }
