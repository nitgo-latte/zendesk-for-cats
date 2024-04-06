import BackButton from "@/components/buttons/BackButton"
import TableComponent from "./table"

export default async function Page() {
  return (
    <div className="flex flex-col space-y-16 items-center justify-center h-screen">
      <BackButton />
      <div className="mb-2 sm:mb-10">
        <h2 className="text-2xl lg:text-3xl mx-auto max-w-xl text-center">Tickets Queue</h2>
      </div>
      <TableComponent />
    </div>
  )
}
