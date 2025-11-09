import { getConfessions } from "@/lib/data";
import { FeedClient } from "./feed-client";

export default async function FeedPage() {
  const { confessions } = await getConfessions();

  return <FeedClient confessions={confessions} />;
}
