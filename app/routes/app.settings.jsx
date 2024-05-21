import {
  Box,
  Card,
  InlineGrid,
  TextField,
  Button,
  Page,
  Text,
  BlockStack,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useLoaderData, Form } from "@remix-run/react";
import { json } from "@remix-run/node";  // Correct import
import React, { useState } from "react";
import db from '../db.server';

export async function loader() {
  let settings = await db.settings.findFirst();
  return json(settings);
}

export async function action({ request }) {
  let settings = await request.formData();

  settings = Object.fromEntries(settings);

  await db.settings.upsert({
    where: {
      id: '1'
    },
    update: {
      id: '1',
      name: settings.name,
      description: settings.description
    },
    create: {
      id: '1',
      name: settings.name,
      description: settings.description
    },
  })

  return json({message: settings});
}

export default function SettingsPage() {
  const settings = useLoaderData();
  const [formState, setFormState] = useState(settings);

  return (
    <Page>
      <TitleBar title="Additional page" />
        <BlockStack gap={{ xs: "8", sm: "4" }}>
          <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="4">
            <Box
              as="section"
              paddingInlineStart={{ xs: 4, sm: 0 }}
              paddingInlineEnd={{ xs: 4, sm: 0 }}
            >
              <BlockStack gap="4">
                <Text as="h3" variant="headingMd">
                  Settings
                </Text>
                <Text as="p" variant="bodyMd">
                  Update app settings and preferences.
                </Text>
              </BlockStack>
            </Box>
            <Card roundedAbove="sm">
              <Form method="POST">
              <BlockStack gap="4">
                <TextField
                  label="App name"
                  name="name"
                  value={formState?.name}
                  onChange={(value) => setFormState({ ...formState, name: value })}
                />
                <TextField
                  label="Description"
                  name="description"
                  value={formState?.description}
                  onChange={(value) => setFormState({ ...formState, description: value })}
                />
                <Button submit>Save</Button>
              </BlockStack>
              </Form>
            </Card>
          </InlineGrid>
        </BlockStack>
    </Page>
  );
}
