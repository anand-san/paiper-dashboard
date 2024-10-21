import { useGetDocuments } from "@/api/useDocuments";
import { FileCards } from "@/components/FileCards";
import Loader from "@/components/loader/Loader";
import { Tabs } from "@/components/ui/tabs/tabs";

export default function MyFiles() {
  const { isPending, isError, data, error } = useGetDocuments();

  if (isPending)
    return (
      <div className="h-screen flex">
        <Loader />
      </div>
    );

  if (isError) return <div>Error: {error.message}</div>;

  const mapApiResponseToCards = (category?: string) => {
    let items = data.message;

    if (category) {
      items = data.message.filter((item) =>
        category ? item.category === category : true
      );
    }

    return items.map((item) => {
      return {
        id: item.id,
        name: item.name,
        fileType: item.fileType,
        uploadedAt: item.uploadedAt,
        url: item.url.replace("googleapis", "cloud.google"),
        ctaText: "View",
        ctaLink: item.url.replace("googleapis", "cloud.google"),
        summary: item.summary,
        subCategory: item.subCategory,
        tags: item.tags,
        year: item.year,
        content: () => {
          return <></>;
        },
      };
    });
  };

  let TABS = [];

  const DEFAULT_TAB = [
    {
      title: "Everything",
      value: "everything",
      content: (
        <div className="w-full overflow-auto relative h-full rounded-2xl p-2 md:p-4 text-xl md:text-4xl font-bold bg-gradient-to-br from-stone-100 to-stone-200 dark:from-stone-800 dark:to-stone-900">
          <FileCards cards={mapApiResponseToCards()} />
        </div>
      ),
    },
  ];

  const uniqueCategories = [
    ...new Set(data.message.map((item) => item.category)),
  ];

  const categoryTabs = uniqueCategories.map((category) => ({
    title: category,
    value: category,
    content: (
      <div className="w-full overflow-auto relative h-full rounded-2xl p-2 md:p-4 text-xl md:text-4xl font-bold bg-gradient-to-br from-stone-100 to-stone-200 dark:from-stone-800 dark:to-stone-900">
        <FileCards cards={mapApiResponseToCards(category)} />
      </div>
    ),
  }));

  TABS = [...DEFAULT_TAB, ...categoryTabs];

  return (
    <div className="h-full md:h-[40rem] [perspective:1000px] relative b flex flex-col overflow-visible mx-auto w-full  items-start justify-start">
      <Tabs tabs={TABS} />
    </div>
  );
}
