import { HeaderSection } from '@/components/shared/header-section';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { messages } from '@/messages';

const m = messages.homePage.faqs;

const faqItems = [
  { id: 'item-1', question: m.items['item-1'].question, answer: m.items['item-1'].answer },
  { id: 'item-2', question: m.items['item-2'].question, answer: m.items['item-2'].answer },
  { id: 'item-3', question: m.items['item-3'].question, answer: m.items['item-3'].answer },
  { id: 'item-4', question: m.items['item-4'].question, answer: m.items['item-4'].answer },
  { id: 'item-5', question: m.items['item-5'].question, answer: m.items['item-5'].answer },
] as const;

export default function FaqSection() {
  return (
    <section id="faqs" className="px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <HeaderSection
          title={m.title}
          titleAs="h2"
          subtitle={m.subtitle}
          subtitleAs="p"
        />

        <div className="mx-auto mt-12 max-w-4xl">
          <Accordion className="ring-muted w-full rounded-2xl border px-8 py-3 shadow-sm ring-4 dark:ring-0">
            {faqItems.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border-dashed"
              >
                <AccordionTrigger className="cursor-pointer text-base hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-base text-muted-foreground">
                    {item.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
