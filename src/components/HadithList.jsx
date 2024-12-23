// filepath: HadithList.jsx
import { useInfiniteQuery } from "react-query";
import { fetchHadithsByBook } from "../services/api";
import HadithCard from "./HadithCard";
import LoadingSpinner from "./LoadingSpinner";

function HadithList({ categoryId, language }) {
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(
    ["hadiths", categoryId, language],
    ({ pageParam = 1 }) => fetchHadithsByBook(categoryId, language, pageParam),
    {
      enabled: !!categoryId,
      staleTime: 5 * 60 * 1000, // Cache for 5 minutes
      getNextPageParam: (lastPage) => {
        if (!lastPage?.pagination) return undefined;
        return lastPage.pagination.current_page <
          lastPage.pagination.total_pages
          ? lastPage.pagination.current_page + 1
          : undefined;
      },
      onError: (error) => {
        console.error("Error fetching hadiths:", error);
      },
    }
  );

  if (error) {
    return (
      <div className="text-red-500">Error loading hadiths: {error.message}</div>
    );
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!data?.pages?.[0]?.data) {
    return <div className="text-center mt-4">No hadiths found</div>;
  }

  return (
    <div className="p-4">
      {data.pages.map((page, i) => (
        <div
          key={i}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
        >
          {page.data.map((hadith) => (
            <HadithCard key={hadith.id} hadith={hadith} />
          ))}
        </div>
      ))}

      {hasNextPage && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isFetchingNextPage ? "Loading more..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}

export default HadithList;
