import { generateSummary } from "@/action/ai";

export default async function Demo() {
  const res = await generateSummary({ article: "Hello, world!" });

  return (
    <div>
      <h1>Demo</h1>
      <p>{res}</p>
    </div>
  );
}
