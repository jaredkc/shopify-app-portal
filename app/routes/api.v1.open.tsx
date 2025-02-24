import type { LoaderFunctionArgs } from "@remix-run/node";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return Response.json({
    message: "This is a public API",
  });
};
