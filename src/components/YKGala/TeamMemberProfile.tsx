import React from "react";
import type { Person } from "./constants";

export default function TeamMemberProfile({ person }: { person: Person }) {
  return (
    <section className="min-h-screen flex items-center justify-center">
      <div className="container px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div className="flex justify-center">
          <img
            src={person.image}
            alt={`${person.name} portrait`}
            loading="lazy"
            className="size-64 md:size-80 rounded-full object-cover border"
          />
        </div>
        <article className="space-y-4 text-center md:text-left">
          <h3 className="text-3xl md:text-4xl font-bold">{person.name}</h3>
          <p className="text-brand text-lg md:text-xl font-semibold">
            {person.title}
          </p>
          <p className="text-lg md:text-xl text-muted-foreground">
            {person.description}
          </p>
        </article>
      </div>
    </section>
  );
}
