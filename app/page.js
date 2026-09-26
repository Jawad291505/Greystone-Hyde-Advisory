export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center px-6">
      <h1 className="text-5xl font-bold tracking-tight text-center">
        Greystone Hyde Advisory
      </h1>
      <p className="mt-4 max-w-xl text-center text-lg text-slate-400">
        A Next.js app built with JSX and Tailwind CSS.
      </p>
      <a
        href="https://nextjs.org/docs"
        className="mt-8 rounded-full bg-indigo-500 px-6 py-3 font-medium text-white transition hover:bg-indigo-400"
      >
        Read the docs
      </a>
    </main>
  );
}
