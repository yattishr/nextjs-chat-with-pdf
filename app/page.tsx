import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import FloatingBubbles from "@/components/FloatingBubbles";

import {
  BrainCogIcon,
  GlobeIcon,
  MonitorSmartphoneIcon,
  ServerCogIcon,
  ZapIcon,
} from "lucide-react";

const features = [
  {
    name: "Secure PDF Storage",
    description: "Safely store and organize all your important PDFs in one place",
    icon: GlobeIcon,
  },
  {
    name: "Interactive PDF Conversations",
    description: "Engage in dynamic, AI-powered chats with your document content",
    icon: BrainCogIcon,
  },
  {
    name: "Instant Document Summaries",
    description: "Get quick, AI-generated overviews of lengthy documents in seconds",
    icon: MonitorSmartphoneIcon,
  },
  {
    name: "Intelligent Q&A",
    description: "Extract precise information with AI-powered answers to any question",
    icon: ServerCogIcon,
  },
  {
    name: "OpenAI Integration",
    description: "Harness the power of advanced language models for accurate insights",
    icon: ZapIcon,
  },
  {
    name: "Open Source Transparency",
    description: "Contribute to and benefit from our collaborative, community-driven platform",
    icon: BrainCogIcon,
  },
  {
    name: "Cost-Effective Solution",
    description: "Access premium features without breaking the bank",
    icon: MonitorSmartphoneIcon,
  },
  {
    name: "Blazing Fast Performance",
    description: "Experience swift document processing and near-instant responses",
    icon: ServerCogIcon,
  },
];

export default function Home() {
  return (
    <main className="flex-1 overflow-scroll p-2 lg:p-5 bg-gradient-to-bl from-white to-indigo-600">
      <FloatingBubbles />
      <div className="min-h-screen flex flex-col justify-center items-center py-12 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl w-full space-y-16 relative z-10">
          {/* Hero Section */}
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              Transform your PDFs into
              <span className="text-indigo-600"> interactive conversations</span>
            </h1>
            <p className="mt-6 text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto">
              Introducing <span className="font-bold text-indigo-600">Bubbles Doc</span>.
              Upload your document, and our intelligent AI will answer questions, summarize content, and more!
            </p>
            <Button asChild className="mt-10 text-lg px-8 py-3">
              <Link href="/dashboard">Get Started 🚀</Link>
            </Button>
          </div>

          {/* Screenshot Section */}
          {/* <div className="relative">
            <Image
              alt="App screenshot"
              src="https://i.imgur.com/VciRSTI.jpeg"
              width={2432}
              height={1442}
              className="rounded-xl shadow-2xl ring-1 ring-gray-900/10"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent" />
          </div> */}

          {/* Features Section */}
          <div className="bg-white/80 py-16 sm:py-24 rounded-lg shadow-xl">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                Powerful Features at Your Fingertips
              </h2>
              <dl className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
                {features.map((feature) => (
                  <div key={feature.name} className="relative pl-16">
                    <dt className="text-base font-semibold leading-7 text-gray-900">
                      <div className="absolute top-0 left-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                        <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                      </div>
                      {feature.name}
                    </dt>
                    <dd className="mt-2 text-base leading-7 text-gray-600">{feature.description}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}