// import { edenTreaty } from "@elysiajs/eden";
// import { type ApiType } from "@glowlabs-org/crm-bindings";

// if (!process.env.NEXT_PUBLIC_CRM_API) {
//   throw new Error("Missing NEXT_PUBLIC_CRM_API env variable");
// }

// // export const apiClient = edenTreaty<ApiType>("http://localhost:3005");
// export const apiClient = edenTreaty<ApiType>(process.env.NEXT_PUBLIC_CRM_API);

const getCarbonCreditHelper = async (lat:string, lon:string) => {
  const response = await fetch(`http://95.217.194.59:35015/api/v1/geo-stats?latitude=${lat}&longitude=${lon}`);
  const data = await response.json();
  return data;
}

export default getCarbonCreditHelper;