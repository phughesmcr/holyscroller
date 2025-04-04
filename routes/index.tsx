import { asset } from "$fresh/runtime.ts";

export default function Home() {
  return (
    <div class="px-4 py-8 mx-auto w-full h-full bg-[#fafafa]">
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <img
          class="my-6"
          src={asset("/logo.png")}
          width="128"
          height="128"
          alt="the HolyScroller logo"
        />
        <h1 class="text-4xl font-bold">HolyScroller.app</h1>
        <p class="mb-4 bold">Scroll the Scriptures!</p>
        <p>Available on iOS and Android</p>
        <p><a class="text-blue-500 underline" href="mailto:support@holyscroller.app">support@holyscroller.app</a></p>
        <p><a class="text-blue-500 underline" href="/privacy">Privacy Policy</a></p>
        <p class="mt-4 text-sm">Copyright 2025. All rights reserved.</p>
      </div>
    </div>
  );
}
