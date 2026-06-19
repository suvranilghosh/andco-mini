import caseData from "@/public/case-documents.json";
import { CaseRequests } from "@/components/case-requests";

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function Home() {
  await sleep(500); // demo only
  return <CaseRequests caseData={caseData} />;
}
