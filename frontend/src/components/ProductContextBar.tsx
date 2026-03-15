"use client";

import { useState } from "react";
import { Globe, PencilLine, Save } from "lucide-react";
import { ProductContext } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

interface Props {
  product: ProductContext;
  onUpdate: (product: ProductContext) => void;
}

export default function ProductContextBar({ product, onUpdate }: Props) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(product.name);
  const [url, setUrl] = useState(product.url);

  const handleSave = () => {
    onUpdate({ name, url });
    setEditing(false);
  };

  return (
    <Card className="w-full max-w-3xl rounded-[26px] border-white/10 bg-white/[0.03]">
      <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/20 bg-primary/12 text-indigo-100">
            <Globe className="h-5 w-5" />
          </div>
          {editing ? (
            <div className="grid gap-2 sm:grid-cols-2">
              <Input value={name} onChange={(e) => setName(e.target.value)} autoFocus placeholder="Company or product name" />
              <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="product URL" />
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-slate-100">{product.name}</p>
                <Badge variant="default" className="normal-case tracking-normal text-[10px]">
                  Active target
                </Badge>
              </div>
              <p className="mt-1 text-sm text-slate-400">{product.url}</p>
            </div>
          )}
        </div>
        {editing ? (
          <Button onClick={handleSave} size="sm" className="rounded-xl">
            <Save className="h-4 w-4" />
            Save target
          </Button>
        ) : (
          <Button onClick={() => setEditing(true)} variant="outline" size="sm" className="rounded-xl">
            <PencilLine className="h-4 w-4" />
            Change product
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
