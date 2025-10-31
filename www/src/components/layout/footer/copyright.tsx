"use cache";

import { Muted } from "@/components/ui/typography";
import { siteConfig } from "@/lib/config/config";
import { cacheLife } from "next/cache";

export default async function Copyright() {
  cacheLife("max");

  return (
    <div className="mx-4 flex flex-col gap-y-1">
      <Muted>
        Copyright &copy; {new Date().getUTCFullYear()} {siteConfig.author}. Some
        rights reserved.
      </Muted>
      <Muted>Contents distributed under CC BY-SA 4.0.</Muted>
    </div>
  );
}
