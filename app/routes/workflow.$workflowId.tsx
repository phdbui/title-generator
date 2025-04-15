import { createFileRoute, useRouter, Link } from "@tanstack/react-router";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "../../convex/_generated/api";
import { useSuspenseQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/workflow/$workflowId")({
  component: RouteComponent,
});

function RouteComponent() {
  const { workflowId } = Route.useParams();
  const { data: titles, isLoading } = useSuspenseQuery(
    convexQuery(api.titles.getTitles, { workflowId: workflowId!! })
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 space-y-4 ">
      <div className="">
        <Link
          to="/"
          className="p-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md"
        >
          Back to Home
        </Link>
      </div>
      <h1 className="text-3xl text-center">
        List title for workflow {workflowId}
      </h1>
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {titles.map((item, index) => (
          <div
            key={index}
            className="p-4 bg-gray-800 rounded-md shadow-md flex flex-col items-start"
          >
            <h2 className="text-xl font-bold mb-2">{item.title}</h2>
            <p className="text-sm text-gray-400">Rating: {item.rating}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
