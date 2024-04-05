import BackButton from "@/components/buttons/BackButton"
import TableComponent from "./table"
import { createClient } from "@/utils/supabase/server"

export default async function Page() {
  const supabase = createClient()
  const { data: tickets } = await supabase.from("tickets").select()
  console.log("tickets count:", tickets?.length)

  return (
    <div className="flex flex-col space-y-16 items-center justify-center h-screen">
      <BackButton />
      <div>
        <h2 className="text-2xl lg:text-3xl mx-auto max-w-xl text-center">Tickets Queue</h2>
      </div>
      <div className="overflow-x-auto">
        <TableComponent tickets={tickets ?? []} />
      </div>
    </div>
  )
}
