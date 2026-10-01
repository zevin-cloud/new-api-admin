import { useTranslation } from "react-i18next";
import { TitledCard } from "new-api-admin-ui/ui/titled-card";
import { AspectRatio } from "new-api-admin-ui/ui/aspect-ratio";
import { ScrollArea } from "new-api-admin-ui/ui/scroll-area";
import { Separator } from "new-api-admin-ui/ui/separator";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "new-api-admin-ui/ui/resizable";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "new-api-admin-ui/ui/carousel";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "new-api-admin-ui/ui/collapsible";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "new-api-admin-ui/ui/accordion";
import {
  ItemGroup,
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
} from "new-api-admin-ui/ui/item";
import { Button } from "new-api-admin-ui/ui/button";
import { Avatar, AvatarFallback } from "new-api-admin-ui/ui/avatar";
import { DirectionProvider } from "new-api-admin-ui/ui/direction";
import { RichContent, LongText, TruncatedText, AnimateInView, FadeIn } from "new-api-admin-ui";
export function ContentGallery(props: { navigate: (href: string) => void }) {
  const { t } = useTranslation();
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <TitledCard title={t("Resizable panels")}>
        <ResizablePanelGroup orientation="horizontal" className="min-h-48 rounded-lg border">
          <ResizablePanel defaultSize="40%">
            <div className="p-5">{t("Sidebar")}</div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel>
            <div className="p-5">{t("Content")}</div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </TitledCard>
      <TitledCard title={t("Carousel and aspect ratio")}>
        <Carousel className="mx-10">
          <CarouselContent>
            {[1, 2, 3].map((value) => (
              <CarouselItem key={value}>
                <AspectRatio ratio={16 / 9}>
                  <div className="bg-muted flex size-full items-center justify-center rounded-lg text-3xl font-semibold">
                    {value}
                  </div>
                </AspectRatio>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </TitledCard>
      <TitledCard title={t("Collapsible content")}>
        <Collapsible>
          <CollapsibleTrigger render={<Button variant="outline" />}>
            {t("Show more")}
          </CollapsibleTrigger>
          <CollapsibleContent className="p-4 text-sm">
            {t("Additional information")}
          </CollapsibleContent>
        </Collapsible>
        <Separator className="my-4" />
        <Accordion>
          <AccordionItem value="one">
            <AccordionTrigger>{t("How to reuse this template?")}</AccordionTrigger>
            <AccordionContent>
              {t("Copy a page, remove what you do not need, then connect your API.")}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="two">
            <AccordionTrigger>{t("Where is the data stored?")}</AccordionTrigger>
            <AccordionContent>
              {t("Demo data is stored in memory and resets on refresh.")}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </TitledCard>
      <TitledCard title={t("Items and scrolling")}>
        <ScrollArea className="h-64">
          <ItemGroup>
            {["Alex", "Jamie", "Morgan", "Taylor"].map((name) => (
              <Item key={name}>
                <ItemMedia>
                  <Avatar>
                    <AvatarFallback>{name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{name}</ItemTitle>
                  <ItemDescription>{t("Team member")}</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Button variant="ghost" size="sm" onClick={() => props.navigate("/projects")}>
                    {t("View")}
                  </Button>
                </ItemActions>
              </Item>
            ))}
          </ItemGroup>
        </ScrollArea>
      </TitledCard>
      <TitledCard title={t("Rich content")}>
        <RichContent
          content={`### new-api Admin\n\n${t("Copy a page, remove what you do not need, then connect your API.")}\n\n- React\n- TypeScript\n- Tailwind CSS`}
        />
        <Separator className="my-4" />
        <RichContent mode="html" content="<p><strong>new-api Admin</strong> · QuantumNous</p>" />
      </TitledCard>
      <TitledCard title={t("Long text and motion")}>
        <div className="space-y-5">
          <LongText className="max-w-48">
            {t("Copy a page, remove what you do not need, then connect your API.")}
          </LongText>
          <TruncatedText
            text={t("Copy a page, remove what you do not need, then connect your API.")}
          />
          <FadeIn>
            <p>{t("Fade transition")}</p>
          </FadeIn>
          <AnimateInView>
            <p>{t("Scroll transition")}</p>
          </AnimateInView>
          <DirectionProvider direction="rtl">
            <div dir="rtl" className="rounded-lg border p-3 text-start">
              {t("Right to left")} ←
            </div>
          </DirectionProvider>
        </div>
      </TitledCard>
    </div>
  );
}
