import { WebServiceClient } from "@maxmind/geoip2-node";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import invariant from "tiny-invariant";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  invariant(process.env.MAXMIND_ACCOUNT_ID, "MAXMIND_ACCOUNT_ID is not set");
  invariant(process.env.MAXMIND_LICENSE_KEY, "MAXMIND_LICENSE_KEY is not set");

  const { session } = await authenticate.public.appProxy(request);
  const ipFromHeader = request.headers.get("x-forwarded-for");

  if (!ipFromHeader) {
    return json({
      message: "No IP address found in request headers",
    });
  }

  const ipAddress = ipFromHeader.split(",")[0];

  let message = `Geolocation based on your IP address ${ipAddress}`;

  // To query the GeoLite2 web service, you must set the optional `host` parameter
  const client = new WebServiceClient(
    process.env.MAXMIND_ACCOUNT_ID,
    process.env.MAXMIND_LICENSE_KEY,
    {
      host: "geolite.info",
    },
  );

  // You can also use `client.city` or `client.insights`
  // `client.insights` is not available to GeoLite2 users
  const geolocation = await client
    .country(ipAddress)
    .then((response) => response);

  return json({
    geolocation: geolocation.country,
    message: message,
    shop: session?.shop,
  });
};
