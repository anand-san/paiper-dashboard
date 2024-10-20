import { useGetDocuments } from "@/api/useDocuments";
import { ExpandableCards } from "@/components/ExpandableCards";
import { Tabs } from "@/components/ui/tabs/tabs";

export default function MyFiles() {
  const { isPending, isError, data, error } = useGetDocuments();

  if (isPending) return <div>Loading...</div>;

  if (isError) return <div>Error: {error.message}</div>;
  const mapApiResponseToCards = () => {
    return data.message.map((item) => ({
      id: item.id,
      description: "Yo",
      title: item.name,
      src: item.url.replace("googleapis", "cloud.google"),
      ctaText: "View",
      ctaLink: item.url.replace("googleapis", "cloud.google"),
      content: () => {
        return (
          <p>
            File Name: {item.name} <br />
            Uploaded At: {new Date(item.uploadedAt).toLocaleString()} <br />
            File Type: {item.fileType}
            {item.ocrData}
          </p>
        );
      },
    }));
  };

  const tabs = [
    {
      title: "Everything",
      value: "everything",
      content: (
        <div className="w-full overflow-auto relative h-full rounded-2xl p-2 md:p-4 text-xl md:text-4xl font-bold bg-gradient-to-br from-stone-100 to-stone-200">
          <ExpandableCards cards={mapApiResponseToCards()} />
        </div>
      ),
    },
    {
      title: "Bills",
      value: "bills",
      content: (
        <div className="w-full overflow-auto relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold  bg-gradient-to-br from-stone-100 to-stone-200">
          <p>Bills</p>
        </div>
      ),
    },
    {
      title: "Tax",
      value: "Tax",
      content: (
        <div className="w-full overflow-auto relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold  bg-gradient-to-br from-stone-100 to-stone-200">
          <p>Tax</p>
        </div>
      ),
    },
    {
      title: "Healthcare",
      value: "healthcare",
      content: (
        <div className="w-full overflow-auto relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold  bg-gradient-to-br from-stone-100 to-stone-200">
          <p>Healthcare</p>
        </div>
      ),
    },
    {
      title: "Contracts",
      value: "contracts",
      content: (
        <div className="w-full overflow-auto relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold  bg-gradient-to-br from-stone-100 to-stone-200">
          <p>Contracts</p>
        </div>
      ),
    },
    {
      title: "test1",
      value: "test1",
      content: (
        <div className="w-full overflow-auto relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold  bg-gradient-to-br from-stone-100 to-stone-200">
          <p>test1</p>
        </div>
      ),
    },
    {
      title: "test2",
      value: "test2",
      content: (
        <div className="w-full overflow-auto relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold  bg-gradient-to-br from-stone-100 to-stone-200">
          <p>test2</p>
        </div>
      ),
    },
  ];

  return (
    <div className="h-full md:h-[40rem] [perspective:1000px] relative b flex flex-col overflow-visible mx-auto w-full  items-start justify-start">
      <Tabs tabs={tabs} />
    </div>
  );
}
