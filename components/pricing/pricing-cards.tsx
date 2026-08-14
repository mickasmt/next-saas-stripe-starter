"use client";

import { useContext } from "react";
import { pricingData } from "@/config/subscriptions";
import { Button } from "@/components/ui/button";
import { ModalContext } from "@/components/modals/providers";
import { HeaderSection } from "@/components/shared/header-section";
import { Icons } from "@/components/shared/icons";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";

export function PricingCards() {
  const { setShowSignInModal } = useContext(ModalContext);
  return <MaxWidthWrapper><section className="flex flex-col items-center text-center"><HeaderSection label="Pricing" title="Choose how you want to learn" /><p className="mt-4 max-w-2xl text-muted-foreground">Prices are published by the LMS backend in NGN. USD remains disabled for Phase 1.</p><div className="grid gap-5 bg-inherit py-10 lg:grid-cols-2">{pricingData.map((offer) => <div className="flex flex-col overflow-hidden rounded-3xl border text-left shadow-sm" key={offer.title}><div className="space-y-3 bg-muted/50 p-6"><p className="font-urban text-sm font-bold uppercase tracking-wider">{offer.title}</p><p className="text-muted-foreground">{offer.description}</p></div><div className="flex h-full flex-col justify-between gap-8 p-6"><ul className="space-y-2 text-sm">{offer.benefits.map((feature) => <li className="flex gap-3" key={feature}><Icons.check className="size-5 shrink-0" />{feature}</li>)}</ul><Button rounded="full" onClick={() => setShowSignInModal(true)}>Sign in to view price</Button></div></div>)}</div></section></MaxWidthWrapper>;
}
