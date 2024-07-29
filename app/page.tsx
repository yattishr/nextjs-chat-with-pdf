import Image from "next/image";
import "./globals.css";
import {
  BrainCogIcon,
  GlobeIcon,
  MonitorSmartphoneIcon,
  ServerCogIcon,
  ZapIcon,
  MoonIcon,
  SunIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const features = [
  {
    name: "Store your PDF Documents",
    description: "Keep all your important PDF files securely stored",
    icon: GlobeIcon,
  },
  {
    name: "Chat with your PDFs",
    description: "Chat with your PDFs using AI",
    icon: BrainCogIcon,
  },
  {
    name: "Summarize your PDFs",
    description: "Summarize your PDFs using AI",
    icon: MonitorSmartphoneIcon,
  },
  {
    name: "Ask any question about your PDFs",
    description: "Ask any question about your PDFs using AI",
    icon: ServerCogIcon,
  },
  {
    name: "Powered by OpenAI",
    description: "Powered by OpenAI",
    icon: ZapIcon,
  },
  {
    name: "Open Source",
    description: "Open Source",
    icon: BrainCogIcon,
  },
  {
    name: "Free to use",
    description: "Free to use",
    icon: MonitorSmartphoneIcon,
  },
  {
    name: "Fast",
    description: "Fast",
    icon: ServerCogIcon,
  },
];

export default function Home() {

  return (
    <main className="flex-1 overflow-scroll p-2 lg:p-5 bg-gradient-to-bl from-white to-indigo-600">
      <div className="bg-white py-24 sm:py-32 rounded-md drop-shadow-xl">
        <div className="flex flex-col justify-center items-center mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">
              Your interactive Document Companion
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Transform your PDFs into interactive conversations.
            </p>
            <p className="mt-6 text-lg leading-0 text-gray-600">
              Introducing{" "}
              <span className="font-bold text-indigo-600">Chat with PDFs.</span>
              <br />
              <br /> Upload your document, and our chatbot will answer
              questions, summarize content, and answer all your Questions! Ideal
              for everyone{" "}
              <span className="font-bold text-indigo-600">
                Chat with PDF
              </span>{" "}
              turns static documents into{" "}
              <span className="font-bold">dynamic conversations</span>,
              enhancing productivity 10x fold effortlessly.
            </p>
          </div>
          <Button asChild className="mt-10">
            <Link href="/dashboard">Get Started 🔥</Link>
          </Button>
        </div>

        <div className="relative overflow-hidden pt-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <Image
              alt="App screenshot"
              src="https://i.imgur.com/VciRSTI.jpeg"
              width={2432}
              height={1442}
              className="mb-[-0%] rounded-xl shadow-2xl ring-1 ring-gray-900/10"
            />
            <div aria-hidden="true" className="relative">
              <div className="absolute bottom-0 -inset-x-32 bg-gradient-to-t from-white/95 pt-[5%]" />
            </div>
          </div>
        </div>
        <div className="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-10 text-base leading-7 text-gray-600 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-9">
                <dt className="inline font-semibold text-gray-900">
                  <feature.icon
                    className="absolute top-1 left-1 h-5 w-5 text-indigo-600"
                    aria-hidden="true"
                  />
                  {feature.name}
                </dt>{" "}
                <dd className="inline">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </main>
  );
}
