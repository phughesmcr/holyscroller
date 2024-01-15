import { Head } from "$fresh/runtime.ts";
import { APP_NAME } from "@lib/constants.ts";

export default function Error404(props?: { message?: string }) {
  const { message = "The page or data you were looking for doesn't exist." } = props || {};
  return (
    <>
      <Head>
        <title>{APP_NAME} | Oops!</title>
      </Head>
      <div className="min-w-0 min-h-0 w-full h-full">
        <div className="px-4 py-8 mx-auto w-full h-full bg-zinc-100 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-100">
          <div className="max-w-screen-md mx-auto flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold">Something went wrong.</h1>
            <p className="my-4">
              {message}
            </p>
            <a href="/" className="underline font-bold">Go back home</a>
          </div>
        </div>
      </div>
    </>
  );
}
