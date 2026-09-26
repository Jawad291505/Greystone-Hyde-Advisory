import Image from "next/image";

// The photo is deliberately static: it stays grounded while the particle
// layer and content move around it. Only a slow settle-in on load.
export default function HeroMedia() {
  return (
    <div className="absolute inset-0 -z-30">
      <div className="hero-zoom absolute inset-0">
        <Image
          src="/hero-london.jpg"
          alt="Aerial view of the Thames, Tower Bridge and the Canary Wharf financial district in London"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[72%_50%] grayscale-[0.55] contrast-110 lg:object-[65%_50%]"
        />
      </div>
    </div>
  );
}
