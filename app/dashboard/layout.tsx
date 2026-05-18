export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <section className="flex flex-1 flex-col">{children}</section>;
}
