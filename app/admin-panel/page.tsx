import BackButton from "@/components/BackButton"
import { createClient } from "@/utils/supabase/server"
import EditButton, { TicketStatus } from "./EditButton"

export default async function AdminPanel() {
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
        <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
          <thead className="ltr:text-left rtl:text-right">
            <tr>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Name</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Email</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Description</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Status</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {tickets?.map((tic, idx) => {
              return (
                <tr key={idx}>
                  <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{tic.name}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">{tic.email}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">{tic.description}</td>
                  <td className="whitespace-nowrap px-4 py-2 text-gray-700">{tic.status}</td>
                  <td className="whitespace-nowrap px-4 py-2">
                    <EditButton ticketId={tic.id} status={tic.status as TicketStatus} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
