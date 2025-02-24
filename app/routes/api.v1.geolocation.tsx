import type { LoaderFunctionArgs } from "@remix-run/node";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";

import { authenticate } from "../shopify.server";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.public.appProxy(request);

  return Response.json({
    shop: session?.shop,
    message: "This response is from the API through the app proxy",
  });
};
