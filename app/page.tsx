import AuthButton from "@/components/buttons/AuthButton"
import PawButton from "@/components/buttons/PawButton"
import Header from "@/components/Header"
import Link from "next/link"

export default async function Index() {
  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
          <PawButton />
          <AuthButton />
        </div>
      </nav>

      <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 max-w-4xl px-3">
        <Header />
        <main className="flex-1 flex flex-col gap-6">
          <h2 className="font-bold text-4xl mb-4">Next steps</h2>
          <Link href="/new-ticket" className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover w-4/5 sm:w-auto">
            Submit a ticket
          </Link>
          <Link href="/admin-panel" className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover w-4/5 sm:w-auto">
            Resolve tickets
          </Link>
        </main>
      </div>

      <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
        <p>
          Powered by{" "}
          <a href="https://www.feralcatsofbergencounty.com/ourcats" target="_blank" className="font-bold hover:underline" rel="noreferrer">
            Feral Cats
          </a>
        </p>
      </footer>
    </div>
  )
}
