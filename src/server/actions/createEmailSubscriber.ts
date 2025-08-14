"use server";

import { env } from "@/env";
import { db } from "@/server/db";
import { emailSubscribers } from "@/server/db/schema";
import { eq } from "drizzle-orm";
export async function createEmailSubscriber(data: {
  name: string;
  email: string;
}): Promise<{
  success: boolean;
  message: string;
}> {
  const [firstName, lastName] = data.name.split(" ");

  const existingUser = await db
    .select()
    .from(emailSubscribers)
    .where(eq(emailSubscribers.email, data.email));

  if (existingUser.length > 0) {
    return {
      success: true,
      message: "Email subscriber already exists",
    };
  }

  await db
    .insert(emailSubscribers)
    .values({
      firstName,
      lastName,
      email: data.email,
    })
    .returning();

  // Add to EmailOctopus list
  try {
    const response = await fetch(
      "https://api.emailoctopus.com/lists/1d4763a0-05c3-11f0-9082-57831693063a/contacts",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.EMAIL_OCTOPUS_AUTH_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_address: data.email,
          status: "subscribed",
          fields: {
            FirstName: firstName,
            LastName: lastName,
          },
        }),
      },
    );
    if (!response.ok) {
      const errorData = await response.json();
      if (errorData.status === 409) {
        return {
          success: true,
          message: "Email subscriber already exists",
        };
      }
      throw new Error(JSON.stringify(errorData));
    }

    return {
      success: true,
      message: "Email subscriber created successfully",
    };
  } catch (error) {
    console.error("Error creating Email subscriber:", error);

    return {
      success: false,
      message: "Failed to create Email subscriber",
    };
  }
}
