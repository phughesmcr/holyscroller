import { Head } from "$fresh/runtime.ts";
import { PageProps } from "$fresh/server.ts";
import { APP_NAME } from "@lib/constants.ts";

export default function Error500Page({ error }: PageProps) {
  return (
    <>
      <Head>
        <title>{APP_NAME} | Oops!</title>
      </Head>
      <p>Internal error (code 500): {(error as Error).message}</p>
    </>
  );
}
