import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { api } from "../../convex/_generated/api";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const [url, setUrl] = useState("");
  const router = useRouter();
  const { mutateAsync, isPending } = useMutation({
    mutationFn: useConvexMutation(api.workflow.kickoffGenerateTitleWorkflow),
    onSuccess: (id) => {
      router.navigate({
        to: "/workflow/$workflowId",
        params: {
          workflowId: id as string,
        },
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await mutateAsync({ url });
    setUrl("");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">Title Generator</h1>
      <p className="text-lg mb-6">Generate a title for your YouTube video</p>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <input
          type="url"
          placeholder="Enter YouTube URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-3 rounded-md bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          required
          disabled={isPending}
        />
        <button
          type="submit"
          className={`w-full p-3 rounded-md font-semibold ${isPending ? "bg-gray-600" : "bg-blue-600 hover:bg-blue-700"}`}
          disabled={isPending}
        >
          {isPending ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
