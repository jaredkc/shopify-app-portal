import {
  BlockStack,
  reactExtension,
  Card,
  useSettings,
  Text,
  Button,
  InlineStack,
  useApi,
} from "@shopify/ui-extensions-react/customer-account";

export default reactExtension(
  "customer-account.order-index.block.render",
  () => <BannerCard />,
);

interface Settings {
  title?: string;
  description?: string;
  button_label?: string;
  button_url?: string;
}

function BannerCard() {
  const { i18n } = useApi();

  const { title, description, button_label, button_url }: Settings =
    useSettings();

  return (
    <Card padding>
      <InlineStack
        blockAlignment="center"
        inlineAlignment="center"
        spacing="loose"
      >
        <BlockStack spacing="extraTight">
          <Text size="large">{title || i18n.translate("welcome")}</Text>
          <Text size="base">
            {description || i18n.translate("description")}
          </Text>
        </BlockStack>
        {button_url && (
          <Button to={button_url}>
            {button_label || i18n.translate("button_label")}
          </Button>
        )}
      </InlineStack>
    </Card>
  );
}
