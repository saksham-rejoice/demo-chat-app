import Header from '../../../components/dashboard/Instagram/Header'
import Footer from '../../../components/dashboard/Instagram/Footer'

export default function InstagramLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      {/* <Footer /> */}
    </div>
  )
}