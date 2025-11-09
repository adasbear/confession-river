"use client";

export default function Home() {
  return (
    <>
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulseGlow {
          0%, 100% {
            box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
          }
          50% {
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
          }
        }

        .panel-entrance {
          animation: fadeInUp 0.8s ease-out;
        }

        .join-button {
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .join-button:hover {
          transform: scale(1.05);
          box-shadow: 0 0 20px rgba(255, 215, 0, 0.8);
        }

        .join-button-pulse {
          animation: pulseGlow 2s infinite;
        }
      `}</style>
      <div className="relative flex h-screen w-full flex-col font-code" style={{ fontFamily: "Fira Code, monospace" }}>
        <main className="flex h-full grow flex-col items-center justify-center p-4">
          <div className="panel-entrance flex w-full max-w-sm flex-col items-center justify-center rounded-lg border border-gold bg-black p-8 shadow-lg shadow-yellow-500/10">
            <h1 className="text-3xl font-bold text-gold" style={{ textShadow: "0 0 5px rgba(255, 215, 0, 0.5)" }}>
              Confession River
            </h1>
            <p className="mt-2 text-center text-sm font-medium text-red-500" style={{ textShadow: "0 0 4px rgba(220, 38, 38, 0.6)" }}>
              Drop your truth into the night.
            </p>
            <div className="mt-8 w-full">
              <form action="/api/join" method="POST" className="w-full">
                <button
                  type="submit"
                  className="join-button join-button-pulse flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 border border-gold bg-blood-red px-5 text-base font-bold tracking-wider text-white hover:bg-red-900 transition-colors duration-300"
                >
                  <span className="truncate">Join »</span>
                </button>
              </form>
            </div>
          </div>
        </main>
        <footer className="w-full pb-4">
          <p className="text-center text-sm font-normal text-gold opacity-60">© 2025</p>
        </footer>
      </div>
    </>
  );
}
