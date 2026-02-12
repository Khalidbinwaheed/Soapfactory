import Image from "next/image"

interface AuthLayoutProps {
  children: React.ReactNode
  imageSrc?: string
}

export function AuthLayout({ children, imageSrc = "https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop" }: AuthLayoutProps) {
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="hidden bg-muted lg:block relative h-full w-full overflow-hidden">
        <Image
          src={imageSrc}
          alt="Authentication background"
          fill
          className="object-cover dark:brightness-[0.2] dark:grayscale"
          priority
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute bottom-10 left-10 text-white p-6 max-w-md">
           <h1 className="text-4xl font-bold mb-4 font-serif">Manage Your Soap Factory With Precision</h1>
           <p className="text-lg opacity-90">Complete ERP system for inventory, orders, batches, shipments, and more — all in one place.</p>
        </div>
      </div>
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          {children}
        </div>
      </div>
    </div>
  )
}
